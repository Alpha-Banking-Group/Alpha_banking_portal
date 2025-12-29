import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="container mx-auto p-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2"> 🏛️ Welcome to AlphaTrack Bank</h1>
                <p className="text-gray-500 text-lg">Select an action to proceed</p>
            </div>

            {/* ACTION BUTTONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* 1. New Customer */}
                <Link to="/add-customer" className="flex flex-col items-center justify-center p-8 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
                    <span className="text-4xl mb-3">➕</span>
                    <h2 className="text-2xl font-bold">New Customer</h2>
                    <p className="opacity-80 mt-2 text-center">Register a new user</p>
                </Link>
                
                {/* 2. View Customers */}
                <Link to="/customers" className="flex flex-col items-center justify-center p-8 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition transform hover:-translate-y-1">
                    <span className="text-4xl mb-3">👥</span>
                    <h2 className="text-2xl font-bold">Customer List</h2>
                    <p className="opacity-80 mt-2 text-center">Manage accounts & KYC</p>
                </Link>
                
                {/* 3. Transactions */}
                <Link to="/transaction" className="flex flex-col items-center justify-center p-8 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition transform hover:-translate-y-1">
                    <span className="text-4xl mb-3">💸</span>
                    <h2 className="text-2xl font-bold">Transactions</h2>
                    <p className="opacity-80 mt-2 text-center">Deposit, Withdraw, Transfer</p>
                </Link>

                {/* 4. NEW: View Stats (Links to new page) */}
                <Link to="/stats" className="flex flex-col items-center justify-center p-8 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition transform hover:-translate-y-1">
                    <span className="text-4xl mb-3">📊</span>
                    <h2 className="text-2xl font-bold">Bank Stats</h2>
                    <p className="opacity-80 mt-2 text-center">Check Total Reserves</p>
                </Link>

            </div>
        </div>
    );
};

export default Dashboard;