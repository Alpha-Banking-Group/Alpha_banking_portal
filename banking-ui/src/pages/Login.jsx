import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // We will update this file next

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 1. Send Credentials
            const response = await api.post('/auth/login', { username, password });
            
            // 2. Get Token from response
            const token = response.data.token;

            // 3. Save Token to Local Storage
            localStorage.setItem('token', token);

            // 4. Go to Dashboard
            navigate('/');
            window.location.reload(); // Refresh to apply changes
        } catch (err) {
            setError("Invalid Username or Password");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Admin Login</h2>
                
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;