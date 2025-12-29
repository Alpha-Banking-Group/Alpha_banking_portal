package com.example.banking.controller;

import com.example.banking.entity.Account;
import com.example.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.banking.entity.Transaction;
import java.util.List;
import java.util.Map;

import java.util.Map;

@RestController
@CrossOrigin(origins="http://localhost:5173")
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService service;

    @PostMapping("/{customerId}")
    public Account createAccount(@PathVariable Long customerId, @RequestBody Account account) {
        return service.createAccount(customerId, account);
    }
    
    @GetMapping("/{id}/transactions")
    public List<Transaction> getTransactions(@PathVariable Long id) {
        return service.getTransactionHistory(id);
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable Long id) {
        return service.getAccount(id);
    }

    @PutMapping("/{id}/deposit")
    public Account deposit(@PathVariable Long id, @RequestBody Map<String, Double> request) {
        Double amount = request.get("amount");
        return service.deposit(id, amount);
    }

    @PutMapping("/{id}/withdraw")
    public Account withdraw(@PathVariable Long id, @RequestBody Map<String, Double> request) {
        Double amount = request.get("amount");
        return service.withdraw(id, amount);
    }

    @PutMapping("/{id}/transfer")
    public String transfer(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Long toAccountId = Long.valueOf(request.get("toAccountId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        
        service.transfer(id, toAccountId, amount);
        return "Transfer Successful";
    }
    
    //Toggle Status (Freeze/Unfreeze)
    @PutMapping("/{id}/status")
    public Account toggleStatus(@PathVariable Long id) {
        return service.updateAccountStatus(id);
    }

   
}