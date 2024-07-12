import '../styles/globals.css';
import {Toaster} from '../components';
import type {AppProps} from 'next/app';

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />{' '}
    </>
  );
}
