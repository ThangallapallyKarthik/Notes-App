package com.yourcompany.notes.controller;

import com.yourcompany.notes.dto.*;
import com.yourcompany.notes.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(userService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody SignupRequest req) {
        return ResponseEntity.ok(userService.register(req));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgot(@RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(userService.forgot(req));
    }
}
