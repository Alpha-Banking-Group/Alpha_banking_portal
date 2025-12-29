import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, Link } from 'react-router-dom';

const ViewAccounts = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);

    // Load Data
    const loadCustomerData = () => {
        api.get(`/customers/${id}`)
            .then(res => setCustomer(res.data))
            .catch(err => console.error("Error fetching accounts:", err));
    };

    useEffect(() => {
        loadCustomerData();
    }, [id]);

    // --- NEW: Toggle Status Function ---
    const handleToggleStatus = (accountId) => {
        if(window.confirm("Are you sure you want to change the status of this account?")) {
            api.put(`/accounts/${accountId}/status`)
                .then(() => {
                    alert("Account status updated!");
                    loadCustomerData(); // Refresh UI to show new status
                })
                .catch(err => alert("Failed to update status"));
        }
    };

    if (!customer) return <div className="p-10">Loading...</div>;

    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Accounts for {customer.fullName}</h2>
                <Link to="/customers" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Back</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customer.accounts && customer.accounts.length > 0 ? (
                    customer.accounts.map((account) => (
                        <div key={account.accountNumber} className={`p-6 rounded-lg shadow-md border-l-4 
                            ${account.status === 'ACTIVE' ? 'bg-white border-blue-500' : 'bg-red-50 border-red-500'}`}>
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-800">{account.accountType} Account</h3>
                                    <p className="text-gray-600"><strong>Account ID:</strong> {account.accountNumber}</p>
                                </div>
                                
                                {/* Status Badge */}
                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                    ${account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                    {account.status || 'ACTIVE'}
                                </span>
                            </div>

                            <div className="text-3xl font-bold text-green-600 my-4">
                                ₹ {account.balance}
                            </div>
                            
                            {/* BUTTONS SECTION */}
                            <div className="space-y-2">
                                {/* Only show transaction button if ACTIVE */}
                                {account.status !== 'FROZEN' ? (
                                    <Link to="/transaction" className="block text-center bg-purple-100 text-purple-700 py-2 rounded font-semibold hover:bg-purple-200">
                                        Perform Transaction
                                    </Link>
                                ) : (
                                    <button disabled className="block w-full text-center bg-gray-200 text-gray-400 py-2 rounded font-semibold cursor-not-allowed">
                                        Transactions Locked
                                    </button>
                                )}

                                <Link to={`/account-history/${account.accountNumber}`} className="block text-center bg-gray-800 text-white py-2 rounded font-semibold hover:bg-black">
                                    View Passbook
                                </Link>

                                {/* --- NEW: Freeze/Unfreeze Button --- */}
                                <button 
                                    onClick={() => handleToggleStatus(account.accountNumber)}
                                    className={`block w-full text-center py-2 rounded font-semibold text-white transition
                                        ${account.status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {account.status === 'ACTIVE' ? '❄ Freeze Account' : '🔓 Unfreeze Account'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-yellow-100 p-5 rounded text-yellow-800">No accounts found.</div>
                )}
            </div>
        </div>
    );
};

export default ViewAccounts;