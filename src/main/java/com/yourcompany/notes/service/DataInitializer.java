package com.yourcompany.notes.service;

import com.yourcompany.notes.entity.User;
import com.yourcompany.notes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        users.findByEmail("demo@user.com").orElseGet(() ->
                users.save(User.builder()
                        .name("Demo User")
                        .email("demo@user.com")
                        .password(encoder.encode("Demo@123"))
                        .googleAccount(false)
                        .build())
        );
    }
}
