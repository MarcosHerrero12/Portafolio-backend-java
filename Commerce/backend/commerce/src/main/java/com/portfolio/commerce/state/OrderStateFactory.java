package com.portfolio.commerce.state;

public class OrderStateFactory {
    
    public static OrderState getState(String status) {
        if (status == null) return new PendingState();
        
        return switch (status.toUpperCase()) {
            case "PENDING" -> new PendingState();
            case "PAID" -> new PaidState();
            case "SHIPPED" -> new ShippedState();
            case "DELIVERED" -> new DeliveredState();
            case "CANCELLED" -> new CancelledState();
            default -> throw new IllegalArgumentException("Unknown order status: " + status);
        };
    }
}
