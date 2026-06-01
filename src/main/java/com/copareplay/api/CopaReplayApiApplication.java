package com.copareplay.api;

import com.copareplay.api.repository.WorldCupRepository;
import com.copareplay.api.service.AdminService;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CopaReplayApiApplication {

    private static final Logger logger = LoggerFactory.getLogger(CopaReplayApiApplication.class);

    public static void main(String[] args) {
        configureRenderDatabaseUrl();
        SpringApplication.run(CopaReplayApiApplication.class, args);
    }

    @Bean
    ApplicationRunner seedHistoricWorldCups(
            WorldCupRepository worldCupRepository,
            AdminService adminService,
            @Value("${app.seed-historic-world-cups:true}") boolean enabled
    ) {
        return args -> {
            if (!enabled || worldCupRepository.count() > 0) {
                return;
            }

            try {
                logger.info("No historic World Cups found. Importing OpenFootball seed data.");
                adminService.seed();
                logger.info("Historic World Cups imported successfully.");
            } catch (RuntimeException ex) {
                logger.warn("Could not import historic World Cups automatically: {}", ex.getMessage());
            }
        };
    }

    private static void configureRenderDatabaseUrl() {
        String renderDatabaseUrl = System.getenv("DATABASE_URL");
        String explicitDatasourceUrl = System.getenv("SPRING_DATASOURCE_URL");

        if (explicitDatasourceUrl != null || renderDatabaseUrl == null || renderDatabaseUrl.isBlank()) {
            return;
        }

        try {
            URI uri = URI.create(renderDatabaseUrl);
            if (!"postgresql".equals(uri.getScheme()) && !"postgres".equals(uri.getScheme())) {
                return;
            }

            String[] credentials = (uri.getUserInfo() == null ? "" : uri.getUserInfo()).split(":", 2);
            String username = credentials.length > 0 ? decode(credentials[0]) : "";
            String password = credentials.length > 1 ? decode(credentials[1]) : "";
            int port = uri.getPort() == -1 ? 5432 : uri.getPort();
            String query = uri.getQuery() == null ? "" : "?" + uri.getQuery();
            String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath() + query;

            System.setProperty("spring.datasource.url", jdbcUrl);
            if (!username.isBlank()) {
                System.setProperty("spring.datasource.username", username);
            }
            if (!password.isBlank()) {
                System.setProperty("spring.datasource.password", password);
            }
        } catch (IllegalArgumentException ignored) {
            // Keep local fallback values from application.properties if Render's URL is malformed.
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
