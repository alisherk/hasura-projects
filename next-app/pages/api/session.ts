import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '../../lib/auth0';

export default async function session(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { accessToken } = await auth0.getAccessToken(req, res);

    res.status(200).json({ accessToken });
  } catch (error: any) {
    console.error(error);
    
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message
    });
  }
}