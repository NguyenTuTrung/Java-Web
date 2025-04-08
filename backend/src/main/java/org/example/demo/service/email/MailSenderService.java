package org.example.demo.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.entity.order.core.Order;
import org.example.demo.util.order.OrderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MailSenderService {
    @Autowired
    private JavaMailSender mailSender;
    // dejava san =))
    public void sendNewMail(String to, String subject, Order order, String note) throws MessagingException {
        String htmlBody = """
                <table align="center" style="width: 600px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding: 40px 20px; background-color: #333333; color: #ffffff; font-size: 24px; font-weight: bold; border-top-left-radius: 10px; border-top-right-radius: 10px; letter-spacing: 1px;">
                            CANTCH - Thông báo trạng thái đơn hàng
                        </td>
                    </tr>
                    <!-- Order Information -->
                    <tr>
                        <td style="padding: 20px; background-color: #f8f8f8; color: #333; font-size: 16px; line-height: 1.5;">
                            <div style="margin-bottom: 25px;">
                                <strong style="font-size: 18px;">Mã đơn hàng:</strong>
                                <span style="color: #000; font-weight: 600;">%s</span>
                            </div>
                            <div style="margin-bottom: 25px;">
                                <strong style="font-size: 18px;">Trạng thái:</strong>
                                <span style="color: #007BFF; font-weight: 600;">%s</span>
                            </div>
                            <div style="margin-bottom: 25px;">
                                <strong style="font-size: 18px;">Ghi chú:</strong>
                                <span style="color: #000; font-weight: 600;">%s</span>
                            </div>
                            <div style="font-size: 14px; color: #777; margin-top: 30px;">
                                <p style="margin: 0;">Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!</p>
                                <p style="margin: 0;">Mọi thắc mắc xin vui lòng liên hệ: <a href="mailto:support@cantch.com" style="color: #007BFF; text-decoration: none;">support@cantch.com</a></p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding: 20px 20px; background-color: #333333; color: #ffffff; font-size: 12px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                            <p style="margin: 0;">&copy; 2024 CANTCH. All Rights Reserved.</p>
                        </td>
                    </tr>
                </table>
                """.formatted(order.getCode(), OrderUtil.getNameOfStatus(order.getStatus()), note);

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        try{
            mailSender.send(mimeMessage);
        }
        catch (Exception ex){
            log.error("Gủi email thất bại" + ex.getMessage());
        }
    }


    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}