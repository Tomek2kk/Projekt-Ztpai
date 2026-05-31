package com.example.taskapp.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class CarPartEventListener {
    private static final Logger log = LoggerFactory.getLogger(CarPartEventListener.class);

    @EventListener
    public void onCarPartCreated(CarPartCreatedEvent event) {
        log.info("Dodano część samochodową do sklepu: id={}, name={}, sku={}", event.carPartId(), event.name(), event.sku());
    }
}
