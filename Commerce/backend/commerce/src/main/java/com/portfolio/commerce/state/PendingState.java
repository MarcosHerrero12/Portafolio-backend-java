package com.portfolio.commerce.state;

import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.exception.InvalidOrderStateException;

public class PendingState implements OrderState {

    @Override
    public void pay(Order order) {
        order.setStatus("PAID");
        order.setState(new PaidState());
    }

    @Override
    public void ship(Order order) {
        throw new InvalidOrderStateException("Cannot ship a pending order. It must be paid first.");
    }

    @Override
    public void deliver(Order order) {
        throw new InvalidOrderStateException("Cannot deliver a pending order.");
    }

    @Override
    public void cancel(Order order) {
        order.setStatus("CANCELLED");
        order.setState(new CancelledState());
    }

    @Override
    public String getStatusName() {
        return "PENDING";
    }
}
