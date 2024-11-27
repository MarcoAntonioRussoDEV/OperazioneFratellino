import React, { useState, useEffect } from 'react';
import { axios } from '../../config/axios/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '@/redux/userSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      const { jwt } = response.data;
      localStorage.setItem('token', jwt);
      dispatch(getAuthUser());
      setMessage('Login successful');
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);
  return (
    <>
      <img className="w-1/4 mx-auto" src="LOGO.png" alt="logo" />
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
      {message && <p>{message}</p>}
    </>
  );
};

export default LoginForm;
