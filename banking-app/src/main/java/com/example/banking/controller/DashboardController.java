package com.example.banking.controller;

import com.example.banking.dto.DashboardStats;
import com.example.banking.entity.Account;
import com.example.banking.entity.Transaction;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.CustomerRepository;
import com.example.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;
@GetMapping(value="/git")
    public String test()
    {
        return "git testing";
    }
    @GetMapping("/stats")
    public DashboardStats getStats() {
        // 1. Counts
        long totalCustomers = customerRepository.count();
        long totalAccounts = accountRepository.count();
        
        // 2. Total Balance
        double totalBalance = accountRepository.findAll().stream()
                .mapToDouble(Account::getBalance)
                .sum();

        // 3. Transaction Analysis
        List<Transaction> transactions = transactionRepository.findAll();
        
        // FIX: Used getTransactionType() instead of getType()
        double totalDeposits = transactions.stream()
                .filter(t -> "DEPOSIT".equals(t.getTransactionType())) 
                .mapToDouble(Transaction::getAmount)
                .sum();
                
        double totalWithdrawals = transactions.stream()
                .filter(t -> "WITHDRAWAL".equals(t.getTransactionType()) || "TRANSFER".equals(t.getTransactionType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        // 4. Return Data
        return new DashboardStats(totalCustomers, totalAccounts, totalBalance, totalDeposits, totalWithdrawals);
    }
}
