package com.example.banking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.banking.entity.Account;
import com.example.banking.entity.Transaction;
import com.example.banking.service.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Create Account: Customer ID is still Long, that's fine
    @PostMapping("/{customerId}")
    public Account createAccount(@PathVariable Long customerId, @RequestBody Account account) {
        return accountService.createAccount(customerId, account);
    }

    // FIX: Changed Long -> String
    @GetMapping("/{accountNumber}")
    public Account getAccount(@PathVariable String accountNumber) {
        return accountService.getAccount(accountNumber);
    }

    // FIX: Changed Long -> String
    @PostMapping("/{accountNumber}/deposit")
    public Account deposit(@PathVariable String accountNumber, @RequestBody Map<String, Double> request) {
        return accountService.deposit(accountNumber, request.get("amount"));
    }

    // FIX: Changed Long -> String
    @PostMapping("/{accountNumber}/withdraw")
    public Account withdraw(@PathVariable String accountNumber, @RequestBody Map<String, Double> request) {
        return accountService.withdraw(accountNumber, request.get("amount"));
    }

    @PostMapping("/transfer")
    public String transfer(@RequestBody Map<String, Object> request) {
        // FIX: Casting to String instead of Long
        String fromAccount = request.get("fromAccount").toString();
        String toAccount = request.get("toAccount").toString();
        Double amount = Double.valueOf(request.get("amount").toString());

        accountService.transfer(fromAccount, toAccount, amount);
        return "Transfer Successful";
    }

    // FIX: Changed Long -> String
    @GetMapping("/{accountNumber}/transactions")
    public List<Transaction> getTransactionHistory(@PathVariable String accountNumber) {
        return accountService.getTransactionHistory(accountNumber);
    }
    
    // FIX: Changed Long -> String
    @PutMapping("/{accountNumber}/status")
    public Account updateAccountStatus(@PathVariable String accountNumber) {
        return accountService.updateAccountStatus(accountNumber);
    }
}