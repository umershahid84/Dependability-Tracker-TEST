import {uuidV4Regex} from '../../../utils';
import Division, {DivisionCreationAttributes} from './index';

describe('Division model', () => {
  let division: Division;
  it('Should be defined', async () => {
    expect(Division).toBeDefined();
  });

  it('Should create a division', async () => {
    division = await Division.create({
      name: 'Overnight Parking'
    } as DivisionCreationAttributes);

    expect(division).toBeDefined();
    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(division.id).toBeDefined();
    expect(uuidV4Regex.test(division.id)).toBe(true);
    expect.assertions(2);
  });

  it('Should have a name', () => {
    expect(division.name).toBe('Overnight Parking');
    expect.assertions(1);
  });

  it('Should have a createdAt date', () => {
    expect(division.createdAt).toBeDefined();
    expect(division.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have an updatedAt date', () => {
    expect(division.updatedAt).toBeDefined();
    expect(division.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });
});
