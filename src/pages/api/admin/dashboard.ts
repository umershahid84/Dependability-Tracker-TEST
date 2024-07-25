// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {NextApiResponse} from 'next';
import {enforceAdminOnly} from '../../../auth';
import {
  getAdminDashboardDataApiHandler,
  getAdminDashboardDataUpdateStatusApiHandler
} from '../../../lib/apiController/admin/dashboard';

export default async function handler(req: NextRequest & Request, res: NextApiResponse) {
  await enforceAdminOnly(req, res);

  if (req.method === 'GET') {
    console.log('\n\nGET request to /api/admin/dashboard');
    return getAdminDashboardDataApiHandler(req, res);
  }

  if (req.method === 'POST') {
    return getAdminDashboardDataUpdateStatusApiHandler(req, res);
  }

  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
