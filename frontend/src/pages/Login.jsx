import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setVerificationPending(true);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
          setVerificationPending(Boolean(response.data.emailNotVerified));
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
          setVerificationPending(Boolean(response.data.emailNotVerified));
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      setVerificationPending(Boolean(error.response?.data?.emailNotVerified));
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/user/resend-verification`, { email });
      if (response.data.success) toast.success(response.data.message);
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState !== 'Login' && (
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full px-3 py-2 border border-gray-800" required />
      )}

      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setVerificationPending(false); }} placeholder="Your Email" className="w-full px-3 py-2 border border-gray-800" required />

      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 characters)" minLength={8} className="w-full px-3 py-2 border border-gray-800" required />

      {verificationPending && (
        <div className="w-full bg-yellow-50 border border-yellow-200 p-3 text-sm">
          <p className="text-gray-700 mb-2">Your email is not verified yet.</p>
          <button type="button" onClick={resendVerification} className="underline">Resend verification email</button>
        </div>
      )}

      <div className="w-full flex justify-between text-sm">
        <span></span>
        {currentState === 'Login' ? (
          <button type="button" onClick={() => { setCurrentState('Sign Up'); setVerificationPending(false); }}>Create account</button>
        ) : (
          <button type="button" onClick={() => { setCurrentState('Login'); setVerificationPending(false); }}>Login Here</button>
        )}
      </div>

      <button type="submit" disabled={loading} className="bg-black text-white px-8 py-2 mt-4 disabled:opacity-50">
        {loading ? 'Please wait...' : currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
