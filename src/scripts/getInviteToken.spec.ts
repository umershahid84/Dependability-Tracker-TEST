import { Employee, Supervisor } from '../../lib/db';
import { getCreateCredentialsInviteFromDB } from '../../lib/db/controller';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
  throw new Error(`Process.exit called with code ${code}`);
});

describe('getInviteToken script', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockProcessExit.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockProcessExit.mockRestore();
  });

  it('should retrieve invite token for Umer Shahid', async () => {
    const employee = await Employee.findOne({ where: { name: 'Umer Shahid' } });
    expect(employee).not.toBeNull();

    if (employee) {
      const supervisor = await Supervisor.findOne({ where: { employee_id: employee.id } });
      expect(supervisor).not.toBeNull();

      if (supervisor) {
        const existingInvite = await getCreateCredentialsInviteFromDB({
          supervisor_id: supervisor.id
        });
        expect(existingInvite).not.toBeNull();
        expect(existingInvite?.invite_token).toBeTruthy();
        expect(existingInvite?.id).toBeTruthy();
        expect(typeof existingInvite?.invite_token).toBe('string');
        expect(existingInvite?.invite_token.length).toBeGreaterThan(0);
      }
    }
  });

  it('should handle missing employee gracefully', async () => {
    const employee = await Employee.findOne({ where: { name: 'Non Existent Person' } });
    expect(employee).toBeNull();
  });

  it('should find all supervisors with invites', async () => {
    const supervisors = await Supervisor.findAll();
    expect(supervisors.length).toBeGreaterThan(0);

    for (const supervisor of supervisors) {
      const invite = await getCreateCredentialsInviteFromDB({
        supervisor_id: supervisor.id
      });
      // All supervisors should have invites after seeding
      expect(invite).not.toBeNull();
      if (invite) {
        expect(invite.invite_token).toBeTruthy();
        expect(invite.id).toBeTruthy();
      }
    }
  });
});
