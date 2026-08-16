import type {ApiData} from '../../index';
import {Request, Response} from 'express';
import {toggleEmployeeActiveStatusInDB} from '../../../db/controller';
import {logTemplate} from '../../../utils/server';

export type ToggleEmployeeStatusProps = {
  id: string;
  is_active: boolean;
};

export default async function patchEmployeesApiHandler(req: Request, res: Response<ApiData>) {
  try {
    const {body} = req as {body: ToggleEmployeeStatusProps};

    if (typeof body.is_active !== 'boolean') {
      return res.status(400).json({error: 'is_active must be a boolean'});
    }

    const result = await toggleEmployeeActiveStatusInDB(body.id, body.is_active);

    if (!result) {
      throw new Error('Error updating employee status');
    }

    const action = body.is_active ? 'enabled' : 'disabled';
    return res.status(200).json({message: `Employee ${action} successfully`});
  } catch (error) {
    const errMessage = '❌ Error in patchEmployeesApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({error: String(error)});
  }
}

export {patchEmployeesApiHandler};
