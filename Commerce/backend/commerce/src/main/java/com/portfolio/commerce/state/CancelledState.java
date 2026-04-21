package com.portfolio.commerce.state;

import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.exception.InvalidOrderStateException;

public class CancelledState implements OrderState {

    @Override
    public void pay(Order order) {
        throw new InvalidOrderStateException("Cannot pay for a cancelled order.");
    }

    @Override
    public void ship(Order order) {
        throw new InvalidOrderStateException("Cannot ship a cancelled order.");
    }

    @Override
    public void deliver(Order order) {
        throw new InvalidOrderStateException("Cannot deliver a cancelled order.");
    }

    @Override
    public void cancel(Order order) {
        throw new InvalidOrderStateException("Order is already cancelled.");
    }

    @Override
    public String getStatusName() {
        return "CANCELLED";
    }
}
