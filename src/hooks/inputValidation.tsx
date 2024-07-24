import {useState} from 'react';
import {validators} from '../lib/utils/shared/validators';

const noWhiteSpaces = 'Cannot contain white-space';

export interface IValidationRules {
  password: {rule: (value: string) => boolean; message: string}[];
  email: {rule: (value: string) => boolean; message: string}[];
  confirmPassword: {rule: (given: string) => boolean; message: string}[];
  inviteToken: {rule: (value: string) => boolean; message: string}[];
}

export const doPasswordsMatch = (given: {password: string; confirmPassword: string}): boolean =>
  given.password === given.confirmPassword;

const validationRules = {
  password: [
    {rule: validators.hasNoWhiteSpace, message: noWhiteSpaces},
    {rule: validators.required, message: 'Required'},
    {rule: validators.has8Chars, message: 'Must be at least 8 characters'}
  ],

  email: [
    {rule: validators.isEmail, message: 'Must be a valid email address'},
    {rule: validators.required, message: 'Required'}
  ],

  confirmPassword: [
    {rule: validators.required, message: 'Required'},
    {rule: validators.has8Chars, message: 'Must be at least 8 characters'},
    {rule: doPasswordsMatch, message: 'Passwords do not match'}
  ],

  inviteToken: [
    {rule: validators.required, message: 'Required'},
    {rule: validators.has16Chars, message: 'Must be 32 characters'}
  ]
};

export interface IValidatorProps {
  value: string | {password: string; confirmPassword: string};
  property: keyof IValidationRules;
}

export interface IValidationError {
  [key: string]: string;
}

export interface IUseValidators {
  validated: boolean;
  error: IValidationError[];
  validate: () => void;
}

export default function useValidators(props: IValidatorProps): {
  validated: boolean;
  error: IValidationError[];
  validate: () => void;
} {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState<IValidationError[]>([]);

  const validate = (): void => {
    const rules = validationRules[props.property];
    let _errors: IValidationError[] = [];
    for (const {rule, message} of rules) {
      //@ts-ignore
      const didPass = rule(props.value);

      if (!didPass) {
        _errors.push({[props.property]: message});
      } else {
        _errors = _errors.filter(e => e[props.property] !== message);
      }
    }

    if (_errors.length === 0) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    setError(_errors);
  };

  return {
    validated: validated && error.length === 0,
    error,
    validate
  };
}
