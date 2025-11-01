package com.yourcompany.notes.service;

import com.yourcompany.notes.dto.*;
import com.yourcompany.notes.entity.User;
import com.yourcompany.notes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service @RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public AuthResponse login(LoginRequest req) {
    User user = userRepository.findByEmail(req.getUsername())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    if (!encoder.matches(req.getPassword(), user.getPassword()))
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    String token = jwtService.generateToken(user.getId(), Map.of("email", user.getEmail(), "name", user.getName()));
    return new AuthResponse("Login successful", token);
  }

  public AuthResponse register(SignupRequest req) {
    userRepository.findByEmail(req.getEmail()).ifPresent(u -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists"); });
    User saved = userRepository.save(User.builder()
      .name(req.getName())
      .email(req.getEmail())
      .password(encoder.encode(req.getPassword()))
      .googleAccount(false)
      .build());
    String token = jwtService.generateToken(saved.getId(), Map.of("email", saved.getEmail(), "name", saved.getName()));
    return new AuthResponse("User registered", token);
  }

  public AuthResponse forgot(ForgotPasswordRequest req) {
    userRepository.findByEmail(req.getEmail())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    return new AuthResponse("Reset link sent to " + req.getEmail(), null);
  }

  public User getById(String userId) {
    return userRepository.findById(userId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }
}
