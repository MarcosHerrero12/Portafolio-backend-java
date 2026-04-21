package com.portfolio.commerce.state;

import com.portfolio.commerce.entity.Order;

public interface OrderState {
    void pay(Order order);
    void ship(Order order);
    void deliver(Order order);
    void cancel(Order order);
    String getStatusName();
}
