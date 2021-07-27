import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

import Modal from 'components/Modal';
import CreatePost from 'components/CreatePost';
import { useAuthContext } from 'context/AuthContext';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/router';
import axios from 'config/axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from 'components/Layout';
import { API_URL } from 'config/url';

dayjs.extend(relativeTime);

const DetailPost = () => {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const { data, revalidate } = useSWR(`/posts/${router.query.id}`);
  const detailPost = data?.post;

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

      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/posts/${router.query.id}/comment`, { comment });
      revalidate();
      setComment('');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const res = await axios.delete(`/posts/${postId}/comment/${commentId}`);
      revalidate();
      toast.success(res.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <Layout title={`${detailPost?.userId?.username} detail post`}>
      <div className="w-11/12 p-4 mx-auto my-8 bg-white shadow-lg sm:my-12 sm:w-1/3">
        <div className="flex items-center justify-between">
          <Link
            href={`${
              detailPost?.userId?._id === user?._id
                ? '/users/me'
                : `/users/${detailPost?.userId?.username}`
            }`}
          >
            <a className="flex items-center space-x-2">
              <Image
                src={
                  detailPost?.userId?.photo
                    ? detailPost?.userId?.photo
                    : '/images/default-photo.png'
                }
                alt={detailPost?.userId?.fullname}
                width={40}
                height={40}
                className="rounded-full "
              />
              <div>
                <p className="text-xs font-semibold leading-none sm:text-sm">
                  {detailPost?.userId?.fullname}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  @{detailPost?.userId?.username}
                </p>
              </div>
            </a>
          </Link>
          {authenticated && detailPost?.userId?._id === user?._id && (
            <div className="flex items-center space-x-1">
              <Modal
                content={(toggle, setDisplay) => (
                  <CreatePost
                    setDisplay={setDisplay}
                    postId={detailPost?._id}
                  />
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
        <p className="mt-1">{detailPost?.body}</p>
        <div className="flex mb-2 space-x-2">
          {detailPost?.images &&
            detailPost?.images.map((img, idx) => (
              <Modal
                key={idx}
                content={() => (
                  <div className="flex justify-center p-4">
                    <Image
                      src={img.url}
                      alt={img.url}
                      height={300}
                      width={300}
                      className="object-cover"
                    />
                  </div>
                )}
              >
                {(toggle) => (
                  <Image
                    src={img.url}
                    alt={img.url}
                    height={80}
                    width={80}
                    key={img.url}
                    onClick={() => {
                      toggle();
                    }}
                    className="cursor-pointer"
                    title={`${detailPost?.userId?.username} image post`}
                  />
                )}
              </Modal>
            ))}
        </div>

        <span className="text-[10px] sm:text-xs">
          {dayjs(detailPost?.createdAt).fromNow()}
        </span>
        <div className="flex items-center py-2 my-2 space-x-4 text-xs border-t border-b border-gray-800 sm:text-sm">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => likePost(detailPost?._id)}
          >
            {detailPost?.likeId.includes(user?._id) ? (
              <>
                <AiFillLike className="w-4 h-4 mr-1 text-blue-500" />
                <span>{detailPost?.likeId.length} Unlike</span>
              </>
            ) : (
              <>
                <AiOutlineLike className="w-4 h-4 mr-1 text-blue-500" />
                <span>{detailPost?.likeId.length} like</span>
              </>
            )}
          </div>
          <Link href={`/posts/${detailPost?._id}`}>
            <a className="flex items-center">
              <BiCommentDetail className="w-4 h-4 mr-1" />
              <span>{detailPost?.comments.length} comments</span>
            </a>
          </Link>
        </div>
        <form
          className="flex items-center my-4 space-x-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="pl-2 text-sm border-b border-gray-400 sm:text-base focus:border-gray-800 focus:outline-none"
            style={{ flex: 1 }}
            placeholder="Tulis Komentar"
          />
          <button type="submit">
            <FiSend className="cursor-pointer hover:opacity-50" />
          </button>
        </form>
        <div>
          {detailPost?.comments.map((comment) => (
            <div
              className="flex items-center space-x-2 space-y-2"
              key={comment?._id}
            >
              <Image
                src={comment?.userId.photo}
                alt={comment?.userId.username}
                width={32}
                height={32}
                className="rounded-full"
              />

              <div>
                <p className="text-sm font-semibold leading-3">
                  {comment?.userId.username}
                  <span className="ml-1 text-sm font-normal">
                    {comment?.comment}
                  </span>
                </p>
                <p className="sm:text-xs text-[10px]">
                  {dayjs(comment?.createdAt).fromNow()}
                  {user?._id === comment?.userId._id && (
                    <span
                      className="ml-1 text-xs text-red-500 cursor-pointer"
                      onClick={() =>
                        deleteComment(detailPost?._id, comment._id)
                      }
                    >
                      hapus
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DetailPost;
