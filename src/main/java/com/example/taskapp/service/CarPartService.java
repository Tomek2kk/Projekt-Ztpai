package com.example.taskapp.service;

import com.example.taskapp.dto.CarPartRequest;
import com.example.taskapp.dto.CarPartResponse;
import com.example.taskapp.entity.CarPart;
import com.example.taskapp.event.CarPartCreatedEvent;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.repository.CarPartRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CarPartService {
    private final CarPartRepository carPartRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CarPartService(CarPartRepository carPartRepository, ApplicationEventPublisher eventPublisher) {
        this.carPartRepository = carPartRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<CarPartResponse> findAll(String search) {
        List<CarPart> parts = search == null || search.isBlank()
                ? carPartRepository.findAll()
                : carPartRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrManufacturerContainingIgnoreCase(
                        search, search, search
                );

        return parts.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CarPartResponse findById(Long id) {
        return toResponse(getCarPartOrThrow(id));
    }

    public CarPartResponse create(CarPartRequest request) {
        CarPart carPart = new CarPart(
                request.name(),
                request.category(),
                request.manufacturer(),
                request.sku().toUpperCase(),
                request.price(),
                request.quantityInStock(),
                request.description(),
                request.imageUrl(),
                request.active()
        );

        CarPart saved = carPartRepository.save(carPart);
        eventPublisher.publishEvent(new CarPartCreatedEvent(saved.getId(), saved.getName(), saved.getSku()));
        return toResponse(saved);
    }

    public CarPartResponse update(Long id, CarPartRequest request) {
        CarPart carPart = getCarPartOrThrow(id);
        carPart.setName(request.name());
        carPart.setCategory(request.category());
        carPart.setManufacturer(request.manufacturer());
        carPart.setSku(request.sku().toUpperCase());
        carPart.setPrice(request.price());
        carPart.setQuantityInStock(request.quantityInStock());
        carPart.setDescription(request.description());
        carPart.setImageUrl(request.imageUrl());
        carPart.setActive(request.active());
        return toResponse(carPartRepository.save(carPart));
    }

    public void delete(Long id) {
        CarPart carPart = getCarPartOrThrow(id);
        carPartRepository.delete(carPart);
    }

    private CarPart getCarPartOrThrow(Long id) {
        return carPartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono części samochodowej o id: " + id));
    }

    private CarPartResponse toResponse(CarPart carPart) {
        return new CarPartResponse(
                carPart.getId(),
                carPart.getName(),
                carPart.getCategory(),
                carPart.getManufacturer(),
                carPart.getSku(),
                carPart.getPrice(),
                carPart.getQuantityInStock(),
                carPart.getDescription(),
                carPart.getImageUrl(),
                carPart.isActive(),
                carPart.getCreatedAt(),
                carPart.getUpdatedAt()
        );
    }
}
