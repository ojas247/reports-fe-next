import "../styles/globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}


