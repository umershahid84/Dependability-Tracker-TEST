import {uuid} from '../../utils/uuid';
import {Division, Employee} from '../models';
import {EmployeeCreationAttributes} from '../models/Employee';

// object containing employee seed data
const employeeSeeds = [
  // Supervisors
  {
    id: '1',
    name: 'Umer Shahid',
    division_ids: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Abel Fisshaye',
    division_ids: ['1', '2', '3']
  },
  {
    id: '3',
    name: 'Brent Brown',
    division_ids: ['1', '2', '3']
  },
  {
    id: '4',
    name: 'Chris Still',
    division_ids: ['1', '2', '3']
  },
  {
    id: '5',
    name: 'Crissa Adams',
    division_ids: ['1', '2', '3']
  },
  {
    id: '6',
    name: 'Dave Bass',
    division_ids: ['1', '2', '3']
  },
  {
    id: '7',
    name: 'Denise Scales',
    division_ids: ['1', '2', '3']
  },
  {
    id: '8',
    name: 'Frank Jasso',
    division_ids: ['1', '2', '3']
  },
  {
    id: '9',
    name: 'Jason Pennington',
    division_ids: ['1', '2', '3']
  },
  {
    id: '10',
    name: 'Margaret Launiuvao',
    division_ids: ['1', '2', '3']
  },
  {
    id: '11',
    name: 'Kanwaljeet Singh',
    division_ids: ['1', '2', '3']
  },
  {
    id: '12',
    name: 'Ken Lado',
    division_ids: ['1', '2', '3']
  },
  {
    id: '13',
    name: 'Lorna Muthemba',
    division_ids: ['1', '2', '3']
  },
  {
    id: '14',
    name: 'Mike Hope',
    division_ids: ['1', '2', '3']
  },
  {
    id: '15',
    name: 'Rich Brester',
    division_ids: ['1', '2', '3']
  },
  {
    id: '16',
    name: 'Sue Adams',
    division_ids: ['1', '2', '3']
  },

  // Employees
  {
    id: '17',
    name: 'Allan Barreto',
    division_ids: ['1']
  },
  {
    id: '18',
    name: 'Ashley Thomas',
    division_ids: ['1']
  },
  {
    id: '19',
    name: 'Coty Minnie',
    division_ids: ['1']
  },
  {
    id: '20',
    name: 'Hazel Martinez',
    division_ids: ['1']
  },
  {
    id: '21',
    name: 'Isabel Ilo',
    division_ids: ['1']
  },
  {
    id: '22',
    name: 'Kennetha Lee',
    division_ids: ['1']
  },
  {
    id: '23',
    name: 'Kristie Terrio',
    division_ids: ['1']
  },
  {
    id: '24',
    name: 'Mae Gomez',
    division_ids: ['1']
  },
  {
    id: '25',
    name: 'Margaret Launiuvao',
    division_ids: ['1']
  },
  {
    id: '26',
    name: 'Michelle Bejgrowicz',
    division_ids: ['1']
  },
  {
    id: '27',
    name: 'Nikka Delos-Santos',
    division_ids: ['1']
  },
  {
    id: '28',
    name: 'Owen Steck',
    division_ids: ['1']
  },
  {
    id: '29',
    name: 'Ronna Smith',
    division_ids: ['1']
  },
  {
    id: '30',
    name: 'Ronnie Savea',
    division_ids: ['1']
  },
  {
    id: '31',
    name: 'Seupepe Launiuvao',
    division_ids: ['1']
  },
  {
    id: '32',
    name: 'Tennille Dixon',
    division_ids: ['1']
  },
  {
    id: '33',
    name: 'Tusi Kongaika',
    division_ids: ['1']
  },
  {
    id: '34',
    name: 'Yolanda Fung-A-Joe',
    division_ids: ['1']
  }
];

// Seeding function
const seedEmployees = async () => {
  // get the division ids
  const divisionIds = await Division.findAll().then(divisions =>
    divisions.map(division => division.id)
  );

  // on ids 1-16, replace the division_ids with the divisionIds array
  employeeSeeds.forEach(employee => {
    if (parseInt(employee.id, 10) <= 16) {
      employee.division_ids = divisionIds;
    } else {
      // assign the first division id to the rest of the employees
      employee.division_ids = divisionIds.slice(0, 1);
    }

    employee.id = uuid();
  });

  try {
    await Employee.bulkCreate(employeeSeeds as EmployeeCreationAttributes[], {
      ignoreDuplicates: true
    });
    console.log('✅ Employee seeds inserted successfully');
  } catch (error) {
    console.error('❌Error inserting employee seeds:', error);
  }
};

export default seedEmployees;
