import type { AppProps } from "next/app";
import "../styles/global.scss";
import "../styles/cardlist.scss";
import "../styles/home.scss";
import "../components/Character/character.scss";
import "../components/PageNotFound/pagenotfound.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
