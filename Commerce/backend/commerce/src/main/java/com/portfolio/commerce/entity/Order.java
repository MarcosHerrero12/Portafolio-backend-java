package com.portfolio.commerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.portfolio.commerce.state.OrderState;
import com.portfolio.commerce.state.OrderStateFactory;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Builder.Default
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, PAID, SHIPPED, DELIVERED, CANCELLED

    @Transient
    @com.fasterxml.jackson.annotation.JsonIgnore
    private OrderState state;

    @PostLoad
    @PostPersist
    @PostUpdate
    public void init() {
        this.state = OrderStateFactory.getState(this.status);
    }

    public void pay() {
        if (this.state == null) init();
        this.state.pay(this);
    }

    public void ship() {
        if (this.state == null) init();
        this.state.ship(this);
    }

    public void deliver() {
        if (this.state == null) init();
        this.state.deliver(this);
    }

    public void cancel() {
        if (this.state == null) init();
        this.state.cancel(this);
    }

    private String preferenceId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}
