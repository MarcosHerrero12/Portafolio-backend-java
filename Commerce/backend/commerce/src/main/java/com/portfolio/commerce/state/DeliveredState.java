package com.portfolio.commerce.state;

import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.exception.InvalidOrderStateException;

public class DeliveredState implements OrderState {

    @Override
    public void pay(Order order) {
        throw new InvalidOrderStateException("Order is already delivered.");
    }

    @Override
    public void ship(Order order) {
        throw new InvalidOrderStateException("Order is already delivered.");
    }

    @Override
    public void deliver(Order order) {
        throw new InvalidOrderStateException("Order is already delivered.");
    }

    @Override
    public void cancel(Order order) {
        throw new InvalidOrderStateException("Cannot cancel an order that has been delivered.");
    }

    @Override
    public String getStatusName() {
        return "DELIVERED";
    }
}
