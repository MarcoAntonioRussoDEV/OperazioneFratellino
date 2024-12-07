import React, { useState } from 'react';
import { axios } from '../../config/axios/axiosConfig'; // Importa la configurazione di Axios

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    console.log({
      name,
      email,
      password,
      city: { id: 1 }, // Imposta l'ID predefinito per la città
      role: { id: 1 }, // Imposta l'ID predefinito per il ruolo
      createdAt: new Date(),
    });
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        city: { id: 1 }, // Imposta l'ID predefinito per la città
        role: { id: 1 }, // Imposta l'ID predefinito per il ruolo
        createdAt: new Date(),
      });
      setMessage('Registration successful!');
    } catch (error) {
      setMessage(
        'Registration failed: ' +
          (error.response ? error.response.data : 'Server error'),
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
