import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { FormInputWithErrors, Form, FormAction } from '../../components';
import { useInputValidation, IUseValidators, useIsMounted } from '../../hooks';
import { ClientAPI, LoginFormState, defaultLoginFormState } from '../../client-api';

export default function LoginForm(): React.JSX.Element {
  const router: NextRouter = useRouter();
  const isMounted: boolean = useIsMounted();
  const [hasError, setHasError] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<LoginFormState>(defaultLoginFormState);

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
    const { value } = e.target;
    const name = e?.target?.getAttribute('id') ?? '';
    setFormState({ ...formState, [name]: value });
  };

  const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    e?.stopPropagation();

    await ClientAPI.Supervisors.Login({
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
