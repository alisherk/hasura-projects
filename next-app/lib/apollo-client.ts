import fetch from 'isomorphic-unfetch'
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from 'subscriptions-transport-ws';


let accessToken: any = null

const requestAccessToken = async () => {
  if (accessToken) return

  const res = await fetch(`/api/session`)

  if (res.ok) {
    const json = await res.json()

    accessToken = json.accessToken
  } else {
    accessToken = 'public'
  }
}

// remove cached token on 401 from the server
const resetTokenLink = onError(({ networkError }: any) => {
  if (networkError && networkError.name === 'ServerError' && networkError.statusCode === 401) {
    accessToken = null
  }
})

const createHttpLink = (headers: any) => {
  const httpLink = new HttpLink({
    uri: 'https://optimal-skylark-59.hasura.app/v1/graphql',
    credentials: 'include',
    headers, // auth token is fetched on the server side
    fetch,
    
  })
  return httpLink;
}

const createWSLink = () => {
  return new WebSocketLink(
    new SubscriptionClient('wss://optimal-skylark-59.hasura.app/v1/graphql', {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        await requestAccessToken() // happens on the client
        return {
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        }
      },
    })
  )
}

export default function createApolloClient(initialState: any, headers:any) {
  const ssrMode = typeof window === 'undefined'
  let link
  if (ssrMode) {
    link = createHttpLink(headers)
  } else {
    link = createWSLink()
  }
  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  })
}



