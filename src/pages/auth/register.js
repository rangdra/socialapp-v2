import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUserAlt,
  FaUserTag,
} from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Register = () => {
  const {
    register,
    state: { authenticated },
  } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  });
  const [gender, setGender] = useState('');
  const router = useRouter();
  if (authenticated) {
    router.push('/');
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = { ...data, gender };

    register(newUser);
  };

  return (
    <>
      <Head>
        <title>Register</title>
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
            Already have an account?
            <Link href="/auth/signin">
              <a className="ml-2 text-blue-500 underline">Sign In</a>
            </Link>
          </p>
          <div className="flex justify-center mt-20">
            <form className="w-1/2" onSubmit={handleSubmit}>
              <h1 className="text-3xl font-semibold text-center text-indigo-900">
                Register Now!
              </h1>
              <p className="mt-2 mb-4 text-sm font-medium text-center text-gray-400">
                Let's create your account
              </p>
              <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
                <FaUserTag className="w-5 h-5 mr-4 text-gray-600" />
                <input
                  type="text"
                  name="fullname"
                  className="text-gray-600 bg-transparent focus:outline-none"
                  placeholder="Fullname"
                  style={{ flex: 1 }}
                  onChange={handleChange}
                />
              </div>{' '}
              <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
                <FaUserAlt className="w-5 h-5 mr-4 text-gray-600" />
                <input
                  type="text"
                  name="username"
                  className="text-gray-600 bg-transparent focus:outline-none"
                  placeholder="Username"
                  style={{ flex: 1 }}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
                <FaEnvelope className="w-5 h-5 mr-4 text-gray-600" />
                <input
                  type="email"
                  name="email"
                  className="text-gray-600 bg-transparent focus:outline-none"
                  placeholder="Email"
                  style={{ flex: 1 }}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4 text-gray-600">
                <label className="block ">Jenis Kelamin</label>
                <span className="mr-2">
                  <input
                    type="radio"
                    className="mr-1"
                    name="jenkel"
                    id="male"
                    value="male"
                    onChange={(e) => e.target.checked && setGender('male')}
                  />
                  <label htmlFor="male">Pria</label>
                </span>
                <span className="mr-2">
                  <input
                    type="radio"
                    className="mr-1"
                    name="jenkel"
                    id="female"
                    value="female"
                    onChange={(e) => e.target.checked && setGender('female')}
                  />
                  <label htmlFor="female">Perempuan</label>
                </span>
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
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
