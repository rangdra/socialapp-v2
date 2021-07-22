import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

const Layout = ({ title, children }) => {
  const router = useRouter();
  console.log(router.pathname);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />

      {children}
    </>
  );
};

Layout.defaultProps = {
  title: 'Welcome To RPApp',
};

export default Layout;
