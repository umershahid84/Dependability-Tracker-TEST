import {uuid, uuidV4Regex} from './';

describe('uuid', () => {
  it('Should generate a uuid', () => {
    const id = uuid();
    expect(id).toBeDefined;
    // Check if the id is a string
    expect(typeof id).toBe('string');
    // Check if the id has a length of 36
    expect(id.length).toBe(36);
    expect(uuidV4Regex.test(id)).toBe(true);
  });
});
