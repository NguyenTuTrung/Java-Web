package org.example.demo.service.email;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;

@Service
public class EmailService {
    private JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Autowired
    private TemplateEngine templateEngine;

    public void send(String from, List<String> to, String subject, String text) {

        SimpleMailMessage message = new SimpleMailMessage();
        String[] recievers = new String[to.size()];

        for (int i = 0; i < to.size(); i++) {
            recievers[i] = to.get(i);
        }
        message.setFrom(from);
        message.setTo(recievers);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendHtmlEmail(String from, String to, String subject, String templateName, Context context) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Render template HTML
        String htmlContent = templateEngine.process(templateName, context);

        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // Đặt nội dung là HTML

        mailSender.send(message);
    }


    public void sendWithAttach(String from, String to, String subject, String text, String attachName,
                               InputStreamSource inputStream) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
        helper.addAttachment(attachName, inputStream);
        mailSender.send(message);
    }

    public void sendVerificationCode(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã Xác Nhận Đặt Lại Mật Khẩu");
        message.setText("Mã xác nhận của bạn là: " + verificationCode +
                "\nMã này sẽ hết hạn sau 15 phút.");
        mailSender.send(message);
    }

}