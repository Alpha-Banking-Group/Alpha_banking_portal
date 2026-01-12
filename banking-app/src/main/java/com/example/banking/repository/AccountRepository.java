package com.example.banking.repository;

import com.example.banking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

// Change <Account, Long> to <Account, String>
public interface AccountRepository extends JpaRepository<Account, String> {
}