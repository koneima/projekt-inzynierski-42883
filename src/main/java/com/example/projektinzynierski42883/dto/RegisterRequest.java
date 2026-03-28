package com.example.projektinzynierski42883.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String company;
    private String role;
    private String password;
    private String confirmPassword;
}
