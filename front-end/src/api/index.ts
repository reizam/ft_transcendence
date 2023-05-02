import { BACKEND_URL } from '@/constants/env';
import axios, { AxiosRequestConfig } from 'axios';
import { getCookie } from 'cookies-next';

export const getWithToken = async (path: string, init?: AxiosRequestConfig) => {
  const jwtToken = getCookie('jwt');

  if (!jwtToken) throw new Error('No JWT token found. Please log in again.');

  const config = {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${jwtToken}`,
      'Cache-Control': 'private',
    },
  };

  const response = await axios.get(`${BACKEND_URL}${path}`, config);

  return response.data;
};
