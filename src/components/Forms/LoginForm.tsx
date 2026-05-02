import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {NextRouter, useRouter} from 'next/router';
import {FormInputWithErrors, Form, FormAction} from '../../components';
import {useInputValidation, IUseValidators, useIsMounted} from '../../hooks';
import {type LoginFormState, defaultLoginFormState} from '../../client-api/supervisors';
import {Login} from '../../client-api/supervisors';

const SAVE_CREDENTIALS_KEY = 'savedLoginCredentials';

export default function LoginForm(): React.ReactElement {
  const router: NextRouter = useRouter();
  const isMounted: boolean = useIsMounted();
  const [hasError, setHasError] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<LoginFormState>(defaultLoginFormState);
  const [saveCredentials, setSaveCredentials] = useState<boolean>(false);

  const validatedEmail: IUseValidators = useInputValidation({
    property: 'email',
    value: formState.email
  });

  const validatedPassword: IUseValidators = useInputValidation({
    property: 'password',
    value: formState.password
  });

  // Load saved email on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_CREDENTIALS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Pick<LoginFormState, 'email'>;
        setFormState(prev => ({...prev, email: parsed.email ?? ''}));
        setSaveCredentials(true);
      }
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line
  }, []);

  //  event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {value} = e.target;
    const name = e?.target?.getAttribute('id') ?? '';
    setFormState({...formState, [name]: value});
  };

  const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    e?.stopPropagation();

    await Login({
      router,
      formState,
      setHasError,
      setFormState,
      onSuccess: () => {
        if (saveCredentials) {
          localStorage.setItem(SAVE_CREDENTIALS_KEY, JSON.stringify({email: formState.email}));
        } else {
          localStorage.removeItem(SAVE_CREDENTIALS_KEY);
        }
      }
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
        placeholder="Enter your password"
        value={formState.password ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedPassword.validate}
        errors={passwordErrors ?? []}
      />

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="saveCredentials"
          checked={saveCredentials}
          onChange={(e) => setSaveCredentials(e.target.checked)}
          className="w-4 h-4 cursor-pointer"
        />
        <label htmlFor="saveCredentials" className="cursor-pointer select-none">
          Save Credentials
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
