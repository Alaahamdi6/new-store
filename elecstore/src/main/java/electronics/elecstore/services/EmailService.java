package electronics.elecstore.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    
    @Autowired
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }
    
    public void sendOrderStatusEmail(String toEmail, Long orderId, String newStatus) {
        try {
            // Prepare the evaluation context
            Context context = new Context();
            context.setVariable("orderId", orderId);
            context.setVariable("newStatus", newStatus);
            
            // Process the template
            String htmlContent = templateEngine.process("order-status-email", context);
            
            // Prepare the email
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Order #" + orderId + " Status Update");
            helper.setText(htmlContent, true);
            helper.setFrom("eyabouaziz4@gmail.com");
            
            // Send the email
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}