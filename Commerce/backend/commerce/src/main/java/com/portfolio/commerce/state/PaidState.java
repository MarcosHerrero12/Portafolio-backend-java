package com.portfolio.commerce.state;

import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.exception.InvalidOrderStateException;

public class PaidState implements OrderState {

    @Override
    public void pay(Order order) {
        throw new InvalidOrderStateException("Order is already paid.");
    }

    @Override
    public void ship(Order order) {
        order.setStatus("SHIPPED");
        order.setState(new ShippedState());
    }

    @Override
    public void deliver(Order order) {
        throw new InvalidOrderStateException("Cannot deliver an order that has not been shipped yet.");
    }

    @Override
    public void cancel(Order order) {
        // Here we could handle refund logic later
        order.setStatus("CANCELLED");
        order.setState(new CancelledState());
    }

    @Override
    public String getStatusName() {
        return "PAID";
    }
}
