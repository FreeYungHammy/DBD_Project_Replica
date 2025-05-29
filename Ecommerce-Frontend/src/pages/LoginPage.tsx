import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'buyer'|'seller'>('buyer');
  const [street, setStreet]     = useState('');
  const [city, setCity]         = useState('');
  const [zip, setZip]           = useState('');
  const [country, setCountry]   = useState('');
  const [phone, setPhone]       = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const { login }               = useUser();

  const clearForm = () => {
    setName(''); setEmail(''); setPassword('');
    setRole('buyer'); setStreet(''); setCity('');
    setZip(''); setCountry(''); setPhone(''); setError('');
  };

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    clearForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
        login(res.data);
      } else {
        const payload = {
          name,
          email,
          password,
          role,
          address: { street, city, zip, country },
          phone
        };
        const res = await axios.post('http://localhost:5000/api/users', payload);
        login(res.data);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-gray-800 text-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {mode === 'login' ? 'Log In' : 'Create Account'}
      </h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label className="block mb-1">Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-gray-700"
              />
            </div>
            <div>
              <label className="block mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as 'buyer'|'seller')}
                className="w-full px-3 py-2 rounded bg-gray-700"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <fieldset className="border border-gray-600 p-4 rounded">
              <legend className="px-2">Address (optional)</legend>
              <div className="space-y-2">
                <input
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Street"
                  className="w-full px-3 py-2 rounded bg-gray-700"
                />
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2 rounded bg-gray-700"
                />
                <input
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                  placeholder="ZIP / Postal Code"
                  className="w-full px-3 py-2 rounded bg-gray-700"
                />
                <input
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Country"
                  className="w-full px-3 py-2 rounded bg-gray-700"
                />
              </div>
            </fieldset>
            <div>
              <label className="block mb-1">Phone (optional)</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700"
              />
            </div>
          </>
        )}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            autoComplete={mode==='login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`w-full py-2 rounded text-white font-semibold transition ${
            mode === 'login'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>

        {/* Mode switch buttons at the bottom */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`px-4 py-2 rounded ${
              mode === 'login'
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className={`px-4 py-2 rounded ${
              mode === 'register'
                ? 'bg-green-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
