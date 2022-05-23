import { initAuth0 } from '@auth0/nextjs-auth0'
import init from './auth0-config'

const config = init()

export default initAuth0({
  baseURL: 'http://localhost:3000',
  issuerBaseURL: config.AUTH0_DOMAIN,
  clientID: config.AUTH0_CLIENT_ID,
  clientSecret: config.AUTH0_CLIENT_SECRET,
  secret: config.SESSION_COOKIE_SECRET,
  authorizationParams: {
    scope: config.AUTH0_SCOPE,
    audience: config.AUTH0_AUDIENCE
  },
  routes: {
    callback: config.REDIRECT_URI,
    postLogoutRedirect: 'http://localhost:3000',
  },
  session: {
    rollingDuration: 60 * 60 * 8,
  }
})