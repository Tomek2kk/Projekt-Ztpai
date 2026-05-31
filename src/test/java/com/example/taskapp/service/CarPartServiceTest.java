package com.example.taskapp.service;

import com.example.taskapp.dto.CarPartRequest;
import com.example.taskapp.entity.CarPart;
import com.example.taskapp.event.CarPartCreatedEvent;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.repository.CarPartRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CarPartServiceTest {

    @Mock
    private CarPartRepository carPartRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private CarPartService carPartService;

    @Test
    void shouldCreateCarPartAndPublishEvent() {
        CarPart saved = new CarPart(
                1L,
                "Klocki hamulcowe",
                "Układ hamulcowy",
                "Brembo",
                "BRM-001",
                new BigDecimal("149.99"),
                10,
                "Opis",
                "https://example.com/image.jpg",
                true,
                null,
                null
        );
        when(carPartRepository.save(any(CarPart.class))).thenReturn(saved);

        var response = carPartService.create(new CarPartRequest(
                "Klocki hamulcowe",
                "Układ hamulcowy",
                "Brembo",
                "brm-001",
                new BigDecimal("149.99"),
                10,
                "Opis",
                "https://example.com/image.jpg",
                true
        ));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Klocki hamulcowe");
        assertThat(response.sku()).isEqualTo("BRM-001");

        ArgumentCaptor<CarPartCreatedEvent> eventCaptor = ArgumentCaptor.forClass(CarPartCreatedEvent.class);
        verify(eventPublisher).publishEvent(eventCaptor.capture());
        assertThat(eventCaptor.getValue().carPartId()).isEqualTo(1L);
        assertThat(eventCaptor.getValue().name()).isEqualTo("Klocki hamulcowe");
        assertThat(eventCaptor.getValue().sku()).isEqualTo("BRM-001");
    }

    @Test
    void shouldThrowWhenCarPartDoesNotExist() {
        when(carPartRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carPartService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }
}
