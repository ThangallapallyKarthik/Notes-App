package com.yourcompany.notes.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    private final Key key;
    private final long expirationMs;

    // ✅ expirationSeconds is now optional — defaults to 86400 (1 day)
    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expirationSeconds:86400}") long expirationSeconds
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationSeconds * 1000L;
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
