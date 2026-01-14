package com.example.banking.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.banking.entity.Account;
import com.example.banking.entity.Transaction;
import com.example.banking.service.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/{customerId}")
    public ResponseEntity<Account> createAccount(@PathVariable Long customerId, @RequestBody Account account) {
        return ResponseEntity.ok(accountService.createAccount(customerId, account));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getAccount(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getAccount(accountNumber));
    }

    @PutMapping("/{accountNumber}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable String accountNumber, @RequestBody Map<String, Double> request) {
        // Handle both integer and double input
        Object amountObj = request.get("amount");
        Double amount = Double.valueOf(amountObj.toString());
        return ResponseEntity.ok(accountService.deposit(accountNumber, amount));
    }

    @PutMapping("/{accountNumber}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable String accountNumber, @RequestBody Map<String, Double> request) {
        Object amountObj = request.get("amount");
        Double amount = Double.valueOf(amountObj.toString());
        return ResponseEntity.ok(accountService.withdraw(accountNumber, amount));
    }

    // FIXED TRANSFER METHOD
    @PutMapping("/{accountNumber}/transfer")
    public ResponseEntity<String> transfer(@PathVariable String accountNumber, @RequestBody Map<String, Object> request) {
        
        // 1. Try to get destination account using BOTH possible names
        Object toAccountObj = request.get("toAccountId");
        if (toAccountObj == null) {
            toAccountObj = request.get("toAccount");
        }

        if (toAccountObj == null) {
            return ResponseEntity.badRequest().body("Error: Missing 'toAccountId' or 'toAccount'");
        }

        String toAccount = toAccountObj.toString();
        Double amount = Double.valueOf(request.get("amount").toString());

        accountService.transfer(accountNumber, toAccount, amount);
        return ResponseEntity.ok("Transfer Successful");
    }

    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getTransactionHistory(accountNumber));
    }
    
    @PutMapping("/{accountNumber}/status")
    public ResponseEntity<Account> updateAccountStatus(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.updateAccountStatus(accountNumber));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Account>> getAccountsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(accountService.getAccountsByCustomerId(customerId));
    }
}