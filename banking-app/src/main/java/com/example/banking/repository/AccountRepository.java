package com.example.banking.repository;

import com.example.banking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, String> {
    // This finds all accounts owned by a specific customer
    List<Account> findByCustomerId(Long customerId);
}