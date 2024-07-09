'use client';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {FormInput, Form, FormAction} from '../../components';
import {useInputValidation, IUseValidators} from '../../hooks';

interface FormState {
  email: string | null;
  password: string | null;
}

const defaultFormState: FormState = {email: '', password: ''};

export default function LoginForm(): React.JSX.Element {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean | null>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<FormState>(defaultFormState);

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
    const name = e?.target?.getAttribute('id') ?? '';
    const {value} = e.target;
    // update the form state
    setFormState({...formState, [name]: value});
  };

  const handleLogin = async (e: Event): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // reset the form state
      setFormState(defaultFormState);

      window.location.reload();
    } catch (error) {
      setHasError(true);
    }
  };

  //  Component Effects

  // clean mounting and unmounting
  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
      setFormState(defaultFormState);
    };
  }, []);

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
    <Form>
      <FormInput
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

      <FormInput
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
        type="login"
        isValid={isFormValid ?? false}
        hasError={hasError}
        onAction={handleLogin}
      />

      <p className="mt-4 mb-2">
        Don&apos;t have an account?{' '}
        <Link href={'./sign-up'} className="text-blue-500 hover:text-[var(--green)]">
          Sign up here.
        </Link>
      </p>
    </Form>
  ) : (
    <></>
  );
}
