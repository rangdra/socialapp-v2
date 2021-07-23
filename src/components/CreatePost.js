import axios from 'config/axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import Image from 'next/image';

import uploadImageMulti from 'utils/uploadImageMulti';

const CreatePost = ({ setDisplay, postId }) => {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const { data, revalidate } = useSWR('/posts');
  const post = postId ? data?.posts.find((p) => p._id === postId) : null;
  let arr = [];
  useEffect(() => {
    if (post) {
      setBody(post.body);
      setImages(post?.images);
    }
  }, [post]);

  // useEffect(() => {
  //   if (images.length > 0) {
  //     images.map((image) => {
  //       let file = `/${image.name}`;
  //       const blob = new Blob([file], { type: 'image/png' });
  //       const img = URL.createObjectURL(blob);

  //       arr.push(img);
  //     });
  //     setImages(arr); // after component is mount, src will change
  //   }
  // }, []);
  // console.log(arr);
  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleUploadInput = (e) => {
    let newImages = [];
    let num = 0;
    let err = '';
    const files = [...e.target.files];

    if (files.length === 0) return toast.error('Files does not exist.');

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = 'The largest image size is 1mb');

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return (err = 'Image format is incorrect.');

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err) toast.error(err);

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return toast.error('Select up to 5 images.');
    setImages([...images, ...newImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);
    if (imgNewURL.length > 0) media = await uploadImageMulti(imgNewURL);
    // edit post
    if (postId) {
      setLoading(true);
      try {
        const res = await axios.put(`/posts/${postId}`, {
          body,
          images: [...imgOldURL, ...media],
        });
        revalidate();
        mutate('/posts/myposts');
        mutate(`/posts/${postId}`);
        setLoading(false);
        toast.success(res.message);
        setBody('');
        setDisplay(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message);
      }
    } else {
      // create
      setLoading(true);
      try {
        const res = await axios.post('/posts', {
          body,
          images: [...imgOldURL, ...media],
        });
        revalidate();
        mutate('/posts/myposts');
        mutate(`/posts/${postId}`);
        toast.success(res.message);
        setLoading(false);
        setBody('');
        setDisplay(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-700">
          {postId ? 'Edit Post' : 'Create Post'}
        </h1>
        {loading && <p className="text-center">Loading...</p>}
        <div className="relative flex items-center justify-center w-full"></div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-2">
            <label
              htmlFor="body"
              className="block mb-2 text-lg font-bold text-gray-600"
            >
              Body
            </label>
            <textarea
              name="body"
              id="body"
              rows="4"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-2 py-3 transition-all duration-200 border border-indigo-800 rounded-md shadow-lg focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50 "
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="body"
              className="block mb-2 text-lg font-bold text-gray-600"
            >
              Add a picture
              <span className="text-xs italic font-thin text-red-600">
                *Maks 5 photos
              </span>
            </label>

            <input
              type="file"
              onChange={handleUploadInput}
              multiple
              accept="image/*"
              className="mb-2"
            />

            {/* <div className="flex items-center">
              {images &&
                images.map((img, index) => (
                  <div key={index} className="relative flex items-center mr-2">
                    <img
                      src={img.url ? img.url : URL.createObjectURL(img)}
                      alt=""
                      className="object-cover h-24"
                    />
                    <Image
                      src={img.url ? img.url : img}
                      alt="images"
                      width={70}
                      height={96}
                    />

                    <span
                      className="absolute flex items-center justify-center w-5 h-5 text-sm bg-white rounded-full cursor-pointer -top-2 -right-0 hover:bg-gray-300"
                      onClick={() => deleteImage(index)}
                    >
                      x
                    </span>
                  </div>
                ))}
            </div> */}
          </div>
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white transition-all duration-200 bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
