// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import type {ApiData} from './sign-up';
import type {NextApiResponse} from 'next';

// inviteToken, password, email

export default async function supervisorLoginApiHandler(_: Request, res: NextApiResponse<ApiData>) {
  // remove the auth-token cookie by returning an empty string
  res.setHeader('Set-Cookie', 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
  return res.status(200).json({message: 'Logged out successfully'});
}
