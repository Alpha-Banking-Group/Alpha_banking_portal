import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Load Data
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = () => {
        api.get('/customers')
            .then(res => setCustomers(res.data))
            .catch(err => console.error(err));
    };

    // --- NEW: Delete Function ---
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer? This cannot be undone.");
        
        if (confirmDelete) {
            api.delete(`/customers/${id}`)
                .then(() => {
                    // Success: Remove from UI instantly
                    setCustomers(customers.filter(c => c.id !== id));
                    alert("Customer deleted successfully!");
                })
                .catch(err => {
                    // Error: Show the message from Backend (e.g., "Balance is not 0")
                    console.error("Delete failed:", err);
                    // Use optional chaining just in case response is undefined
                    alert("Failed: " + (err.response?.data?.message || err.response?.data || "Could not delete customer."));
                });
        }
    };

    // Filter Logic
    const filteredCustomers = customers.filter(customer => 
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toString().includes(searchTerm)
    );

    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Customer Database</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-blue-500 shadow-sm w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm font-semibold">
                            <th className="px-5 py-3">ID</th>
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">KYC</th>
                            <th className="px-5 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer) => {
                            const hasAccount = customer.accounts && customer.accounts.length > 0;
                            return (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="px-5 py-5 text-sm">{customer.id}</td>
                                    <td className="px-5 py-5 text-sm font-bold">{customer.fullName}</td>
                                    <td className="px-5 py-5 text-sm text-gray-600">{customer.email}</td>
                                    <td className="px-5 py-5 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${customer.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {customer.kycStatus || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 text-sm text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            
                                            {/* Open Account / Active Badge */}
                                            {!hasAccount ? (
                                                <Link to={`/add-account?customerId=${customer.id}&name=${customer.fullName}`} className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600">Open Account</Link>
                                            ) : (
                                                <Link to={`/view-accounts/${customer.id}`} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Balance</Link>
                                            )}

                                            {/* Edit Button */}
                                            <Link to={`/update-customer?id=${customer.id}`} className="bg-orange-400 text-white px-3 py-1 rounded text-xs hover:bg-orange-500">Edit</Link>

                                            {/* --- NEW: Delete Button --- */}
                                            <button 
                                                onClick={() => handleDelete(customer.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 shadow-sm"
                                                title="Delete Customer"
                                            >
                                                🗑
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerList;