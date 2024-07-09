import {useState} from 'react';
import {validators} from '../utils/shared/validators';

const noWhiteSpaces = 'Cannot contain white-space';

export interface IValidationRules {
  password: {rule: (value: string) => boolean; message: string}[];
  email: {rule: (value: string) => boolean; message: string}[];
}

const validationRules = {
  password: [
    {rule: validators.hasNoWhiteSpace, message: noWhiteSpaces},
    {rule: validators.required, message: 'Required'},
    {rule: validators.has8Chars, message: 'Must be at least 8 characters'}
  ],

  email: [
    {rule: validators.isEmail, message: 'Must be a valid email address'},
    {rule: validators.required, message: 'Required'}
  ]
};

export interface IValidatorProps {
  value: string | null;
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
      const didPass = rule(props.value ?? '');

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
