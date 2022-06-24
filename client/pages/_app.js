import Head from "next/head";
import Navbar from "../components/Navbar";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../styles/globals.css";
import "../styles/embla.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js"
        integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT"
        crossOrigin="anonymous"
      ></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap" rel="stylesheet"/>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
