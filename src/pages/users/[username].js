import Image from 'next/image';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/router';

import Post from 'components/Post';
import axios from 'config/axios';
import { useAuthContext } from 'context/AuthContext';
import { toast } from 'react-toastify';
import Layout from 'components/Layout';
import { API_URL } from 'config/url';

const UserPage = () => {
  const router = useRouter();
  const { data } = useSWR('/posts');
  const {
    state: { user: userLogin },
  } = useAuthContext();
  const { data: userByName, revalidate } = useSWR(
    `/users/${router.query.username}`
  );

  const user = userByName?.user;

  const postsByUsername = data?.posts.filter(
    (post) => post.userId?.username === router.query.username
  );

  const follow = async () => {
    try {
      await axios.put(`/users/${user._id}/follow`);
      revalidate();
      mutate('/users/me');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Layout title={`${user?.username} profile`}>
      <div className="px-4 py-8 sm:my-12 sm:px-20">
        <div className="flex flex-col items-center">
          <div className="w-full bg-white rounded shadow sm:w-1/2">
            {user?.banner ? (
              <div
                className="w-full h-[200px] bg-center bg-cover"
                style={{
                  backgroundImage: `url('${user?.banner}')`,
                }}
                title="Banner"
              ></div>
            ) : (
              <div
                className="w-full h-[200px] bg-center bg-cover"
                style={{
                  backgroundImage: "url('/images/default-banner.png')",
                }}
                title="Banner"
              ></div>
            )}
            <div className="relative flex flex-col items-center">
              <div className="absolute flex items-center justify-center border-8 border-indigo-600 rounded-full -top-12">
                <Image
                  src={user?.photo ? user.photo : '/images/default-photo.png'}
                  alt={user?.fullname}
                  width={72}
                  height={72}
                  className="rounded-full"
                  title="Photo"
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
                  <p className="text-center">{postsByUsername?.length}</p>
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
              <button
                onClick={() => follow()}
                className={`${
                  user?.followers.includes(userLogin?._id)
                    ? 'bg-white text-indigo-500 border-2 border-indigo-500'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                } w-1/2 py-2 mx-auto mt-4 font-semibold sm:text-base text-sm transition-all duration-200 rounded`}
              >
                {user?.followers.includes(userLogin?._id)
                  ? 'Unfollow'
                  : 'Follow'}
              </button>
            </div>
            <div className="mt-4 mb-2 border border-gray-800"></div>
            <div className="border border-gray-800 "></div>
            <section className="p-4 text-gray-800 posts">
              <h1 className="mb-2 text-xl font-bold tracking-wider sm:text-2xl">
                {router.query.username} Posts
              </h1>
              {postsByUsername?.length > 0 ? (
                postsByUsername?.map((post) => (
                  <Post key={post._id} post={post} />
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

export default UserPage;
