package com.example.banking.repository;

import com.example.banking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // This finds transactions where the Account's accountNumber (String) matches the parameter
    List<Transaction> findByAccountAccountNumber(String accountNumber);
}