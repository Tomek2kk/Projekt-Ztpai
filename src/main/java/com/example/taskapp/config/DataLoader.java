package com.example.taskapp.config;

import com.example.taskapp.entity.CarPart;
import com.example.taskapp.repository.CarPartRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(CarPartRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new CarPart(
                        "Klocki hamulcowe Brembo P 85 020",
                        "Układ hamulcowy",
                        "Brembo",
                        "BRM-P85020",
                        new BigDecimal("159.99"),
                        24,
                        "Komplet przednich klocków hamulcowych do popularnych modeli aut osobowych.",
                        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80",
                        true
                ));
                repository.save(new CarPart(
                        "Filtr oleju Mann W 712/95",
                        "Filtry",
                        "Mann-Filter",
                        "MANN-W71295",
                        new BigDecimal("34.50"),
                        80,
                        "Wysokiej jakości filtr oleju do silników benzynowych i diesla.",
                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
                        true
                ));
                repository.save(new CarPart(
                        "Akumulator Bosch S4 60Ah",
                        "Elektryka",
                        "Bosch",
                        "BOSCH-S4-60AH",
                        new BigDecimal("389.00"),
                        12,
                        "Niezawodny akumulator 12V do samochodów miejskich i kompaktowych.",
                        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
                        true
                ));
                repository.save(new CarPart(
                        "Amortyzator Sachs Super Touring",
                        "Zawieszenie",
                        "Sachs",
                        "SACHS-ST-001",
                        new BigDecimal("249.90"),
                        18,
                        "Amortyzator gazowy zapewniający stabilną pracę zawieszenia.",
                        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
                        true
                ));
            }
        };
    }
}
