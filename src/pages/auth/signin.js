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
        <title>Login</title>
      </Head>
      <div className="flex">
        <div className="w-5/12">
          <div
            className="w-full h-screen bg-center bg-cover"
            style={{ backgroundImage: "url('/images/background.jpg'" }}
          ></div>
        </div>
        <div className="w-7/12 h-screen p-4">
          <p className="text-sm text-right text-gray-400">
            Not a member?
            <Link href="/auth/register">
              <a className="ml-2 text-blue-500 underline">Register Now</a>
            </Link>
          </p>
          <div className="flex justify-center mt-20">
            <form className="w-1/2" onSubmit={handleSubmit}>
              <h1 className="text-3xl font-semibold text-center text-indigo-900">
                Welcome!
              </h1>
              <p className="mt-2 mb-4 text-sm font-medium text-center text-gray-400">
                Sign In your account to access here
              </p>
              <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
                <FaUserAlt className="w-5 h-5 mr-4 text-gray-600" />
                <input
                  type="text"
                  name="username"
                  className="text-gray-600 bg-transparent focus:outline-none"
                  placeholder="Email or Username"
                  style={{ flex: 1 }}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
                <FaLock className="w-5 h-5 mr-4 text-gray-600" />
                <input
                  type={`${showPassword ? 'text' : 'password'}`}
                  name="password"
                  className="text-gray-600 bg-transparent focus:outline-none"
                  placeholder="Password"
                  style={{ flex: 1 }}
                  onChange={handleChange}
                />
                <div onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5 ml-4 text-gray-600 cursor-pointer" />
                  ) : (
                    <FaEye className="w-5 h-5 ml-4 text-gray-600 cursor-pointer" />
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
