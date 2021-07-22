import axios from 'axios';
import { toast } from 'react-toastify';

const useActions = () => {
  const likePost = async (postId, revalidate) => {
    try {
      await axios.put(`/posts/${postId}/like`);

      revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId, revalidate) => {
    try {
      const res = await axios.delete(`/posts/${postId}`);
      revalidate();
      toast.success(res.message);
    } catch (error) {
      console.log(error);
    }
  };
  return { likePost, deletePost };
};

export default useActions;
