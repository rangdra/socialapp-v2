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
  });
  const [gender, setGender] = useState('');

  useEffect(() => {
    if (userLogin) {
      setDataEdit({
        ...dataEdit,
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
      const updateUser = { ...dataEdit, gender };

      await axios.put(`/users/${userLogin?._id}`, updateUser);
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="p-8 text-gray-800">
      <h1 className="text-3xl font-extrabold text-center">Edit Profile</h1>
      <form className="px-12 mt-4" onSubmit={handleSubmit}>
        <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
          <FaUserTag className="w-5 h-5 mr-4 text-gray-600" />
          <input
            type="text"
            name="fullname"
            className="text-gray-600 bg-transparent focus:outline-none"
            placeholder="Fullname"
            value={dataEdit.fullname}
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>{' '}
        <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg ">
          <FaUserAlt className="w-5 h-5 mr-4" />
          <input
            type="text"
            name="username"
            value={dataEdit.username}
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
            value={dataEdit.email}
            className="text-gray-600 bg-transparent focus:outline-none"
            placeholder="Email"
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
          <MdLocationOn className="w-5 h-5 mr-4 text-gray-600" />
          <input
            type="text"
            name="address"
            value={dataEdit.address}
            className="text-gray-600 bg-transparent focus:outline-none"
            placeholder="Address"
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center w-full px-6 py-4 mb-4 bg-white rounded-full shadow-lg">
          <FaBookOpen className="w-5 h-5 mr-4 text-gray-600" />
          <input
            type="text"
            name="bio"
            value={dataEdit.bio}
            className="text-gray-600 bg-transparent focus:outline-none"
            placeholder="Bio"
            style={{ flex: 1 }}
            onChange={handleChange}
          />
        </div>
        <div className="text-gray-600 ">
          <label className="block ">Jenis Kelamin</label>
          <span className="mr-2">
            <input
              type="radio"
              className="mr-1"
              name="jenkel"
              id="male"
              value={gender}
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
              value={gender}
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
            placeholder="Edit Password"
            value={dataEdit.password}
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
          Edit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
