package com.portfolio.commerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@commerce.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "¡Bienvenido a Commerce!";
        String body = "Hola " + name + ",\n\nGracias por unirte a nuestra plataforma. ¡Esperamos que disfrutes tu experiencia!";
        sendEmail(to, subject, body);
    }

    public void sendOrderConfirmation(String to, Long orderId) {
        String subject = "Confirmación de Pedido #" + orderId;
        String body = "Tu pedido ha sido recibido correctamente y está siendo procesado.\n\nNúmero de pedido: " + orderId;
        sendEmail(to, subject, body);
    }
}
