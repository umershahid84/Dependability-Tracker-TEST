import {Html, Head, Main, NextScript} from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="bg-primary text-primary print:text-black" suppressHydrationWarning>
      <Head />
      <body className="bg-primary text-primary print:text-black" suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
