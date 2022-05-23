import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />;
    </UserProvider>
  );
}
