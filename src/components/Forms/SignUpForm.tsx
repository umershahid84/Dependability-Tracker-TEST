'use client';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {FormInput, Form, FormAction} from '../../components';
import {useInputValidation, IUseValidators} from '../../hooks';

export type FormState = {
  password: string | null;
  email: string | null;
};

export const defaultFormState: FormState = {
  password: '',
  email: ''
};

export default function SignUpForm(): React.JSX.Element {
  const [hasError, setHasError] = useState<boolean>(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState<boolean | null>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  // Create validators for each field
  const validatedPassword: IUseValidators = useInputValidation({
    value: formState.password,
    property: 'password'
  });

  const validatedEmail: IUseValidators = useInputValidation({
    value: formState.email,
    property: 'email'
  });

  //  event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // @ts-ignore
    const name = e?.target?.getAttribute('id') ?? '';
    // @ts-ignore
    const {value} = e.target;

    // update the form state
    setFormState({...formState, [name]: value});
  };

  const handleSignUp = async (e: Event): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setFormState(defaultFormState);
    } catch (error) {
      console.error(error);
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
      const isEmailValid: boolean = validatedEmail.validated;
      const isPasswordValid: boolean = validatedPassword.validated;

      if (isPasswordValid && isEmailValid) {
        //NOSONAR
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
      if (validatedPassword.error.length > 0 && formState.password !== '') {
        setPasswordErrors(validatedPassword.error.map(error => Object.values(error)[0]));
      } else {
        setPasswordErrors([]);
      }

      if (validatedEmail.error.length > 0 && formState.email !== '') {
        setEmailErrors(validatedEmail.error.map(error => Object.values(error)[0]));
      } else {
        setEmailErrors([]);
      }
    }
    // eslint-disable-next-line
  }, [validatedPassword.error, validatedEmail.error]);

  return isMounted ? (
    <Form>
      <FormInput
        label="Default Email"
        type="text"
        id="defaultEmail"
        required
        placeholder="This was preset by the admin"
        value={formState.email ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedEmail.validate}
        errors={emailErrors ?? []}
      />
      <FormInput
        label="Default Password"
        type="password"
        id="DefaultPassword"
        required
        placeholder="This was preset by the admin"
        value={formState.password ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedPassword.validate}
        errors={passwordErrors ?? []}
      />
      <FormInput
        label="Email"
        type="text"
        id="email"
        required
        placeholder="Enter your work email address"
        value={formState.email ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedEmail.validate}
        errors={emailErrors ?? []}
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
      <FormInput
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        required
        placeholder="Confirm your password"
        value={formState.password ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedPassword.validate}
        errors={passwordErrors ?? []}
      />
      <FormAction
        label="Create Account"
        type="signup"
        isValid={isFormValid ?? false}
        hasError={hasError}
        onAction={handleSignUp}
      />
      <p className="mt-4 mb-2">
        Already have an account?{' '}
        <Link href={'/'} className="text-blue-500 hover:text-[var(--green)]">
          Login here.
        </Link>
      </p>
    </Form>
  ) : (
    <></>
  );
}
