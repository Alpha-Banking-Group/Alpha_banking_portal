import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const TransactionHistory = () => {
    const { accountId } = useParams();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        api.get(`/accounts/${accountId}/transactions`)
            .then(res => {
                setTransactions(res.data);
            })
            .catch(err => console.error("Error fetching transactions:", err));
    }, [accountId]);

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Add Title
        doc.text("AlphaTrack Bank - Account Statement", 14, 10);
        doc.text(`Account ID: ${accountId}`, 14, 20);

        // Define Table Columns and Rows
        const tableColumn = ["Transaction ID", "Date", "Type", "Amount (INR)"];
        const tableRows = [];

        transactions.forEach(txn => {
            const transactionData = [
                txn.id,
                new Date(txn.timestamp).toLocaleString(),
                txn.transactionType,
                txn.amount.toFixed(2)
            ];
            tableRows.push(transactionData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save(`Statement_Account_${accountId}.pdf`);
    };

    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                
                <button 
                    onClick={downloadPDF}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-bold flex items-center shadow-md"
                >
                    📋  Download PDF
                </button>
            </div>
            
            <p className="mb-4 text-gray-600"> 📇 Viewing history for Account ID: <span className="font-mono font-bold">{accountId}</span></p>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-800 text-white text-left uppercase text-sm font-semibold">
                            <th className="px-5 py-3">ID</th>
                            <th className="px-5 py-3">Date & Time</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((txn) => (
                                <tr key={txn.id} className="border-b hover:bg-gray-50">
                                    <td className="px-5 py-5 text-sm">{txn.id}</td>
                                    <td className="px-5 py-5 text-sm text-gray-600">
                                        {new Date(txn.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-5 text-sm font-bold">
                                        <span className={`px-2 py-1 rounded text-xs 
                                            ${txn.transactionType === 'DEPOSIT' ? 'bg-green-100 text-green-800' : 
                                              txn.transactionType === 'WITHDRAW' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {txn.transactionType}
                                        </span>
                                    </td>
                                    <td className={`px-5 py-5 text-sm font-bold 
                                        ${txn.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.transactionType === 'DEPOSIT' ? '+' : '-'} ₹{txn.amount}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-5 text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-6">
                <Link to="/customers" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Back to Customers
                </Link>
            </div>
        </div>
    );
};

export default TransactionHistory;