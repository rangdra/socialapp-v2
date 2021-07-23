import useSWR, { mutate } from 'swr';
import axios from 'config/axios';

import { useAuthContext } from 'context/AuthContext';
import Post from 'components/Post';
import SidebarProfile from 'components/SidebarProfile';
import Link from 'next/link';
import Layout from 'components/Layout';

export default function Home() {
  const { data, revalidate } = useSWR('/posts');
  const posts = data?.posts;

  const {
    state: { authenticated },
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
      const res = await axios.delete(`/posts/${postId}`);
      revalidate();
      mutate('/posts/myposts');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-7 gap-4 px-20 mt-12">
        <div className="w-full bg-white h-[250px] col-span-2 p-4 text-gray-800 shadow-lg">
          {authenticated ? (
            <SidebarProfile />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="mb-1 text-2xl font-bold text-center">
                Silahkan login terlebih dahulu untuk membuat post.
              </h1>
              <Link href="/auth/signin">
                <a className="text-sm text-blue-500 underline">Sign In</a>
              </Link>
            </div>
          )}
        </div>

        <div className="w-full col-span-3 p-4 text-gray-800 bg-white shadow-lg">
          <section className="mt-4 text-gray-800 posts">
            <h1 className="mb-4 text-2xl font-bold tracking-wider">Posts</h1>
            {posts?.length > 0 ? (
              posts?.map((post) => (
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
    </Layout>
  );
}
