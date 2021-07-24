import 'styles/globals.css';
import 'tailwindcss/tailwind.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SWRConfig } from 'swr';

import { AuthProvider } from 'context/AuthContext';
import axios from 'config/axios';
import axiosDev from 'axios';

axiosDev.defaults.withCredentials = true;

const fetcher = async (url) => {
  try {
    const res = await axios.get(url);
    return res;
  } catch (error) {
    throw error.response.data;
  }
};

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000,
        refreshInterval: 0,
      }}
    >
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer position="top-right" />
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
