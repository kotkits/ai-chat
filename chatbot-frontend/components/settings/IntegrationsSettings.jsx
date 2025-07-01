import React, { useState } from 'react';

// A helper function to verify the API key with the provider
async function verifyApiKey(key) {
  try {
    // Replace this URL with your provider's verification endpoint
    const response = await fetch('https://api.example.com/ping', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

export default function IntegrationsSettings() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setApiKey(e.target.value.trim());
    setStatus('idle');
    setMessage('');
  };

  const handleVerify = async () => {
    if (!apiKey) {
      setStatus('error');
      setMessage('Please enter your API secret key.');
      return;
    }

    setStatus('verifying');
    setMessage('Verifying...');

    const isValid = await verifyApiKey(apiKey);
    if (isValid) {
      setStatus('success');
      setMessage('✅ Your API key is valid and ready to use.');
    } else {
      setStatus('error');
      setMessage('❌ Verification failed. Please check your key and try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">API Integration</h3>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        API Secret Key
      </label>
      <input
        type="password"
        value={apiKey}
        onChange={handleInputChange}
        placeholder="Enter your secret key"
        className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleVerify}
        disabled={status === 'verifying'}
        className={
          `w-full py-2 font-medium rounded ${
            status === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`
        }
      >
        {status === 'verifying' ? 'Verifying...' : 'Verify Key'}
      </button>

      {message && (
        <p
          className={`mt-4 text-sm ${
            status === 'success' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
