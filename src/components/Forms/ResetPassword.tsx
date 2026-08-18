import React, {useEffect, useState} from 'react';
import {FormInputWithErrors, Form, FormAction} from '../../components';
import {Modal} from '../../components/Modal/Modal';
import {useInputValidation, IUseValidators, useIsMounted} from '../../hooks';
import {ResetPasswordRequest, ResetPasswordConfirm} from '../../client-api/supervisors';

export type ResetPasswordFormState = {
  username: string;
  email: string;
};

export const defaultResetPasswordFormState: ResetPasswordFormState = {
  username: '',
  email: ''
};

type ConfirmFormState = {
  code: string;
  password: string;
  confirmPassword: string;
};

const defaultConfirmFormState: ConfirmFormState = {
  code: '',
  password: '',
  confirmPassword: ''
};

export function ResetPasswordForm(): React.ReactElement {
  const isMounted: boolean = useIsMounted();
  const [hasError, setHasError] = useState<boolean>(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<ResetPasswordFormState>(defaultResetPasswordFormState);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmForm, setConfirmForm] = useState<ConfirmFormState>(defaultConfirmFormState);
  const [confirmErrors, setConfirmErrors] = useState<string[]>([]);
  const [isConfirmValid, setIsConfirmValid] = useState<boolean>(false);

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

    const success = await ResetPasswordRequest(formState);
    if (success) {
      setShowConfirmModal(true);
      setConfirmForm(defaultConfirmFormState);
      setConfirmErrors([]);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === 'Enter' && isFormValid) {
      e.preventDefault();
      e.stopPropagation();
      handleReset(e);
    }
  };

  const handleConfirmInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {value} = e.target;
    const name = e?.target?.getAttribute('id') ?? '';
    setConfirmForm(prev => ({...prev, [name]: value}));
  };

  const handleConfirmSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    e?.stopPropagation();

    const errors: string[] = [];
    if (confirmForm.code.trim().length !== 6) {
      errors.push('Verification code must be 6 digits.');
    }
    if (!confirmForm.password) {
      errors.push('New password is required.');
    }
    if (confirmForm.password !== confirmForm.confirmPassword) {
      errors.push('Passwords do not match.');
    }
    if (errors.length > 0) {
      setConfirmErrors(errors);
      return;
    }
    setConfirmErrors([]);

    const success = await ResetPasswordConfirm({
      email: formState.email,
      code: confirmForm.code.trim(),
      password: confirmForm.password
    });

    if (success) {
      setShowConfirmModal(false);
    } else {
      setConfirmErrors(['Failed to reset password. Please check your code and try again.']);
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

  // Confirm form validation
  useEffect(() => {
    const valid =
      confirmForm.code.trim().length === 6 &&
      confirmForm.password.length > 0 &&
      confirmForm.password === confirmForm.confirmPassword;
    setIsConfirmValid(valid);
  }, [confirmForm]);

  return isMounted ? (
    <>
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

      {showConfirmModal && (
        <Modal setShowModal={setShowConfirmModal}>
          <h2 className="text-xl font-bold mb-4 text-center">Enter Reset Code</h2>
          <p className="text-sm text-center mb-4">
            A 6-digit verification code has been sent to your email. Enter it below along with your
            new password.
          </p>

          {confirmErrors.length > 0 && (
            <ul className="mb-4">
              {confirmErrors.map((err, i) => (
                <li key={i} className="text-red-500 text-sm text-center">
                  {err}
                </li>
              ))}
            </ul>
          )}

          <Form onEnter={(e: React.KeyboardEvent<HTMLFormElement>) => {
            if (e.key === 'Enter' && isConfirmValid) {
              e.preventDefault();
              e.stopPropagation();
              handleConfirmSubmit(e);
            }
          }}>
            <FormInputWithErrors
              label="6-Digit Verification Code"
              type="text"
              id="code"
              required
              placeholder="Enter 6-digit code"
              value={confirmForm.code}
              // eslint-disable-next-line
              // @ts-ignore
              onChange={handleConfirmInputChange}
            />

            <FormInputWithErrors
              label="New Password"
              type="password"
              id="password"
              required
              placeholder="Enter new password"
              value={confirmForm.password}
              // eslint-disable-next-line
              // @ts-ignore
              onChange={handleConfirmInputChange}
            />

            <FormInputWithErrors
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              required
              placeholder="Confirm new password"
              value={confirmForm.confirmPassword}
              // eslint-disable-next-line
              // @ts-ignore
              onChange={handleConfirmInputChange}
            />

            <FormAction
              label="Confirm Reset"
              hasError={false}
              onAction={handleConfirmSubmit}
              isValid={isConfirmValid}
            />
          </Form>
        </Modal>
      )}
    </>
  ) : (
    <></>
  );
}
