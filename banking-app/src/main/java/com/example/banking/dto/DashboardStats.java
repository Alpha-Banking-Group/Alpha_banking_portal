package com.example.banking.dto;

public class DashboardStats {
    private long totalCustomers;
    private long totalAccounts;
    private double totalBalance;
    private double totalDeposits;
    private double totalWithdrawals;

    // --- THIS CONSTRUCTOR IS MISSING OR NOT SAVED ---
    public DashboardStats(long totalCustomers, long totalAccounts, double totalBalance, double totalDeposits, double totalWithdrawals) {
        this.totalCustomers = totalCustomers;
        this.totalAccounts = totalAccounts;
        this.totalBalance = totalBalance;
        this.totalDeposits = totalDeposits;
        this.totalWithdrawals = totalWithdrawals;
    }

    // Getters
    public long getTotalCustomers() { return totalCustomers; }
    public long getTotalAccounts() { return totalAccounts; }
    public double getTotalBalance() { return totalBalance; }
    public double getTotalDeposits() { return totalDeposits; }
    public double getTotalWithdrawals() { return totalWithdrawals; }
}