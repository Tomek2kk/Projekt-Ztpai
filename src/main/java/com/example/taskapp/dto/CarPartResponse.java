package com.example.taskapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CarPartResponse(
        Long id,
        String name,
        String category,
        String manufacturer,
        String sku,
        BigDecimal price,
        Integer quantityInStock,
        String description,
        String imageUrl,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
