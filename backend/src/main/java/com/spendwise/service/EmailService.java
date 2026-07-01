package com.spendwise.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendBudgetAlert(String toEmail, String category, Double amount, Double limit, Double totalSpent) {
        if (toEmail == null || toEmail.isEmpty() || toEmail.contains("example.com")) {
            log.warn("Skipping email alert for invalid email: {}", toEmail);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SpendWise Alert: Budget Exceeded for " + category);
        message.setText(String.format("""
                Hello,

                This is an alert from SpendWise.

                You have exceeded your budget for category: %s

                Transaction Amount: ₹%s
                Total Spent this month: ₹%s
                Budget Limit: ₹%s

                Please review your expenses.

                Regards,
                SpendWise Team
                """, category, amount, totalSpent, limit));

        try {
            emailSender.send(message);
            log.info("Budget alert email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}", toEmail, e);
        }
    }
}
