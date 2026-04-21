package com.logiflow.shipping.controller;

import com.logiflow.shipping.producer.ShippingEventProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private final ShippingEventProducer producer;

    public ShippingController(ShippingEventProducer producer) {
        this.producer = producer;
    }

    @GetMapping("/trigger")
    public String triggerEvent(
            @RequestParam String trackingId,
            @RequestParam String state) {
        
        producer.sendShippingEvent(trackingId, state);
        
        return String.format("Event sent: TrackingId=%s, State=%s", trackingId, state);
    }
}
