import axios from 'config/axios';
import axiosDev from 'axios';

import Image from 'next/image';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import useSWR from 'swr';
import { useRef } from 'react';

import Post from 'components/Post';
import { useAuthContext } from 'context/AuthContext';
import Layout from 'components/Layout';
import Modal from 'components/Modal';
import EditProfile from 'components/EditProfile';
import { MdLocationOn } from 'react-icons/md';
import { useRouter } from 'next/router';
import { API_URL } from 'config/url';

const UserProfile = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data, revalidate } = useSWR('/posts/myposts');

  const {
    state: { user, authenticated },
  } = useAuthContext();

  const likePost = async (postId) => {
    try {
      await axios.put(`/posts/${postId}/like`);

      revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`);

      revalidate();
      mutate('/users/me');
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.name = type;
      fileInputRef.current.click();
    }
  };

  // const uploadImage = async (e) => {
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   formData.append('type', fileInputRef.current.name);

  //   try {
  //     await axios.put(`/users/${user._id}`, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     window.location.reload();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const uploadImageCloud = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'social_app');
    formData.append('cloud_name', 'rangdra');

    try {
      const { data } = await axiosDev.post(
        'https://api.cloudinary.com/v1_1/rangdra/image/upload',
        formData
      );

      if (fileInputRef.current.name === 'photo') {
        await axios.put(`/users/${user?._id}/images`, {
          photo: data.secure_url,
        });
      } else if (fileInputRef.current.name === 'banner') {
        await axios.put(`/users/${user?._id}/images`, {
          banner: data.secure_url,
        });
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title="My Profile">
      <div className="px-4 py-8 sm:my-12 sm:px-20">
        <div className="flex flex-col items-center">
          <div className="w-full bg-white rounded shadow sm:w-1/2">
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImageCloud}
            />
            {user?.banner ? (
              <div
                className="w-full h-[200px] cursor-pointer bg-center bg-cover"
                onClick={() => openFileInput('banner')}
                style={{
                  backgroundImage: `url('${user?.banner}')`,
                }}
                title="You can change banner"
              ></div>
            ) : (
              <div
                className="w-full h-[200px] cursor-pointer bg-center bg-cover"
                onClick={() => openFileInput('banner')}
                style={{
                  backgroundImage: "url('/images/default-banner.png')",
                }}
                title="You can change banner"
              ></div>
            )}
            <div className="relative flex flex-col items-center">
              <div
                className="absolute flex items-center justify-center border-8 border-indigo-600 rounded-full cursor-pointer -top-12"
                onClick={() => openFileInput('photo')}
              >
                <Image
                  src={user?.photo ? user.photo : '/images/default-photo.png'}
                  alt={user?.fullname}
                  width={72}
                  height={72}
                  className="rounded-full"
                  title="You can change photo"
                />
              </div>
              <h2 className="relative block mt-12 text-xl font-semibold cursor-pointer sm:text-2xl">
                {user?.fullname}
                {user?.gender === 'male' ? (
                  <IoMdMale className="absolute text-xs text-blue-500 -right-4 top-2" />
                ) : (
                  <IoMdFemale className="text-xs text-pink-500" />
                )}
              </h2>
              <h3 className="text-sm text-gray-400">@{user?.username}</h3>
              {user?.bio && <p className="my-2 text-sm">{user?.bio}</p>}
              {user?.address && (
                <div className="flex">
                  <MdLocationOn className="w-5 h-5 mr-1 text-gray-600" />
                  <span>{user?.address}</span>
                </div>
              )}
              <div className="flex items-center justify-between mt-1 space-x-4 text-sm sm:text-base">
                <div>
                  <p className="text-center">{data?.myPosts.length}</p>
                  <p>Posts</p>
                </div>
                <div>
                  <p className="text-center">{user?.followers.length}</p>
                  <p>Followers</p>
                </div>
                <div>
                  <p className="text-center">{user?.following.length}</p>
                  <p>Following</p>
                </div>
              </div>
              <Modal
                content={(toggle, setDisplay) => (
                  <EditProfile setDisplay={setDisplay} />
                )}
              >
                {(toggle) => (
                  <button
                    onClick={() => toggle()}
                    className="w-1/2 py-2 mx-auto mt-4 text-sm font-semibold text-white transition-all duration-200 bg-indigo-500 rounded sm:text-base hover:bg-indigo-600"
                  >
                    Edit Profile
                  </button>
                )}
              </Modal>
            </div>
            <div className="mt-4 mb-2 border border-gray-800"></div>
            <div className="border border-gray-800 "></div>
            <section className="p-4 text-gray-800 posts">
              <h1 className="mb-2 text-xl font-bold tracking-wider sm:text-2xl">
                My Posts
              </h1>
              {data?.myPosts.length > 0 ? (
                data?.myPosts.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    likePost={likePost}
                    deletePost={deletePost}
                  />
                ))
              ) : (
                <p>No post!</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
