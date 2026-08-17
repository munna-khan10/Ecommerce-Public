import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    const verify = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/verify-email`, { params: { token } });
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          toast.success(response.data.message);
        } else {
          setStatus('error');
          setMessage(response.data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed.');
      }
    };

    verify();
  }, [backendUrl, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center border border-gray-200 p-8">
        <div className="inline-flex items-center gap-2 mb-6">
          <p className="prata-regular text-3xl">Email Verification</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === 'verifying' && <div className="text-sm text-gray-500">Please wait...</div>}

        {status === 'success' && (
          <Link to="/login" className="inline-block bg-black text-white px-8 py-3">
            Go to Login
          </Link>
        )}

        {status === 'error' && (
          <Link to="/login" className="inline-block bg-black text-white px-8 py-3">
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
