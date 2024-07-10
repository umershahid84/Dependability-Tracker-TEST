'use client';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useInputValidation, IUseValidators} from '../../hooks';
import {FormInput, Form, FormAction, makeToast, ToastTypes} from '../../components';

export type FormState = {
  password: string | null;
  email: string | null;
  confirmPassword: string | null;
};

export const defaultFormState: FormState = {
  email: '',
  password: '',
  confirmPassword: ''
};

export default function SignUpForm(): React.JSX.Element {
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState<boolean | null>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [verifiedPasswordErrors, setVerifiedPasswordErrors] = useState<string[]>([]);

  // Create validators for each field
  const validatedPassword: IUseValidators = useInputValidation({
    value: formState.password as string,
    property: 'password'
  });

  const validatedEmail: IUseValidators = useInputValidation({
    value: formState.email as string,
    property: 'email'
  });

  const validatedVerifiedPassword: IUseValidators = useInputValidation({
    value: {
      password: formState.password as string,
      verifiedPassword: formState.confirmPassword as string
    },
    property: 'verifiedPassword'
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
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
          inviteToken: token,
          inviteId: inviteId
        })
      });

      if (!response.ok) {
        makeToast({
          title: 'Error',
          type: ToastTypes.Error,
          message: 'There was an error creating your account. Please try again.',
          timeOut: 7500
        });
      } else {
        const data = await response.json();

        makeToast({
          title: 'Success',
          type: ToastTypes.Success,
          message: data.message
        });

        // reset the form and redirect to the dashboard
        setFormState(defaultFormState);
        // setTimeout(() => {
        //   window.location.href = '/dashboard';
        // }, 800);
      }
    } catch (error) {
      console.error(error);
      setHasError(true);
    }
  };

  //  Component Effects

  // clean mounting and unmounting
  useEffect(() => {
    setIsMounted(true);
    const urlParams = new URLSearchParams(window.location.search);
    const inviteId = urlParams.get('invite-id');
    const token = urlParams.get('token');

    if (inviteId && token) {
      setInviteId(inviteId);
      setToken(token);
    }
    return () => {
      setToken(null);
      setInviteId(null);
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

  useEffect(() => {
    if (isMounted) {
      validatedVerifiedPassword.validate();
    }
    // eslint-disable-next-line
  }, [formState.confirmPassword]);

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

      if (validatedVerifiedPassword.error.length > 0 && formState.confirmPassword !== '') {
        setVerifiedPasswordErrors(
          validatedVerifiedPassword.error.map(error => Object.values(error)[0])
        );
      } else {
        setVerifiedPasswordErrors([]);
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
        autoComplete="email"
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
        autoComplete="new-password"
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
        autoComplete="off"
        placeholder="Confirm your password"
        value={formState.confirmPassword ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedVerifiedPassword.validate}
        errors={verifiedPasswordErrors ?? []}
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
        <Link href={'/login'} className="text-blue-500 hover:text-[var(--green)]">
          Login here.
        </Link>
      </p>
    </Form>
  ) : (
    <></>
  );
}
