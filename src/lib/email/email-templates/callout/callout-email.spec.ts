import {callOutDetailsTemplate} from './index';
import {CallOutWithAssociations} from '../../../db/models/Callout';

describe('Email Verification Template', () => {
  const testCallOutData: CallOutWithAssociations = {
    id: '123',
    callout_date: new Date('2021-08-01'),
    callout_time: new Date('2021-08-01T08:00:00'),
    shift_date: new Date('2021-08-01'),
    shift_time: new Date('2021-08-01T08:00:00'),
    employee: {
      name: 'Testy McTestface',
      id: '1234',
      divisions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    leaveType: {reason: 'Sick', id: '1234', createdAt: new Date(), updatedAt: new Date()},
    left_early_mins: 0,
    arrived_late_mins: 0,
    supervisor: {
      supervisor_info: {
        name: 'Supervisor',
        id: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
        divisions: []
      },

      id: '1234',
      is_admin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    supervisor_comments: 'N/A',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const template = callOutDetailsTemplate(testCallOutData);
  console.log(template);
  it('should return a string', () => {
    expect(typeof template).toBe('string');
    expect.assertions(1);
  });
});
