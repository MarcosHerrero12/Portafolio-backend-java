package com.portfolio.commerce.config;

import com.portfolio.commerce.entity.*;
import com.portfolio.commerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users (Si no existen)
        if (userRepository.findByEmail("seller@demo.com").isEmpty()) {
            seedUsers();
        }

        // 2. Seed Products & Orders (FORZADO FINAL)
        if (true) {
            cleanCatalogAndOrders();
            seedCatalogAndFakeSales();
        }
    }

    private void seedUsers() {
        // Admin
        if (userRepository.findByEmail("admin@commerce.com").isEmpty()) {
            User admin = User.builder()
                    .name("Admin Principal")
                    .email("admin@commerce.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .sellerStatus(SellerStatus.NONE)
                    .build();
            userRepository.save(admin);
        }

        // Vendedor Demo (El protagonista de las analíticas)
        User seller = User.builder()
                .name("Marcos Herrero")
                .email("seller@demo.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.SELLER)
                .companyName("Marcos Tech Store")
                .taxId("20-12345678-9")
                .phoneNumber("1122334455")
                .address("Av. Principal 123, Buenos Aires")
                .sellerStatus(SellerStatus.APPROVED)
                .build();
        userRepository.save(seller);
        
        System.out.println("✅ Usuarios base creados con éxito.");
    }

    private void cleanCatalogAndOrders() {
        System.out.println("🧹 Limpiando catálogo para re-sincronización...");
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    private void seedCatalogAndFakeSales() {
        User seller = userRepository.findByEmail("seller@demo.com").orElseThrow();

        // Categorías
        Category tech = Category.builder().name("Tecnología").description("Equipos de alto rendimiento").build();
        Category lifestyle = Category.builder().name("Estilo de Vida").description("Ropa y accesorios").build();
        categoryRepository.saveAll(List.of(tech, lifestyle));

        // Productos
        Product p1 = Product.builder().name("Gaming Laptop").description("RTX 4080, 32GB RAM").price(new BigDecimal("2500.00")).stock(10).imageUrl("https://images.unsplash.com/photo-1603302576837-37561b2e2302").category(tech).seller(seller).build();
        Product p2 = Product.builder().name("Smartphone Pro").description("Cámara 108MP, OLED").price(new BigDecimal("999.00")).stock(20).imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9").category(tech).seller(seller).build();
        Product p3 = Product.builder().name("Cotton T-Shirt").description("100% Algodón Premium").price(new BigDecimal("25.00")).stock(50).imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab").category(lifestyle).seller(seller).build();
        Product p4 = Product.builder().name("Notebook").description("Cuero italiano, hojas premium").price(new BigDecimal("45.00")).stock(30).imageUrl("https://images.unsplash.com/photo-1517842645537-4d2482392757").category(lifestyle).seller(seller).build();
        
        productRepository.saveAll(List.of(p1, p2, p3, p4));

        // Generar ventas ficticias para que los gráficos luzcan increíbles
        createOrder(seller, p1, 1, LocalDateTime.now().minusDays(4));
        createOrder(seller, p2, 2, LocalDateTime.now().minusDays(3));
        createOrder(seller, p4, 5, LocalDateTime.now().minusDays(2));
        createOrder(seller, p1, 1, LocalDateTime.now().minusDays(1));
        createOrder(seller, p2, 3, LocalDateTime.now());

        System.out.println("🚀 Catálogo y ventas de prueba inyectadas correctamente.");
    }

    private void createOrder(User seller, Product product, int qty, LocalDateTime date) {
        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(qty));
        Order order = Order.builder()
                .user(seller)
                .totalAmount(total)
                .orderDate(date)
                .status("PAID")
                .build();
        orderRepository.save(order);

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(qty)
                .price(product.getPrice())
                .build();
        orderItemRepository.save(item);
    }
}
