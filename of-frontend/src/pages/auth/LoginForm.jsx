import React, { useState } from 'react';
import { axios } from '../../config/axios/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '@/redux/userSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { AUTH_DATA } from '@/config/links/urls';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const tc = useTranslateAndCapitalize();
  const { user } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(AUTH_DATA.login, {
        email,
        password,
      });
      const { jwt, isFirstAccess } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('isAuthenticated', true);
      dispatch(getAuthUser());

      if (isFirstAccess) {
        navigate(`/user/${email}`);
      } else {
        navigate('/');
      }

      setMessage('Login successful');
    } catch (error) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      setMessage(error.response.data.message);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-1/4 items-center mx-auto"
      >
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
      {message && <p>{`${tc('error')}: ${tc(message)}`}</p>}
    </>
  );
};

export default LoginForm;
