package com.example.taskapp.repository;

import com.example.taskapp.entity.CarPart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarPartRepository extends JpaRepository<CarPart, Long> {
    List<CarPart> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrManufacturerContainingIgnoreCase(
            String name, String category, String manufacturer
    );

    boolean existsBySkuIgnoreCase(String sku);
}
