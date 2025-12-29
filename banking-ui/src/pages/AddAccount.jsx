import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AddAccount = () => {
    const [searchParams] = useSearchParams();
    const customerId = searchParams.get("customerId");
    const customerName = searchParams.get("name");
    const navigate = useNavigate();

    const [accountData, setAccountData] = useState({ accountType: 'Savings', balance: 0.0, status: 'Active' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/accounts/${customerId}`, accountData);
            alert(`Account created for ${customerName}!`);
            navigate('/customers');
        } catch (error) {
            alert('Failed to create account.');
        }
    };

    return (
        <div className="container mx-auto p-10 max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Open Account</h2>
            <p className="mb-4 text-gray-600">Customer: <b>{customerName} (ID: {customerId})</b></p>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
                <select className="w-full p-2 border rounded" onChange={(e) => setAccountData({...accountData, accountType: e.target.value})}>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                </select>
                <input type="number" placeholder="Initial Balance" className="w-full p-2 border rounded" 
                       onChange={(e) => setAccountData({...accountData, balance: e.target.value})} required />
                
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Create Account</button>
            </form>
        </div>
    );
};

export default AddAccount;