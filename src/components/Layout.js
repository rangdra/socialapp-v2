import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

const Layout = ({ title, children }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title} | Social App</title>
      </Head>
      <Navbar />

      {children}
    </>
  );
};

Layout.defaultProps = {
  title: 'Welcome To Social App',
};

export default Layout;
