import {randomBytes} from 'crypto';

export const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const uuid = (): string => {
  // generate a uuid v4 string
  const bytes = randomBytes(16);

  // Set the version to 4 (UUID version 4)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set the variant to 1 (UUID variant specified in RFC 4122)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hexArray = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'));
  return hexArray.join('').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
};
