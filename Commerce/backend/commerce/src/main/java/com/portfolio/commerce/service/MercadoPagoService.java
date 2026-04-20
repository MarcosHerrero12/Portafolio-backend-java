package com.portfolio.commerce.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.repository.OrderRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MercadoPagoService {

    @Value("${mercadopago.access_token}")
    private String accessToken;

    private final OrderRepository orderRepository;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String createPreference(Order order) {
        try {
            PreferenceClient client = new PreferenceClient();

            List<PreferenceItemRequest> items = new ArrayList<>();
            
            // Creamos un ítem consolidado por el total del pedido
            // Opcionalmente podrías iterar order.getItems() para detalles desglosados
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(order.getId().toString())
                    .title("Compra en Commerce Marketplace - Pedido #" + order.getId())
                    .description("Pago de productos seleccionados")
                    .quantity(1)
                    .currencyId("ARS")
                    .unitPrice(order.getTotalAmount())
                    .build();
            
            items.add(itemRequest);

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5173/payment/success")
                    .pending("http://localhost:5173/payment/pending")
                    .failure("http://localhost:5173/payment/failure")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .notificationUrl("https://tusitio.com/api/payments/webhook") // Cambiar por tu URL real o túnel (ngrok)
                    .externalReference(order.getId().toString())
                    .build();

            Preference preference = client.create(preferenceRequest);
            
            // Guardamos el preferenceId en la orden
            order.setPreferenceId(preference.getId());
            orderRepository.save(order);

            return preference.getInitPoint();

        } catch (Exception e) {
            throw new RuntimeException("Error al crear preferencia de Mercado Pago: " + e.getMessage());
        }
    }
}
