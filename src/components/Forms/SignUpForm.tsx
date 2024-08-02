'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { FormInputWithErrors, Form, FormAction } from '../../components';
import { useInputValidation, IUseValidators, useIsMounted } from '../../hooks';
import { ClientAPI, defaultSignUpFormState, SignUpFormState } from '../../client-api';

export type SignUpFormProps = {
  assignedEmail?: string;
};
export default function SignUpForm({ assignedEmail }: Readonly<SignUpFormProps>): React.JSX.Element {
  const router: NextRouter = useRouter();
  const isMounted: boolean = useIsMounted();
  const [token, setToken] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<SignUpFormState>({
    ...defaultSignUpFormState,
    email: assignedEmail ?? ''
  });
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

  //  event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // @ts-ignore
    const name = e?.target?.getAttribute('id') ?? '';
    // @ts-ignore
    const { value } = e.target;

    // update the form state
    setFormState({ ...formState, [name]: value });
  };

  const handleSignUp = async (e: React.SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    e?.stopPropagation();

    await ClientAPI.Supervisors.SignUp({
      router,
      formState,
      setHasError,
      setFormState,
      token: token as string,
      inviteId: inviteId as string
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === 'Enter' && isFormValid) {
      e.preventDefault();
      e.stopPropagation();
      handleSignUp(e);
    }
  };

  const validateConfirmedPassword = () => {
    if (formState.confirmPassword !== formState.password) {
      !verifiedPasswordErrors.includes('Passwords do not match') &&
        verifiedPasswordErrors.push('Passwords do not match');
    } else {
      setVerifiedPasswordErrors([]);
    }
  };

  // On Mount
  useEffect(() => {
    if (isMounted) {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteId = urlParams.get('invite-id');
      const token = urlParams.get('token');

      if (inviteId && token) {
        setInviteId(inviteId);
        setToken(token);
      }
    }
    return () => {
      setToken(null);
      setInviteId(null);
      setFormState({ ...defaultSignUpFormState, email: assignedEmail ?? '' });
    };
    // eslint-disable-next-line
  }, [isMounted]);

  // Field validation
  useEffect(() => {
    validatedEmail.validate();
    // eslint-disable-next-line
  }, [formState.email]);

  useEffect(() => {
    validatedPassword.validate();
    // eslint-disable-next-line
  }, [formState.password]);

  useEffect(() => {
    validateConfirmedPassword();
    // eslint-disable-next-line
  }, [formState.confirmPassword]);

  // Form validation
  useEffect(() => {
    if (isMounted) {
      const isEmailValid: boolean = validatedEmail.validated;
      const isPasswordValid: boolean = formState.password === formState.confirmPassword;

      if (isPasswordValid && isEmailValid) {
        //NOSONAR
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
    // eslint-disable-next-line
  }, [formState]);

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
    <Form onEnter={handleEnter}>
      {!assignedEmail && (
        <FormInputWithErrors
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
      )}
      <FormInputWithErrors
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
      <FormInputWithErrors
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
        onBlur={validateConfirmedPassword}
        errors={verifiedPasswordErrors ?? []}
      />
      <FormAction
        label="Create Account"
        isValid={isFormValid ?? false}
        hasError={hasError}
        onAction={handleSignUp}
      />
      <p className="mt-4 mb-2">
        Already have an account?{' '}
        <Link href={'/login'} className="text-blue-500 hover:text-accent">
          Login here.
        </Link>
      </p>
    </Form>
  ) : (
    <></>
  );
}
