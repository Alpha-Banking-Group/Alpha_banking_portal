import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import AddCustomer from './pages/AddCustomer';
import AddAccount from './pages/AddAccount';
import Transaction from './pages/Transaction';
import UpdateCustomer from './pages/UpdateCustomer';
import ViewAccounts from './pages/ViewAccounts';
import TransactionHistory from './pages/TransactionHistory';
import BankStats from './pages/BankStats';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // <--- Import this

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hide Navbar on Login Page */}
      {!isLoginPage && <Navbar />}
      
      <Routes>
        {/* --- PUBLIC ROUTE (Anyone can enter) --- */}
        <Route path="/login" element={<Login />} />

        {/* --- PROTECTED ROUTES (Must have Token) --- */}
        <Route path="/" element={
            <PrivateRoute> <Dashboard /> </PrivateRoute> 
        } />
        
        <Route path="/customers" element={
            <PrivateRoute> <CustomerList /> </PrivateRoute> 
        } />
        
        <Route path="/add-customer" element={
            <PrivateRoute> <AddCustomer /> </PrivateRoute> 
        } />
        
        <Route path="/add-account" element={
            <PrivateRoute> <AddAccount /> </PrivateRoute> 
        } />
        
        <Route path="/transaction" element={
            <PrivateRoute> <Transaction /> </PrivateRoute> 
        } />
        
        <Route path="/update-customer" element={
            <PrivateRoute> <UpdateCustomer /> </PrivateRoute> 
        } />
        
        <Route path="/view-accounts/:id" element={
            <PrivateRoute> <ViewAccounts /> </PrivateRoute> 
        } />
        
        <Route path="/account-history/:accountId" element={
            <PrivateRoute> <TransactionHistory /> </PrivateRoute> 
        } />
        
        <Route path="/stats" element={
            <PrivateRoute> <BankStats /> </PrivateRoute> 
        } />

      </Routes>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;