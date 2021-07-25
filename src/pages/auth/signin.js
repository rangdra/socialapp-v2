import { FaEye, FaEyeSlash, FaLock, FaUserAlt } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

const SignIn = () => {
  const {
    signin,
    state: { authenticated },
  } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const router = useRouter();
  if (authenticated) {
    router.push('/');
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    signin(user);
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex">
        <div className="w-full sm:w-5/12">
          <div
            className="w-full h-screen bg-center bg-cover"
            style={{ backgroundImage: "url('/images/background.jpg'" }}
          ></div>
        </div>
        <div className="absolute w-full h-screen p-4 sm:static sm:w-7/12">
          <p className="text-sm text-right text-white sm:text-gray-400">
            Not a member?
            <Link href="/auth/register">
              <a className="ml-2 text-blue-400 underline sm:text-blue-500">
                Register Now
              </a>
            </Link>
          </p>
          <div className="flex justify-center mt-20">
            <form
              className="w-full px-4 pt-4 pb-6 bg-white rounded sm:bg-transparent sm:p-0 sm:w-1/2 sm:rounded-none"
              onSubmit={handleSubmit}
            >
              <h1 className="text-3xl font-semibold text-center text-indigo-900">
                Welcome!
              </h1>
              <p className="mb-4 text-sm font-medium text-center text-gray-400 sm:mt-2">
                Sign In your account to access here
              </p>
              <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
                <FaUserAlt className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
                <input
                  type="text"
                  name="username"
                  className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
                  placeholder="Email or Username"
                  style={{ flex: 1 }}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
                <FaLock className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
                <input
                  type={`${showPassword ? 'text' : 'password'}`}
                  name="password"
                  className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
                  placeholder="Password"
                  style={{ flex: 1 }}
                  onChange={handleChange}
                />
                <div onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FaEyeSlash className="w-3 h-3 ml-2 text-gray-600 sm:w-5 sm:h-5 sm:ml-4" />
                  ) : (
                    <FaEye className="w-3 h-3 ml-2 text-gray-600 sm:w-5 sm:h-5 sm:ml-4" />
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-2 font-semibold text-center text-white transition-all duration-200 bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-600"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
