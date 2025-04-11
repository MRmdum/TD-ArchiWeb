import "../styles/recettes.css";
import "../styles/global.css";
import Image from 'next/image';

export default function App({ Component, pageProps }) {
  return (
      <main>
        <Component {...pageProps} />
      </main>

  );
}
