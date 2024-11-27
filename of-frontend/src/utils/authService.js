import { useDispatch } from 'react-redux';
import { axios } from '../config/axios/axiosConfig';
import { logoutUser, resetStatus } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config/links/urls';

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};

// export const getUserInfo = async () => {
//   try {
//     const response = await axios.get('/api/auth/me');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user info:', error);
//     throw error;
//   }
// };
