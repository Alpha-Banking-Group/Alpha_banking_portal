package com.example.banking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String transactionType; // "DEPOSIT", "WITHDRAW", "TRANSFER"
    private LocalDateTime timestamp;

    // Link to Account
    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnore // Prevents infinite loop
    private Account account;

    // Constructors
    public Transaction() {}

    public Transaction(Double amount, String transactionType, Account account) {
        this.amount = amount;
        this.transactionType = transactionType;
        this.account = account;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }
}