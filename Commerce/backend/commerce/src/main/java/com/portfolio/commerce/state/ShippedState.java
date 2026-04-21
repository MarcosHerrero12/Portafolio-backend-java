package com.portfolio.commerce.state;

import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.exception.InvalidOrderStateException;

public class ShippedState implements OrderState {

    @Override
    public void pay(Order order) {
        throw new InvalidOrderStateException("Order is already paid and shipped.");
    }

    @Override
    public void ship(Order order) {
        throw new InvalidOrderStateException("Order is already shipped.");
    }

    @Override
    public void deliver(Order order) {
        order.setStatus("DELIVERED");
        order.setState(new DeliveredState());
    }

    @Override
    public void cancel(Order order) {
        throw new InvalidOrderStateException("Cannot cancel an order that is already shipped.");
    }

    @Override
    public String getStatusName() {
        return "SHIPPED";
    }
}
