import {ClientAPI} from '../../client-api';
import React, {useEffect, useState} from 'react';
import {FormInputWithErrors, Form, FormAction} from '../../components';
import {useInputValidation, IUseValidators, useIsMounted} from '../../hooks';

export type ResetPasswordFormState = {
  username: string;
  email: string;
};

export const defaultResetPasswordFormState: ResetPasswordFormState = {
  username: '',
  email: ''
};

export function ResetPasswordForm(): React.JSX.Element {
  const isMounted: boolean = useIsMounted();
  const [hasError, setHasError] = useState<boolean>(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<ResetPasswordFormState>(defaultResetPasswordFormState);

  const validatedEmail: IUseValidators = useInputValidation({
    property: 'email',
    value: formState.email
  });

  //  event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {value} = e.target;
    const name = e?.target?.getAttribute('id') ?? '';
    setFormState({...formState, [name]: value});
  };

  const handleReset = async (e: React.SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    e?.stopPropagation();

    await ClientAPI.Supervisors.ResetPassword(formState);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === 'Enter' && isFormValid) {
      e.preventDefault();
      e.stopPropagation();
      handleReset(e);
    }
  };

  // Field validation
  useEffect(() => {
    if (isMounted) {
      validatedEmail.validate();
    }
    // eslint-disable-next-line
  }, [formState.email]);

  // Form validation
  useEffect(() => {
    if (isMounted) {
      const isUsernameValid: boolean = validatedEmail.validated;

      if (isUsernameValid && formState.email !== '') {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
    // eslint-disable-next-line
  }, [formState, validatedEmail.validated]);

  // Update the form state when input errors occur
  useEffect(() => {
    if (isMounted) {
      if (validatedEmail.error.length > 0 && formState.email !== '') {
        setEmailErrors(validatedEmail.error.map(error => Object.values(error)[0]));
      } else {
        setEmailErrors([]);
      }
    }
    // eslint-disable-next-line
  }, [validatedEmail.error]);

  return isMounted ? (
    <Form onEnter={handleEnter}>
      <FormInputWithErrors
        label="Name"
        type="text"
        id="username"
        required
        placeholder="First and last name"
        value={formState.username ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
      />

      <FormInputWithErrors
        label="Email"
        type="text"
        id="email"
        required
        placeholder="Enter your registered email"
        value={formState.email ?? ''}
        // eslint-disable-next-line
        // @ts-ignore
        onChange={handleInputChange}
        onBlur={validatedEmail.validate}
        errors={emailErrors ?? []}
      />

      <FormAction
        label="Reset"
        hasError={hasError}
        onAction={handleReset}
        isValid={isFormValid ?? false}
      />
    </Form>
  ) : (
    <></>
  );
}
