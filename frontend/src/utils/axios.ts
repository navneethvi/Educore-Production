import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://educore.live/api',
  withCredentials: true,
});

export default instance

