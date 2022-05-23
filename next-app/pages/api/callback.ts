import auth0 from '../../lib/auth0';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleCallback(req, res, { redirectUri: 'http://localhost:3000' })
  } catch (error: any) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}