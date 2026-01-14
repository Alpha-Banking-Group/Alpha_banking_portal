package com.example.banking;

import com.example.banking.entity.User;
import com.example.banking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import java.util.Collections;

@SpringBootApplication
public class BankingAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankingAppApplication.class, args);
    }

    // 1. FORCE ADMIN PASSWORD RESET
    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Find existing admin OR create a new one
            User admin = userRepository.findByUsername("admin").orElse(new User());
            
            // Force set these details every time the app starts
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // Password is ALWAYS 'admin123'
            admin.setRole("ADMIN"); // Ensure role is correct
            
            userRepository.save(admin);
            System.out.println("✅ ADMIN ACCOUNT RESET: Login with 'admin' / 'admin123'");
        };
    }

    // 2. LOGIN FIX
    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
            );
        };
    }

    // 3. EMAIL FIX
    @Bean
    public JavaMailSender javaMailSender() {
        return new JavaMailSenderImpl();
    }
}