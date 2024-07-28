// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import type {ApiData} from '../../lib/apiController';

// inviteToken, password, email

export default async function supervisorLoginApiHandler(req: Request, res: Response<ApiData>) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  // remove the auth-token cookie by returning an empty string
  res.setHeader('Set-Cookie', 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
  return res.status(200).json({message: 'Logged out successfully'});
}
