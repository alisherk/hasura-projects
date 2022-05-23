import auth0 from '../../lib/auth0'

export default async function logout(req: any, res: any) {
  try {
    await auth0.handleLogout(req, res, { returnTo: '/' })
  } catch (error: any) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}