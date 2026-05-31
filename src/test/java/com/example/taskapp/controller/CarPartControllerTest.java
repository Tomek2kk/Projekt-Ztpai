package com.example.taskapp.controller;

import com.example.taskapp.dto.CarPartRequest;
import com.example.taskapp.entity.CarPart;
import com.example.taskapp.repository.CarPartRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "app.security.username=admin",
        "app.security.password=admin123",
        "spring.datasource.url=jdbc:h2:mem:car_parts_test;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class CarPartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CarPartRepository carPartRepository;

    @BeforeEach
    void setUp() {
        carPartRepository.deleteAll();
    }

    @Test
    void shouldRequireAuthenticationForAdminOperations() throws Exception {
        CarPartRequest request = new CarPartRequest(
                "Filtr kabinowy",
                "Filtry",
                "Bosch",
                "BOSCH-999",
                new BigDecimal("49.99"),
                5,
                "Opis",
                "https://example.com/image.jpg",
                true
        );

        mockMvc.perform(post("/api/car-parts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturnCarPartsPublicly() throws Exception {
        carPartRepository.save(new CarPart(
                "Klocki hamulcowe",
                "Układ hamulcowy",
                "Brembo",
                "BRM-001",
                new BigDecimal("149.99"),
                10,
                "Opis",
                "https://example.com/image.jpg",
                true
        ));

        mockMvc.perform(get("/api/car-parts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Klocki hamulcowe"))
                .andExpect(jsonPath("$[0].sku").value("BRM-001"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldValidateRequest() throws Exception {
        CarPartRequest invalid = new CarPartRequest(
                "",
                "Filtry",
                "Bosch",
                "bad sku",
                new BigDecimal("0.00"),
                -1,
                "Opis",
                "",
                true
        );

        mockMvc.perform(post("/api/car-parts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.name").exists())
                .andExpect(jsonPath("$.validationErrors.sku").exists())
                .andExpect(jsonPath("$.validationErrors.price").exists())
                .andExpect(jsonPath("$.validationErrors.quantityInStock").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateCarPart() throws Exception {
        mockMvc.perform(post("/api/car-parts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CarPartRequest(
                                "Filtr oleju",
                                "Filtry",
                                "Mann-Filter",
                                "MANN-001",
                                new BigDecimal("39.99"),
                                25,
                                "Opis",
                                "https://example.com/image.jpg",
                                true
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Filtr oleju"))
                .andExpect(jsonPath("$.sku").value("MANN-001"));

        assertThat(carPartRepository.existsBySkuIgnoreCase("MANN-001")).isTrue();
    }
}
