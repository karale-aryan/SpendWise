package com.spendwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for SpendWise.
 * Production-ready expense tracking application built with Spring Boot.
 *
 * @author SpendWise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class SpendWiseApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpendWiseApplication.class, args);
    }

}
