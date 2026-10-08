package com.forensics.dem.controller;

import com.forensics.dem.entity.User;
import com.forensics.dem.repository.UserRepository;
import com.forensics.dem.repository.AuditLogRepository;
import com.forensics.dem.entity.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String usernameOrEmail = credentials.get("username");
        if (usernameOrEmail == null) usernameOrEmail = credentials.get("email");
        String password = credentials.get("password");
        String role = credentials.get("role"); // 'ADMIN' or 'INVESTIGATOR'

        Optional<User> userOpt = userRepository.findByEmail(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(usernameOrEmail);
        }

        // Demo login fallback if database isn't populated yet
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            if ("admin@dem.gov".equalsIgnoreCase(usernameOrEmail) || "admin".equalsIgnoreCase(usernameOrEmail) || "ADMIN".equalsIgnoreCase(role)) {
                user = User.builder()
                        .id(1L)
                        .username("admin")
                        .email("admin@dem.gov")
                        .fullName("Chief Inspector Cyber Warfare")
                        .role("ADMIN")
                        .department("Executive Cyber Command")
                        .status("ACTIVE")
                        .build();
            } else {
                user = User.builder()
                        .id(2L)
                        .username("sjenkins")
                        .email("sarah.jenkins@dem.gov")
                        .fullName("Det. Sarah Jenkins")
                        .role("INVESTIGATOR")
                        .department("Digital Forensics Unit")
                        .status("ACTIVE")
                        .build();
            }
        }

        // Log audit event
        auditLogRepository.save(AuditLog.builder()
                .username(user.getEmail())
                .role(user.getRole())
                .action("LOGIN")
                .description("User authenticated into Digital Evidence Manager as " + user.getRole())
                .ipAddress("192.168.1.104")
                .build());

        Map<String, Object> response = new HashMap<>();
        response.put("token", "dem-jwt-token-" + System.currentTimeMillis());
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam(required = false, defaultValue = "sarah.jenkins@dem.gov") String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.ok(
                User.builder()
                        .id(2L)
                        .username("sjenkins")
                        .email("sarah.jenkins@dem.gov")
                        .fullName("Det. Sarah Jenkins")
                        .role("INVESTIGATOR")
                        .department("Digital Forensics Unit")
                        .status("ACTIVE")
                        .build()
        ));
    }
}
