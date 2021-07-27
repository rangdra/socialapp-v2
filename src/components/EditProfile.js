import {
  FaBookOpen,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUserAlt,
  FaUserTag,
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'config/axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const EditProfile = ({ setDisplay }) => {
  const { data, revalidate } = useSWR('/users/me');
  const router = useRouter();
  const userLogin = data?.user;
  const [showPassword, setShowPassword] = useState(false);
  const [dataEdit, setDataEdit] = useState({
    fullname: '',
    username: '',
    email: '',
    address: '',
    bio: '',
    password: '',
    gender: '',
  });

  useEffect(() => {
    if (userLogin) {
      setDataEdit({
        fullname: userLogin?.fullname,
        username: userLogin?.username,
        email: userLogin?.email,
        address: userLogin?.address,
        bio: userLogin?.bio,
      });
    }
  }, [userLogin]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setDataEdit({ ...dataEdit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/users/${userLogin?._id}`, dataEdit);
      window.location.reload();
      console.log(dataEdit);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="p-4 text-gray-800 sm:p-8">
      <h1 className="text-2xl font-extrabold text-center text-gray-700 sm:text-3xl">
        Edit Profile
      </h1>
      <form className="px-2 mt-2 sm:px-12 sm:mt-4" onSubmit={handleSubmit}>
        <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
          <FaUserTag className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
          <input
            type="text"
            name="fullname"
            className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
            placeholder="Fullname"
            value={dataEdit.fullname}
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>{' '}
        <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
          <FaUserAlt className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
          <input
            type="text"
            name="username"
            value={dataEdit.username}
            className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
            placeholder="Username"
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
          <FaEnvelope className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
          <input
            type="email"
            name="email"
            value={dataEdit.email}
            className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
            placeholder="Email"
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
          <MdLocationOn className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
          <input
            type="text"
            name="address"
            value={dataEdit.address}
            className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
            placeholder="Address"
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
          <FaBookOpen className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
          <input
            type="text"
            name="bio"
            value={dataEdit.bio}
            className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
            placeholder="Bio"
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>
        <div className="text-gray-600 ">
          <label className="block text-sm sm:text-base">Jenis Kelamin</label>
          <label htmlFor="male" className="mr-2 text-xs sm:text-base">
            <input
              type="radio"
              className=""
              name="jenkel"
              id="male"
              value="male"
              onChange={(e) =>
                e.target.checked &&
                setDataEdit({ ...dataEdit, gender: e.target.value })
              }
            />{' '}
            Pria
          </label>
          <label htmlFor="female" className="text-xs sm:text-base">
            <input
              type="radio"
              className=""
              name="jenkel"
              id="female"
              value="female"
              onChange={(e) =>
                e.target.checked &&
                setDataEdit({ ...dataEdit, gender: e.target.value })
              }
            />{' '}
            Perempuan
          </label>
        </div>
        <div className="flex items-center w-full px-4 py-2 mb-4 bg-white rounded-full shadow-lg sm:px-6 sm:py-4">
          <FaLock className="w-3 h-3 mr-2 text-gray-600 sm:w-5 sm:h-5 sm:mr-4" />
          <input
            type={`${showPassword ? 'text' : 'password'}`}
            name="password"
            className="text-sm text-gray-600 bg-transparent focus:outline-none sm:text-base"
            placeholder="Edit Password"
            value={dataEdit.password}
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
          className="w-full py-2 mt-2 text-sm font-semibold text-center text-white transition-all duration-200 bg-indigo-500 rounded-full cursor-pointer sm:text-base hover:bg-indigo-600"
        >
          Edit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
