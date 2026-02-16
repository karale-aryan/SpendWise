package com.spendwise.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

/**
 * Configuration for WebClient used for external API calls.
 */
@Configuration
public class WebClientConfig {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    /**
     * Configure WebClient for OpenAI API calls.
     *
     * @return configured WebClient
     */
    @Bean
    public WebClient openAIWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.openai.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                .build();
    }

}
