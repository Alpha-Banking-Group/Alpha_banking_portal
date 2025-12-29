package com.example.banking.config;

import com.example.banking.entity.User;
import com.example.banking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder; // Keep this import

@Configuration
public class DataSeeder {

    // REMOVED: public PasswordEncoder passwordEncoder() { ... } 
    // (Because it is now in SecurityConfig.java)

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin exists, if not, create one
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123")); 
                admin.setRole("ADMIN");
                userRepository.save(admin);
                
                System.out.println("---------------------------------");
                System.out.println("DEFAULT ADMIN USER CREATED");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
                System.out.println("---------------------------------");
            }
        };
    }
}