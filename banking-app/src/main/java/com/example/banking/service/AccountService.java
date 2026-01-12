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

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // --- Helper Methods ---
    private void checkKyc(Account account) {
        if (account.getCustomer() != null && !"VERIFIED".equalsIgnoreCase(account.getCustomer().getKycStatus())) {
            throw new RuntimeException("Transaction Failed: KYC not verified");
        }
    }

    private void checkAccountStatus(Account account) {
        if ("FROZEN".equalsIgnoreCase(account.getStatus()) || "INACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new RuntimeException("Transaction Failed: Account is FROZEN/INACTIVE");
        }
    }

    // --- Core Features ---

    public Account createAccount(Long customerId, Account account) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        if(account.getAccountNumber() == null || account.getAccountNumber().isEmpty()){
             throw new RuntimeException("Account Number is required");
        }

        account.setCustomer(customer);
        if (account.getStatus() == null) account.setStatus("ACTIVE");
        
        return accountRepository.save(account);
    }

    // FIX: Changed Long id -> String accountNumber
    public Account getAccount(String accountNumber) {
        return accountRepository.findById(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));
    }

    public Account deposit(String accountNumber, Double amount) {
        Account account = getAccount(accountNumber);
        checkAccountStatus(account);
        checkKyc(account);
        
        account.setBalance(account.getBalance() + amount);
        Account savedAccount = accountRepository.save(account);

        Transaction transaction = new Transaction(amount, "DEPOSIT", savedAccount);
        transactionRepository.save(transaction);

        return savedAccount;
    }

    public Account withdraw(String accountNumber, Double amount) {
        Account account = getAccount(accountNumber);
        checkAccountStatus(account);
        checkKyc(account);

        if (account.getBalance() < amount) throw new RuntimeException("Insufficient Balance");
        
        account.setBalance(account.getBalance() - amount);
        Account savedAccount = accountRepository.save(account);

        Transaction transaction = new Transaction(amount, "WITHDRAWAL", savedAccount);
        transactionRepository.save(transaction);

        return savedAccount;
    }

    @Transactional 
    public void transfer(String fromAccNum, String toAccNum, Double amount) {
        withdraw(fromAccNum, amount); 
        deposit(toAccNum, amount); 
    }

    // --- MISSING METHODS ADDED HERE (Fixed for String ID) ---

    public Account updateAccountStatus(String accountNumber) {
        Account account = getAccount(accountNumber);
        if ("ACTIVE".equalsIgnoreCase(account.getStatus())) {
            account.setStatus("FROZEN");
        } else {
            account.setStatus("ACTIVE");
        }
        return accountRepository.save(account);
    }

    public List<Transaction> getTransactionHistory(String accountNumber) {
        return transactionRepository.findByAccountAccountNumber(accountNumber);
    }
}