package com.example.taskapp.controller;

import com.example.taskapp.dto.CarPartRequest;
import com.example.taskapp.dto.CarPartResponse;
import com.example.taskapp.service.CarPartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/car-parts")
public class CarPartController {
    private final CarPartService carPartService;

    public CarPartController(CarPartService carPartService) {
        this.carPartService = carPartService;
    }

    @GetMapping
    public List<CarPartResponse> findAll(@RequestParam(required = false) String search) {
        return carPartService.findAll(search);
    }

    @GetMapping("/{id}")
    public CarPartResponse findById(@PathVariable Long id) {
        return carPartService.findById(id);
    }

    @PostMapping
    public ResponseEntity<CarPartResponse> create(@Valid @RequestBody CarPartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carPartService.create(request));
    }

    @PutMapping("/{id}")
    public CarPartResponse update(@PathVariable Long id, @Valid @RequestBody CarPartRequest request) {
        return carPartService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carPartService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
