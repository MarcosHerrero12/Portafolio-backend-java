package com.portfolio.commerce.controller;

import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.repository.OrderRepository;
import com.portfolio.commerce.service.MercadoPagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final MercadoPagoService mercadoPagoService;
    private final OrderRepository orderRepository;

    @PostMapping("/create-preference/{orderId}")
    public ResponseEntity<Map<String, String>> createPreference(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        
        String initPoint = mercadoPagoService.createPreference(order);
        return ResponseEntity.ok(Map.of("initPoint", initPoint));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> receiveWebhook(@RequestBody Map<String, Object> payload, 
                                               @RequestParam(required = false) String topic,
                                               @RequestParam(required = false) String id) {
        
        // Aquí Mercado Pago envía notificaciones de cambios de estado.
        // Por ahora lo dejamos como log para que el usuario vea que llega la petición.
        System.out.println("Webhook recibido de Mercado Pago: " + payload);
        
        // Lógica típica:
        // 1. Si el payload contiene un ID de pago, consultar a MP por el estado.
        // 2. Si el estado es "approved", buscar la orden por external_reference y marcarla como PAID.
        
        return ResponseEntity.ok().build();
    }
}
