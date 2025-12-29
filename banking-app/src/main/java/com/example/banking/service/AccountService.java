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

    @Autowired
    private EmailService emailService; // <--- INJECT EMAIL SERVICE

    // --- HELPER 1: Check KYC ---
    private void checkKyc(Account account) {
        String kycStatus = account.getCustomer().getKycStatus();
        if (!"VERIFIED".equalsIgnoreCase(kycStatus)) {
            throw new RuntimeException("Transaction Failed: Customer KYC is " + kycStatus);
        }
    }

    // --- HELPER 2: Check Account Status (Freeze Logic) ---
    private void checkAccountStatus(Account account) {
        if ("FROZEN".equalsIgnoreCase(account.getStatus()) || "INACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new RuntimeException("Transaction Failed: Account is FROZEN/INACTIVE. Please contact the bank.");
        }
    }

    // Create Account (With "One Account Per Customer" Rule)
    public Account createAccount(Long customerId, Account account) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!customer.getAccounts().isEmpty()) {
            throw new RuntimeException("Customer already has an account. Cannot create another.");
        }

        account.setCustomer(customer);
        if (account.getStatus() == null) {
            account.setStatus("ACTIVE");
        }
        
        return accountRepository.save(account);
    }

    // Get Account
    public Account getAccount(Long id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    // --- UPDATED: Deposit (Checks Status + Saves History + Sends Email) ---
    public Account deposit(Long id, Double amount) {
        Account account = getAccount(id);
        
        // 1. Validations
        checkAccountStatus(account);
        checkKyc(account);
        
        // 2. Process Deposit
        account.setBalance(account.getBalance() + amount);
        Account savedAccount = accountRepository.save(account);

        // 3. Save Transaction
        Transaction transaction = new Transaction(amount, "DEPOSIT", savedAccount);
        transactionRepository.save(transaction);

        // 4. Send Email Alert
        emailService.sendTransactionAlert(
            account.getCustomer().getEmail(),
            account.getCustomer().getFullName(),
            "DEPOSIT",
            amount,
            savedAccount.getBalance()
        );

        return savedAccount;
    }

    // --- UPDATED: Withdraw (Checks Status + Saves History + Sends Email) ---
    public Account withdraw(Long id, Double amount) {
        Account account = getAccount(id);
        
        // 1. Validations
        checkAccountStatus(account);
        checkKyc(account);

        // 2. Check Balance
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient Balance");
        }
        
        // 3. Process Withdraw
        account.setBalance(account.getBalance() - amount);
        Account savedAccount = accountRepository.save(account);

        // 4. Save Transaction
        Transaction transaction = new Transaction(amount, "WITHDRAW", savedAccount);
        transactionRepository.save(transaction);

        // 5. Send Email Alert
        emailService.sendTransactionAlert(
            account.getCustomer().getEmail(),
            account.getCustomer().getFullName(),
            "WITHDRAWAL",
            amount,
            savedAccount.getBalance()
        );

        return savedAccount;
    }

    // --- Transfer Money ---
    @Transactional 
    public void transfer(Long fromId, Long toId, Double amount) {
        // Calls deposit/withdraw so status checks, history & emails happen automatically!
        withdraw(fromId, amount); 
        deposit(toId, amount); 
    }

    // --- Toggle Account Status (Freeze/Unfreeze) ---
    public Account updateAccountStatus(Long id) {
        Account account = getAccount(id);
        
        if ("ACTIVE".equalsIgnoreCase(account.getStatus())) {
            account.setStatus("FROZEN"); 
        } else {
            account.setStatus("ACTIVE"); 
        }
        
        return accountRepository.save(account);
    }

    // Get Transaction History
    public List<Transaction> getTransactionHistory(Long accountId) {
        return transactionRepository.findByAccountAccountNumber(accountId);
    }
}