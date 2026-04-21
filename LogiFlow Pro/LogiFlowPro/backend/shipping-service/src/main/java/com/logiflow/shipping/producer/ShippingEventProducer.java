package com.logiflow.shipping.producer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ShippingEventProducer {

    private static final Logger log = LoggerFactory.getLogger(ShippingEventProducer.class);
    private static final String TOPIC = "shipping-events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public ShippingEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendShippingEvent(String trackingId, String state) {
        log.info("Sending shipping event: TrackingId={}, State={}", trackingId, state);
        
        ShippingEvent event = new ShippingEvent(trackingId, state);
        
        kafkaTemplate.send(TOPIC, trackingId, event)
            .whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Event sent successfully for TrackingId={}", trackingId);
                } else {
                    log.error("Failed to send event for TrackingId={}", trackingId, ex);
                }
            });
    }
    
    public record ShippingEvent(String trackingId, String state) {}
}
