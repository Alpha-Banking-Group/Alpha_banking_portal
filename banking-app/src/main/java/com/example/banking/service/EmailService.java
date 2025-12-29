package com.example.banking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendTransactionAlert(String toEmail, String name, String type, Double amount, Double balance) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Bank Alert: " + type + " of Rs. " + amount);
            
            message.setText("Dear " + name + ",\n\n" +
                    "Your account has been debited/credited.\n" +
                    "Transaction Type: " + type + "\n" +
                    "Amount: Rs. " + amount + "\n" +
                    "Current Balance: Rs. " + balance + "\n\n" +
                    "Thank you,\nAlphaTrack Bank");

            javaMailSender.send(message);
            System.out.println("Mail sent successfully to " + toEmail);
            
        } catch (Exception e) {
            System.out.println("Error sending email: " + e.getMessage());
        }
    }
}