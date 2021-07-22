import axios from 'axios';

const uploadImageMulti = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    formData.append('file', item);
    formData.append('upload_preset', 'social_app');
    formData.append('cloud_name', 'rangdra');

    const { data } = await axios.post(
      'https://api.cloudinary.com/v1_1/rangdra/image/upload',
      formData
    );

    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};

export default uploadImageMulti;
