import {
  getEmployeeFromDB,
  updateEmployeeInDB,
  EmployeeWithAssociations,
  upsertEmployeeScheduleVersionInDB
} from '../../../db/controller';
import {Request, Response} from 'express';
import {logTemplate} from '../../../utils/server';
import {EditEmployeeProps} from '../../../../client-api/employees';
import {validateAddEmployeeForm, type ApiData} from '../../index';

export default async function putEmployeesApiHandler(
  req: Request,
  res: Response<ApiData<EmployeeWithAssociations>>
) {
  try {
    const {body} = req as {body: EditEmployeeProps};

    await validateAddEmployeeForm(body.formData);

    let updatedEmployee: number | EmployeeWithAssociations | null =
      await updateEmployeeInDB.withEmployeeData(body.id, body.formData);

    if (!updatedEmployee) {
      throw new Error('Error updating employee');
    }

    await upsertEmployeeScheduleVersionInDB(body.id, {
      shiftStartTime: body.formData.shiftStartTime,
      shiftEndTime: body.formData.shiftEndTime,
      daysOffType: body.formData.daysOffType,
      employeeStatus: body.formData.employeeStatus
    });

    updatedEmployee = await getEmployeeFromDB.byId(body.id);
    return res.status(200).json({
      message: 'Employee updated successfully',
      data: updatedEmployee as EmployeeWithAssociations
    });
  } catch (error) {
    const errMessage = '❌ Error in putEmployeesApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({error: String(error)});
  }
}

export {putEmployeesApiHandler};
