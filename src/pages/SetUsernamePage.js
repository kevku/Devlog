import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-config';
import { AuthContext } from '../context/AuthProvider';

const SetUsernamePage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const checkUsername = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data && data.username) {
        navigate('/dashboard');
      }
    };

    checkUsername();
  }, [user, navigate]);

  const isUsernameTaken = async (username) => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username);

    if (error) {
      console.error('Error checking username:', error);
      return false;
    }
    return data.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setError('Username can only contain alphanumeric characters.');
      return;
    }

    setLoading(true);
    const taken = await isUsernameTaken(username);
    if (taken) {
      setError('Username is already taken. Please choose another one.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .upsert({ id: user.id, username }, { onConflict: 'id' });

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setError('Error setting username. Please try again.');
      console.error('Error setting username:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Set Your Username</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Setting...' : 'Set Username'}
        </button>
      </form>
    </div>
  );
};

export default SetUsernamePage;