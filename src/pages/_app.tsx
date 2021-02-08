import { AppProps } from "next/app";
import NextHead from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextHead>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&family=Noto+Serif+JP:wght@300&display=swap"
          rel="stylesheet"
        />
      </NextHead>
      <Component {...pageProps} />
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
