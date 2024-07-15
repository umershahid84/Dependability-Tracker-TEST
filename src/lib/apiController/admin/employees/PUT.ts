import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {ApiData} from '../../index';
import type {NextApiResponse} from 'next';
import {EditEmployeeProps} from '../../../../client-api';
import {updateEmployeeInDB, EmployeeWithAssociations} from '../../../db/controller';

export default async function putEmployeesApiHandler(
  req: NextRequest & Request,
  res: NextApiResponse<ApiData<EmployeeWithAssociations>>
) {
  try {
    const {body} = req as {body: EditEmployeeProps};

    const updatedEmployee: number | null = await updateEmployeeInDB.withEmployeeData(
      body.id,
      body.formData
    );

    if (!updatedEmployee) {
      throw new Error('Error updating employee');
    }
    return res.status(200).json({message: 'Employee updated successfully'});
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {putEmployeesApiHandler};
