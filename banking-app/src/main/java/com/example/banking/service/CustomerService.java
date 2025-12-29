package com.example.banking.service;

import com.example.banking.entity.Account; 
import com.example.banking.entity.Customer;
import com.example.banking.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = getCustomer(id); 
        
        customer.setFullName(customerDetails.getFullName());
        customer.setEmail(customerDetails.getEmail());
        customer.setMobileNumber(customerDetails.getMobileNumber());
        customer.setAddress(customerDetails.getAddress());
        customer.setDateOfBirth(customerDetails.getDateOfBirth());
        customer.setKycStatus(customerDetails.getKycStatus());
        
        return customerRepository.save(customer);
    }
    
    // --- SAFE DELETE LOGIC (Only keep this one) ---
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // RULE: Check if any account has money before deleting
        if (customer.getAccounts() != null) {
            for (Account acc : customer.getAccounts()) {
                if (acc.getBalance() > 0) {
                    throw new RuntimeException("Cannot delete customer! Account #" + acc.getAccountNumber() + " still has a balance of ₹" + acc.getBalance() + ". Please withdraw funds first.");
                }
            }
        }

        // If validation passes, delete the customer
        customerRepository.delete(customer);
    }
}