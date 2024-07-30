import {Employee, Supervisor} from '../models';

// object containing employee seed data
const supervisorSeeds = [
  // Supervisors
  {
    employee_id: '1',
    is_admin: true,
    name: 'Umer Shahid'
  },
  {
    employee_id: '2',
    is_admin: false,
    name: 'Abel Fisshaye'
  },
  {
    employee_id: '3',
    is_admin: false,
    name: 'Brent Brown'
  },
  {
    employee_id: '4',
    is_admin: false,
    name: 'Chris Still'
  },
  {
    employee_id: '5',
    is_admin: false,
    name: 'Crissa Adams'
  },
  {
    employee_id: '6',
    is_admin: false,
    name: 'Dave Bass'
  },
  {
    employee_id: '7',
    is_admin: false,
    name: 'Denise Scales'
  },
  {
    employee_id: '8',
    is_admin: false,
    name: 'Frank Jasso'
  },
  {
    employee_id: '9',
    is_admin: false,
    name: 'Jason Pennington'
  },
  {
    employee_id: '11',
    is_admin: false,
    name: 'Kanwaljeet Singh'
  },
  {
    employee_id: '12',
    is_admin: false,
    name: 'Ken Lado'
  },
  {
    employee_id: '13',
    is_admin: false,
    name: 'Lorna Muthemba'
  },
  {
    employee_id: '14',
    is_admin: false,
    name: 'Mike Hope'
  },
  {
    employee_id: '15',
    is_admin: false,
    name: 'Rich Brester'
  },
  {
    employee_id: '16',
    is_admin: false,
    name: 'Sue Adams'
  }
];

// Seeding function
const seedSupervisors = async () => {
  for (const supervisor of supervisorSeeds) {
    // lookup the employee id
    const employee = await Employee.findOne({where: {name: supervisor.name}});
    if (employee) {
      supervisor.employee_id = employee.id;
    } else {
      console.error(`❌ Employee not found: ${supervisor ? supervisor.name : 'undefined'}`);
      // remove the supervisor from the seeds array
      supervisorSeeds.splice(supervisorSeeds.indexOf(supervisor), 1);
    }
  }

  try {
    await Supervisor.bulkCreate(supervisorSeeds, {ignoreDuplicates: true});
    console.log('  ✅ Supervisor seeds inserted successfully');
  } catch (error) {
    console.error('❌Error inserting supervisor seeds:', error);
  }
};

export default seedSupervisors;
