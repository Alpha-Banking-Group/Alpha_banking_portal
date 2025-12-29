import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const BankStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    if (!stats) return <div className="p-10 text-center text-gray-500">Loading Analytics...</div>;

    // Prepare Data for Charts
    const flowData = [
        { name: 'Deposits', amount: stats.totalDeposits },
        { name: 'Withdrawals', amount: stats.totalWithdrawals }
    ];

    const COLORS = ['#10B981', '#EF4444']; // Green for Deposit, Red for Withdraw

    return (
        <div className="container mx-auto p-10">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">🏦 Bank Analytics Dashboard</h2>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold">Total Customers</h3>
                    <p className="text-4xl font-bold mt-2">{stats.totalCustomers}</p>
                </div>
                <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold">Total Accounts</h3>
                    <p className="text-4xl font-bold mt-2">{stats.totalAccounts}</p>
                </div>
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold">Total Bank Reserves</h3>
                    <p className="text-4xl font-bold mt-2">₹ {stats.totalBalance.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* 1. Bar Chart: Money Flow */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-xl font-bold mb-4 text-center">Cash Flow Analysis</h3>
                    
                    {/* FIX: Added 'h-80' (320px) to force a height for the chart container */}
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={flowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="amount" fill="#3B82F6" name="Amount (₹)">
                                    {flowData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Visual Note */}
                <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col justify-center items-center h-full">
                    <h3 className="text-xl font-bold mb-4 text-center">Financial Health</h3>
                    <div className="text-center space-y-4">
                        <p className="text-gray-600 text-lg">
                            The bank currently holds <strong className="text-green-600">₹{stats.totalBalance.toLocaleString()}</strong> in customer funds.
                        </p>
                        <p className="text-gray-600">
                            Deposits are trending <span className={`font-bold ${stats.totalDeposits > stats.totalWithdrawals ? "text-green-600" : "text-red-600"}`}>
                                {stats.totalDeposits > stats.totalWithdrawals ? "HIGHER" : "LOWER"}
                            </span> than withdrawals.
                        </p>
                        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm text-yellow-800 shadow-sm">
                            ℹ️ <strong>Tip:</strong> Maintain a healthy reserve ratio by monitoring these withdrawals closely.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankStats;