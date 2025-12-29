import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const UpdateCustomer = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id"); // Get ID from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '', email: '', mobileNumber: '', address: '', dateOfBirth: '', kycStatus: ''
    });

    // 1. Fetch existing data when page loads
    useEffect(() => {
        if (id) {
            api.get(`/customers/${id}`)
                .then(response => {
                    setFormData(response.data);
                })
                .catch(error => alert("Error fetching customer data"));
        }
    }, [id]);

    // 2. Handle form changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Send updated data to Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/customers/${id}`, formData);
            alert('Customer Updated Successfully!');
            navigate('/customers');
        } catch (error) {
            console.error("Update failed", error);
            alert('Failed to update customer');
        }
    };

    return (
        <div className="container mx-auto p-10 max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Customer</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
                
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Mobile</label>
                    <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">KYC Status</label>
                    <select name="kycStatus" value={formData.kycStatus} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="PENDING">PENDING</option>
                        <option value="VERIFIED">VERIFIED</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 font-bold">
                    Update Details
                </button>
            </form>
        </div>
    );
};

export default UpdateCustomer;