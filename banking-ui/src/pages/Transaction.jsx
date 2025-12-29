import React, { useState } from 'react';
import api from '../services/api';

const Transaction = () => {
    const [type, setType] = useState('deposit');
    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [targetId, setTargetId] = useState(''); // Only for transfer

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (type === 'transfer') {
            await api.put(`/accounts/${accountId}/transfer`, { toAccountId: targetId, amount: parseFloat(amount) });
            alert('Transfer Successful!');
        } else {
            await api.put(`/accounts/${accountId}/${type}`, { amount: parseFloat(amount) });
            alert(`${type.toUpperCase()} Successful!`);
        }
        
        // --- NEW CODE: Clear the form ---
        setAccountId('');
        setAmount('');
        setTargetId('');
        // --------------------------------
        
    } catch (error) {
        console.error(error);
        alert('Transaction Failed: ' + (error.response?.data?.message || 'Check KYC or Balance'));
    }
};
    return (
        <div className="container mx-auto p-10 max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Perform Transaction</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
                
                {/* Select Operation Type */}
                <div>
                    <label className="block text-gray-700 mb-1">Transaction Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                {/* Account ID */}
                <input type="number" placeholder="Your Account ID" value={accountId} 
                       onChange={(e) => setAccountId(e.target.value)} className="w-full p-2 border rounded" required />

                {/* Amount */}
                <input type="number" placeholder="Amount (₹)" value={amount} 
                       onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded" required />

                {/* Target Account (Only for Transfer) */}
                {type === 'transfer' && (
                    <input type="number" placeholder="Receiver Account ID" value={targetId} 
                           onChange={(e) => setTargetId(e.target.value)} className="w-full p-2 border rounded" required />
                )}

                <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 font-bold uppercase">
                    Process {type}
                </button>
            </form>
        </div>
    );
};

export default Transaction;