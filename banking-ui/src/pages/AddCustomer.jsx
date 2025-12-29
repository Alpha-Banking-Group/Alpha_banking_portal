import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '', email: '', mobileNumber: '', address: '', dateOfBirth: '', kycStatus: 'PENDING'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', formData);
            alert('Customer Added!');
            navigate('/customers');
        } catch (error) {
            alert('Error adding customer');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="container mx-auto p-10 max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Add New Customer</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
                <input name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="mobileNumber" placeholder="Mobile" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="address" placeholder="Address" onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="date" name="dateOfBirth" onChange={handleChange} className="w-full p-2 border rounded" />
                
                <select name="kycStatus" onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="PENDING">PENDING</option>
                    <option value="VERIFIED">VERIFIED</option>
                </select>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Customer</button>
            </form>
        </div>
    );
};

export default AddCustomer;