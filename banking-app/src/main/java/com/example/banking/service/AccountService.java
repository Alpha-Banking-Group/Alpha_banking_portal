package com.example.banking.service;

import com.example.banking.entity.Account;
import com.example.banking.entity.Customer;
import com.example.banking.entity.Transaction;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.CustomerRepository;
import com.example.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Random;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    private String generateRandomAccountNumber() {
        Random random = new Random();
        long number = 1000000000L + (long)(random.nextDouble() * 9000000000L);
        return String.valueOf(number);
    }

    // --- DEBUGGING HELPERS ---
    private void checkKyc(Account account, String userType) {
        String kycStatus = account.getCustomer().getKycStatus();
        System.out.println("Checking KYC for " + userType + " (" + account.getCustomer().getFullName() + "): " + kycStatus);
        
        if (!"VERIFIED".equalsIgnoreCase(kycStatus)) {
            System.out.println("❌ FAILURE: " + userType + " is not VERIFIED.");
            throw new RuntimeException("Transaction Failed: " + userType + " KYC is not verified");
        }
    }

    private void checkBalance(Account account, Double amount) {
        System.out.println("Checking Balance for " + account.getAccountNumber() + ". Has: " + account.getBalance() + ", Needs: " + amount);
        if (account.getBalance() < amount) {
            System.out.println("❌ FAILURE: Insufficient Funds.");
            throw new RuntimeException("Transaction Failed: Insufficient Balance");
        }
    }

    // --- CORE LOGIC ---

    public Account createAccount(Long customerId, Account account) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        account.setCustomer(customer);
        if (account.getAccountNumber() == null || account.getAccountNumber().isEmpty()) {
             account.setAccountNumber(generateRandomAccountNumber());
        }
        if (account.getStatus() == null) account.setStatus("ACTIVE");
        if (account.getOpeningDate() == null) account.setOpeningDate(java.time.LocalDate.now().toString());
        return accountRepository.save(account);
    }

    public Account getAccount(String accountNumber) {
        return accountRepository.findById(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));
    }

    public Account deposit(String accountNumber, Double amount) {
        Account account = getAccount(accountNumber);
        // We only check KYC for deposit, not balance
        checkKyc(account, "Receiver"); 
        
        account.setBalance(account.getBalance() + amount);
        Account savedAccount = accountRepository.save(account);
        transactionRepository.save(new Transaction(amount, "DEPOSIT", savedAccount));
        return savedAccount;
    }

    public Account withdraw(String accountNumber, Double amount) {
        Account account = getAccount(accountNumber);
        checkKyc(account, "Sender"); // Check Sender KYC
        checkBalance(account, amount); // Check Sender Balance
        
        account.setBalance(account.getBalance() - amount);
        Account savedAccount = accountRepository.save(account);
        transactionRepository.save(new Transaction(amount, "WITHDRAWAL", savedAccount));
        return savedAccount;
    }

    @Transactional 
    public void transfer(String fromAccNum, String toAccNum, Double amount) {
        System.out.println("--- STARTING TRANSFER ---");
        System.out.println("From: " + fromAccNum + " To: " + toAccNum + " Amount: " + amount);
        
        // 1. Withdraw checks Sender KYC and Balance
        withdraw(fromAccNum, amount); 
        
        // 2. Deposit checks Receiver KYC
        deposit(toAccNum, amount); 
        
        System.out.println("--- TRANSFER SUCCESSFUL ---");
    }
    
    // ... keep your other existing methods (updateAccountStatus, getTransactionHistory, getAccountsByCustomerId) ...
    public Account updateAccountStatus(String accountNumber) {
        Account account = getAccount(accountNumber);
        account.setStatus("ACTIVE".equalsIgnoreCase(account.getStatus()) ? "FROZEN" : "ACTIVE");
        return accountRepository.save(account);
    }

    public List<Transaction> getTransactionHistory(String accountNumber) {
        return transactionRepository.findByAccountAccountNumber(accountNumber);
    }

    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }
}