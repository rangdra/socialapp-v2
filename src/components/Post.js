import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

import Modal from './Modal';
import CreatePost from './CreatePost';
import { useAuthContext } from 'context/AuthContext';

dayjs.extend(relativeTime);

const Post = ({ post, likePost, deletePost }) => {
  const {
    state: { user, authenticated },
  } = useAuthContext();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <Link
          href={`${
            post?.userId?._id === user?._id
              ? '/users/me'
              : `/users/${post?.userId?.username}`
          }`}
        >
          <a className="flex items-center space-x-2">
            <Image
              src={
                post?.userId?.photo
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${post?.userId?.photo}`
                  : '/images/default-photo.png'
              }
              alt={post?.userId?.fullname}
              width={32}
              height={32}
              className="rounded-full "
            />
            <div>
              <p className="text-sm font-bold leading-none">
                {post?.userId?.fullname}
              </p>
              <p className="text-xs text-gray-400">@{post?.userId?.username}</p>
            </div>
          </a>
        </Link>
        {authenticated && post?.userId?._id === user?._id && (
          <div className="flex items-center space-x-2">
            <Modal
              content={(toggle, setDisplay) => (
                <CreatePost setDisplay={setDisplay} postId={post?._id} />
              )}
            >
              {(toggle) => (
                <FaEdit
                  className="w-4 h-4 text-yellow-500 cursor-pointer"
                  title="Edit post"
                  onClick={() => {
                    toggle();
                  }}
                />
              )}
            </Modal>
            <Modal
              content={(toggle, setDisplay) => (
                <div className="flex flex-col items-center justify-center h-48 text-center text-gray-800">
                  <h1 className="text-2xl">
                    Anda yakin ingin menghapus post ?
                  </h1>
                  <div className="flex items-center mt-4 space-x-2">
                    <button
                      className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => deletePost(post?._id)}
                    >
                      Hapus
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => setDisplay(false)}
                    >
                      Kembali
                    </button>
                  </div>
                </div>
              )}
            >
              {(toggle) => (
                <FaTrash
                  className="w-4 h-4 text-red-500 cursor-pointer hover:opacity-50"
                  title="Delete post"
                  onClick={() => toggle()}
                />
              )}
            </Modal>
          </div>
        )}
      </div>
      <p className="mt-1">{post.body}</p>
      <div className="flex mb-2 space-x-2">
        {post?.images &&
          post?.images.map((img) => (
            <Modal
              content={() => (
                <div className="flex justify-center p-4">
                  <img src={img.url} alt={img.url} className="object-cover" />
                </div>
              )}
            >
              {(toggle) => (
                <Image
                  src={img.url}
                  height={80}
                  width={80}
                  key={img.url}
                  onClick={() => {
                    toggle();
                  }}
                  className="cursor-pointer"
                  title={`${post?.userId?.username} image post`}
                />
              )}
            </Modal>
          ))}
      </div>

      <div className="flex items-center space-x-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => likePost(post?._id)}
        >
          {post?.likeId.includes(user?._id) ? (
            <>
              <AiFillLike className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-sm">{post.likeId.length} Unlike</span>
            </>
          ) : (
            <>
              <AiOutlineLike className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-sm">{post.likeId.length} like</span>
            </>
          )}
        </div>
        <Link href={`/posts/${post?._id}`}>
          <a className="flex items-center">
            <BiCommentDetail className="w-4 h-4 mr-1" />
            <span className="text-sm">{post.comments.length} comments</span>
          </a>
        </Link>
      </div>
      <span className="text-xs">{dayjs(post.createdAt).fromNow()}</span>
    </div>
  );
};

export default Post;
