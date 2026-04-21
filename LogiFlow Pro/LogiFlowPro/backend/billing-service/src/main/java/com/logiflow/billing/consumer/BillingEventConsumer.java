package com.logiflow.billing.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;

@Service
public class BillingEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(BillingEventConsumer.class);

    @KafkaListener(topics = "shipping-events", groupId = "billing-group")
    public void consumeShippingEvent(ShippingEvent event) {
        log.info("Received shipping event in billing service: {}", event);
        
        processBilling(event);
    }

    private void processBilling(ShippingEvent event) {
        // Simulate processing that might fail with a database exception
        if ("SIMULATE_DB_ERROR".equals(event.state())) {
            log.error("Simulating database failure for DLT testing");
            throw new SimulatedDataAccessException("Database connection failed during billing process");
        }
        
        log.info("Billing processed successfully for trackingId: {}", event.trackingId());
    }

    public record ShippingEvent(String trackingId, String state) {}

    public static class SimulatedDataAccessException extends DataAccessException {
        public SimulatedDataAccessException(String msg) {
            super(msg);
        }
    }
}
