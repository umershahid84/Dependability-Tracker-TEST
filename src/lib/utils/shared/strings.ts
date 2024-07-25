// remove extra white spaces from a string, tabs, and new lines
export const trim = (str: string): string => str?.replace(/\s+/g, ' ')?.trim();
export function headingNormalizer(text = '') {
  if (!text ?? text === undefined) {
    return '';
  }

  text = text.replace(/\s+/g, ' ').trim();
  return text
    .toLowerCase()
    .split(' ')
    .map((word: string) => word[0]?.toUpperCase() + word?.slice(1))
    .join(' ');
}

export const formatter = {
  /**Takes a string and returns a string with the first letter of each word capitalized.
   * @param {string} text - The string to be normalized.
   * @example
   * headingNormalizer('hello world') // 'Hello World'
   * headingNormalizer('HELLO WORLD!') // 'Hello World!'
   */
  headingNormalizer
};

export const getDivisionNameFromPath = (path: string) => {
  const words = path
    .split('/divisions/')[1]
    .replace('-', ' ')
    ?.replace('.json', '')
    ?.replace('/reports', '')
    ?.split(' ');

  for (let word of words) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
  }
  return words?.join(' ');
};

export const capitalizeWords = (text: string) => {
  return text
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};
