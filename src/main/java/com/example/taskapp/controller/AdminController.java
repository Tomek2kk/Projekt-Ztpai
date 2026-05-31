package com.example.taskapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/check")
    public Map<String, String> check() {
        return Map.of("status", "OK", "role", "ADMIN");
    }
}
