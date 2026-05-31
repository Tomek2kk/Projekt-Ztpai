package com.example.taskapp.event;

public record CarPartCreatedEvent(Long carPartId, String name, String sku) {
}
