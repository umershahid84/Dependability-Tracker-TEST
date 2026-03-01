import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {NextRouter, useRouter} from 'next/router';
import {FormInputWithErrors, Form, FormAction} from '../../components';
import {useInputValidation, IUseValidators, useIsMounted} from '../../hooks';
import {type LoginFormState, defaultLoginFormState} from '../../client-api/supervisors';
import {Login} from '../../client-api/supervisors';

const REMEMBER_ME_KEY = 'rememberMe';
const SAVED_EMAIL_KEY = 'savedEmail';

export default function LoginForm(): React.ReactElement {
  const router: NextRouter = useRouter();
  const isMounted: boolean = useIsMounted();
  const [hasError, setHasError] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<LoginFormState>(defaultLoginFormState);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Load saved email on mount if remember me was previously checked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) ?? '';
      if (savedRememberMe && savedEmail) {
        setRememberMe(true);
        setFormState(prev => ({...prev, email: savedEmail}));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validatedEmail: IUseValidators = useInputValidation({
    property: 'email',
    value: formState.email
  });

  const validatedPassword: IUseValidators = useInputValidation({
    property: 'password',
    value: formState.password
  });

  //  event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {value} = e.target;
    const name = e?.target?.getAttribute('id') ?? '';
    setFormState({...formState, [name]: value});
  };

  const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    e?.stopPropagation();

    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
        localStorage.setItem(SAVED_EMAIL_KEY, formState.email);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }
    }

    await Login({
      router,
      formState,
      setHasError,
      setFormState
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === 'Enter' && isFormValid) {
      e.preventDefault();
      e.stopPropagation();
      handleLogin(e);
    }
  };

  // Field validation
  useEffect(() => {
    if (isMounted) {
      validatedEmail.validate();
    }
    // eslint-disable-next-line
  }, [formState.email]);

  useEffect(() => {
    if (isMounted) {
      validatedPassword.validate();
    }
    // eslint-disable-next-line
  }, [formState.password]);

  // Form validation
  useEffect(() => {
    if (isMounted) {
      const isUsernameValid: boolean = validatedEmail.validated;
      const isEncryptionPasswordValid: boolean = validatedPassword.validated;

      if (isUsernameValid && isEncryptionPasswordValid) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
    // eslint-disable-next-line
  }, [formState, validatedEmail.validated, validatedPassword.validated]);

  // Update the form state when input errors occur
  useEffect(() => {
    if (isMounted) {
      if (validatedEmail.error.length > 0 && formState.email !== '') {
        setUsernameErrors(validatedEmail.error.map(error => Object.values(error)[0]));
      } else {
        setUsernameErrors([]);
      }

      if (validatedPassword.error.length > 0 && formState.password !== '') {
        setPasswordErrors(validatedPassword.error.map(error => Object.values(error)[0]));
      } else {
        setPasswordErrors([]);
      }
    }
    // eslint-disable-next-line
  }, [validatedPassword.error, validatedEmail.error]);

  return isMounted ? (
    <Form onEnter={handleEnter}>
      <FormInputWithErrors
        label="Email"
        type="text"
        id="email"
        required
        autoComplete="email"
        placeholder="Enter your email"
        value={formState.email ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedEmail.validate}
        errors={usernameErrors ?? []}
      />

      <FormInputWithErrors
        label="Password"
        type="password"
        id="password"
        required
        autoComplete="current-password"
        placeholder="Enter your password"
        value={formState.password ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedPassword.validate}
        errors={passwordErrors ?? []}
      />

      <div className="w-full px-2">
        <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer select-none text-sm">
          <div className="relative w-4 h-4 flex-shrink-0">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="sr-only peer"
            />
            <div className="absolute inset-0 rounded border border-gray-500 bg-tertiary peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors" />
            <svg
              className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5">
              <polyline points="1.5,6 4.5,9 10.5,3" />
            </svg>
          </div>
          Remember me
        </label>
      </div>

      <FormAction
        label="Login"
        hasError={hasError}
        onAction={handleLogin}
        isValid={isFormValid ?? false}
      />

      <p className="mt-4 mb-2">
        Forgot password?{' '}
        <Link href={'/reset-password'} className="text-blue-500 hover:text-accent">
          Reset Credentials.
        </Link>
      </p>
    </Form>
  ) : (
    <></>
  );
}
