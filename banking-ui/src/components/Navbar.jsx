import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Remove the Token from memory
        localStorage.removeItem('token');
        
        // 2. Redirect to Login Page
        navigate('/login');
        
        // 3. Optional: Reload to clear any application state
        window.location.reload(); 
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                
                {/* LOGO */}
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-2xl">🏦</span> 
                    <span className="text-xl font-bold tracking-wide">AlphaTrack Bank</span>
                </Link>

                {/* MENU LINKS */}
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-blue-200 font-semibold transition">Dashboard</Link>
                    <Link to="/customers" className="hover:text-blue-200 font-semibold transition">Customers</Link>
                    <Link to="/transaction" className="hover:text-blue-200 font-semibold transition">Transactions</Link>
                    
                    {/* LOGOUT BUTTON */}
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold shadow-md transition transform hover:scale-105"
                    >
                        Logout 🚪
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;