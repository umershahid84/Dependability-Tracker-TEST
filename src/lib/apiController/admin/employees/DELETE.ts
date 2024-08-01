import type { ApiData } from '../../index';
import { Request, Response } from 'express';
import { EditEmployeeProps } from '../../../../client-api';
import { deleteEmployeeFromDB } from '../../../db/controller';
import { logTemplate } from '../../../utils/server';

export default async function deleteEmployeesApiHandler(req: Request, res: Response<ApiData>) {
  try {
    const { body } = req as { body: EditEmployeeProps };

    const deletedEmployee: number | null = await deleteEmployeeFromDB(body.id);

    if (!deletedEmployee) {
      throw new Error('Error deleting employee');
    }
    return res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    const errMessage = '❌ Error in deleteEmployeesApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { deleteEmployeesApiHandler };
