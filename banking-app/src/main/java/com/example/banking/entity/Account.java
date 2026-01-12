package com.example.banking.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "account")
public class Account {

    @Id
    @Column(name = "acnumber")
    private String accountNumber;

    @Column(name = "atype")
    private String accountType;

    private Double balance;

    @Column(name = "astatus")
    private String status;

    @Column(name = "opening_date")
    private String openingDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "custid")
    @JsonBackReference
    private Customer customer;

    // --- MANUAL GETTERS AND SETTERS (Fixes Red Lines) ---

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOpeningDate() { return openingDate; }
    public void setOpeningDate(String openingDate) { this.openingDate = openingDate; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
}