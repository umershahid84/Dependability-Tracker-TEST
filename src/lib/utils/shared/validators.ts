export type IValidator = (value: string, ...args: any[]) => boolean;

export const validators = {
  //  return true or false
  required: (value: string) =>
    value !== undefined && value !== null && value !== '' && value.length > 0,
  isEmail: (value: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(value);
  },
  hasNoWhiteSpace: (value: string) => {
    const re = /^\S*$/;
    return re.test(value);
  },
  isAlphaNumeric: (value: string) => {
    const re = /^[a-zA-Z0-9 ]*$/g;
    return re.test(value);
  },
  has8Chars: (value: string) => value?.length >= 8,
  has16Chars: (value: string) => value?.length >= 16
};
