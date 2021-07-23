import axios from 'axios';
import { API_URL } from 'config/url';

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

instance.interceptors.response.use((response) => response.data);

export default instance;
