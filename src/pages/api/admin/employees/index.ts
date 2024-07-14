// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {NextApiResponse} from 'next';
import {getEmployeesApiHandler} from '../../../../lib/apiController';

export default async function handler(req: NextRequest & Request, res: NextApiResponse) {
  if (req.method === 'GET') {
    console.log('\n\nGET request to /api/admin/employees');
    return getEmployeesApiHandler(req, res);
  }

  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    bodyParser: true
  }
};
