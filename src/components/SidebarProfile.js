import { API_URL } from 'config/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IoMdMale, IoMdFemale } from 'react-icons/io';
import useSWR from 'swr';

const SidebarProfile = () => {
  const router = useRouter();
  const { data } = useSWR('/posts/myposts');
  const myPosts = data?.myPosts;

  const { data: userLogin } = useSWR('/users/me');
  const user = userLogin?.user;

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center p-1 border border-gray-800 rounded-full cursor-pointer"
        onClick={() => router.push('/users/me')}
      >
        <Image
          src={user?.photo ? user.photo : '/images/default-photo.png'}
          alt={user?.fullname}
          width={72}
          height={72}
          className="rounded-full "
        />
      </div>
      <h2
        className="relative block mt-1 text-xl font-semibold cursor-pointer sm:text-2xl"
        onClick={() => router.push('/users/me')}
      >
        {user?.fullname}
        {user?.gender === 'male' ? (
          <IoMdMale className="absolute text-xs text-blue-500 -right-4 top-2" />
        ) : (
          <IoMdFemale className="text-xs text-pink-500" />
        )}
      </h2>

      <h3 className="text-sm text-gray-400">@{user?.username}</h3>
      {user?.bio && <p>{user?.bio}</p>}
      <div className="flex items-center justify-between mt-1 space-x-4 text-sm sm:text-base">
        <div>
          <p className="text-center">{myPosts?.length}</p>
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
    </div>
  );
};

export default SidebarProfile;
