package com.example.taskapp.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CarPartRequest(
        @NotBlank(message = "Nazwa części jest wymagana")
        @Size(max = 120, message = "Nazwa może mieć maksymalnie 120 znaków")
        String name,

        @NotBlank(message = "Kategoria jest wymagana")
        @Size(max = 80, message = "Kategoria może mieć maksymalnie 80 znaków")
        String category,

        @NotBlank(message = "Producent jest wymagany")
        @Size(max = 80, message = "Producent może mieć maksymalnie 80 znaków")
        String manufacturer,

        @NotBlank(message = "SKU jest wymagane")
        @Pattern(regexp = "^[A-Z0-9-]{3,40}$", message = "SKU może zawierać duże litery, cyfry i myślniki")
        String sku,

        @NotNull(message = "Cena jest wymagana")
        @DecimalMin(value = "0.01", message = "Cena musi być większa od 0")
        @Digits(integer = 8, fraction = 2, message = "Cena może mieć maksymalnie 8 cyfr i 2 miejsca po przecinku")
        BigDecimal price,

        @NotNull(message = "Stan magazynowy jest wymagany")
        @Min(value = 0, message = "Stan magazynowy nie może być ujemny")
        Integer quantityInStock,

        @Size(max = 1000, message = "Opis może mieć maksymalnie 1000 znaków")
        String description,

        @Size(max = 500, message = "Adres obrazka może mieć maksymalnie 500 znaków")
        String imageUrl,

        boolean active
) {}
