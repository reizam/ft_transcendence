import { BACKEND_URL } from '@/constants/env';
import axios, { AxiosRequestConfig } from 'axios';
import { getCookie } from 'cookies-next';

export async function getWithToken<Type = unknown>(
  path: string,
  init?: AxiosRequestConfig
): Promise<Type> {
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
}

export async function putWithToken<Type = unknown>(
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  init?: AxiosRequestConfig
): Promise<Type> {
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

  const response = await axios.put(`${BACKEND_URL}${path}`, body, config);

  return response.data;
}

export async function postWithToken<Type = unknown>(
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  init?: AxiosRequestConfig
): Promise<Type> {
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

  const response = await axios.post(`${BACKEND_URL}${path}`, body, config);

  return response.data;
}

export async function updateWithToken<Type = unknown>(
  path: string,
  data: object,
  init?: AxiosRequestConfig
): Promise<Type> {
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

  const response = await axios.patch(`${BACKEND_URL}${path}`, data, config);

  return response.data;
}
