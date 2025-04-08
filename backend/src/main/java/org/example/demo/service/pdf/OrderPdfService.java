package org.example.demo.service.pdf;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.util.CurrencyFormat;
import org.example.demo.util.caculate.CalculateUtil;
import org.example.demo.util.number.NumberUtil;
import org.example.demo.util.qr.QRUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class OrderPdfService {
    @Autowired
    private OrderRepository orderRepository;


    public ByteArrayOutputStream export(Integer idOrder){
        Order order = orderRepository.findById(idOrder).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy hóa đơn này"));

        if(order.getType() == Type.INSTORE){
            return exportPdfOffline(idOrder);
        }
        else{
            return exportPdfOnline(idOrder);
        }
    }

    private String getNameOfCustomer(Order order){
        if (order.getRecipientName() != null){
            return order.getRecipientName();
        }
        else {
            return "Khách lẻ";
        }
    }

    public ByteArrayOutputStream exportPdfOffline(Integer idOrder) {
        try {
            Order order = orderRepository.findById(idOrder).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy hóa đơn này"));
            String recipientName = getNameOfCustomer(order);
            String phone = order.getPhone();
            String orderCode = order.getCode();


            PDDocument document = new PDDocument();
            PDPage firstPage = new PDPage(PDRectangle.A4);
            document.addPage(firstPage);


            String name = "FPolytechnic";
            String callNo = "+84833486999";

            Format d_format = new SimpleDateFormat("dd/MM/yyyy");
            Format t_format = new SimpleDateFormat("HH:mm");

            int pageWidth = (int) firstPage.getTrimBox().getWidth();
            int pageHeight = (int) firstPage.getTrimBox().getHeight();

            PDPageContentStream contentStream = new PDPageContentStream(document, firstPage);
            MyTextClass myTextClass = new MyTextClass(document, contentStream);

//            PDFont font = PDType1Font.HELVETICA;
            PDFont italicFont = PDType1Font.HELVETICA_OBLIQUE;
            PDFont helveticaBold = PDType1Font.HELVETICA_BOLD;
            ClassLoader classLoader = OrderPdfService.class.getClassLoader();

            InputStream fontStream = classLoader.getResourceAsStream("dejavu-sans/ttf/DejaVuSans.ttf");
            InputStream timeBoldStream = classLoader.getResourceAsStream("dejavu-sans/ttf/DejaVuSans-Bold.ttf");
            InputStream condensedBoldStream = classLoader.getResourceAsStream("dejavu-sans/ttf/DejaVuSans-BoldOblique.ttf");

            PDFont font = PDType0Font.load(document, fontStream);
            PDFont timeBold = PDType0Font.load(document, timeBoldStream);
            PDFont condensedBold = PDType0Font.load(document, condensedBoldStream);

//            PDImageXObject headImage = PDImageXObject.createFromFile("src/main/resources/image/header.png", document);
//            contentStream.drawImage(headImage, 0, pageHeight - 235, pageWidth, 239);

//            String[] contactDetails = new String[]{"+84 833486946", "+84 833486946"};
//            myTextClass.addMultiLineText(
//                    contactDetails,
//                    18,
//                    (int) (pageWidth - font.getStringWidth(contactDetails[0]) / 1000 * 15 - 10),
//                    pageHeight - 25,
//                    font,
//                    15,
//                    Color.BLACK
//            );

            BufferedImage bufferedImageQR = QRUtil.generateQRCodeWithoutBorder(orderCode, 100, 100);
            PDImageXObject qrCodeImage = LosslessFactory.createFromImage(document, bufferedImageQR);


            myTextClass.addSingleLineText("CANTH", 25, pageHeight - 70, font, 40, Color.BLACK);
            contentStream.drawImage(qrCodeImage, pageWidth - 100, pageHeight - 130, 100, 100);
            //
            myTextClass.addSingleLineText("Email: canth@gmail.com", 25, pageHeight - 95, font, 11, Color.BLACK);
            myTextClass.addSingleLineText("So dien thoại: 0123456789", 25, pageHeight - 110, font, 11, Color.BLACK);
            myTextClass.addSingleLineText("Địa chỉ: FPT POLYTECHNIC, Kieu mai", 25, pageHeight - 125, font, 11, Color.BLACK);
            //

            //
            String textHeader = "HÓA ĐƠN BÁN HÀNG";
            float textHeaderWidth = myTextClass.getTextWidth(textHeader, condensedBold, 20);
            myTextClass.addSingleLineText(textHeader, (int) ((pageWidth / 2) - (textHeaderWidth / 2)) + 12, pageHeight - 165, font, 20, Color.BLACK);
            //


            //
            myTextClass.addSingleLineText("Khách hàng: " + recipientName, 25, pageHeight - 205, font, 14, Color.BLACK);
            myTextClass.addSingleLineText("No: " + idOrder, 25, pageHeight - 220, font, 14, Color.BLACK);
            //
            //
            String invoiceNo = "#" + orderCode;
            float textWidth = myTextClass.getTextWidth(invoiceNo, font, 14);
            myTextClass.addSingleLineText(invoiceNo, (int) (pageWidth - 25 - textWidth), pageHeight - 205, font, 14, Color.BLACK);

            float dateTextWidth = myTextClass.getTextWidth(
                    "Date: " + d_format.format(new Date()),
                    font,
                    14
            );
            myTextClass.addSingleLineText("Ngày: " + d_format.format(new Date()), (int) (pageWidth - 25 - dateTextWidth), pageHeight - 220, font, 14, Color.BLACK);
            //
            String time = t_format.format(new Date());
            String timeText = "Lúc: " + time;
            float timeTextWidth = myTextClass.getTextWidth(timeText, font, 14);
            myTextClass.addSingleLineText(timeText, (int) (pageWidth - 25 - timeTextWidth), pageHeight - 235, font, 14, Color.BLACK);


            //
            String textHeaderTable = "DANH SÁCH SẢN PHẨM";
            float textHeaderTableWidth = myTextClass.getTextWidth(textHeaderTable, condensedBold, 16);
            myTextClass.addSingleLineText(textHeaderTable, (int) ((pageWidth / 2) - (textHeaderTableWidth / 2)) + 12, pageHeight - 255, font, 16, Color.BLACK);
            //


            MyTableClass myTable = new MyTableClass(document, contentStream);
            int[] cellWidths = {30, 180, 60, 40, 40, 100, 110};
            myTable.setTable(cellWidths, 30, 25, pageHeight - 320);
            myTable.setTableFont(font, 12, Color.BLACK);

            Color tableHeadColor = new Color(122, 122, 122);
            Color tableBodyColor = new Color(219, 218, 198);

            myTable.addCell("#", tableHeadColor);
            myTable.addCell("Sản phẩm", tableHeadColor);
            myTable.addCell("Màu", tableHeadColor);
            myTable.addCell("Size", tableHeadColor);
            myTable.addCell("SL", tableHeadColor);
            myTable.addCell("Giá", tableHeadColor);
            myTable.addCell("Thành tiền", tableHeadColor);


            List<OrderDetail> orderDetailList = order.getOrderDetails().stream().filter(s -> !s.getDeleted()).toList();
            for (int i = 0; i < orderDetailList.size(); i++) {
                OrderDetail s = orderDetailList.get(i);
                String productName = s.getProductDetail().getProduct().getName();
                String quantity = s.getQuantity().toString();

                double productDetailPrice = s.getProductDetail().getPrice();
                // lấy ra phần trăm giảm giá của sự kiện lúc tạo hóa đơn chờ tại thời điểm đó
                double averageEventPercent = s.getAverageDiscountEventPercent();
                double currentPrice = s.getUnitPrice();

                String price = CurrencyFormat.format(currentPrice) + " VND";
                String subTotal = CurrencyFormat.format(currentPrice * s.getQuantity()) + " VND";
                String color = s.getProductDetail().getColor().getName();
                String size = s.getProductDetail().getSize().getName();

                myTable.addCell(String.valueOf(i + 1), tableBodyColor);
                myTable.addCell(productName, tableBodyColor);
                myTable.addCell(color, tableBodyColor);
                myTable.addCell(size, tableBodyColor);
                myTable.addCell(quantity, tableBodyColor);
                myTable.addCell(price, tableBodyColor);
                myTable.addCell(subTotal, tableBodyColor);
            }
            log.info("PAGE HEIGHT: " + pageHeight);
            log.info("PAGE WIDTH: " + pageWidth);
            myTextClass.addSingleLineText("Tổng tiền: ", 25, pageHeight - 650, font, 14, Color.BLACK);
            myTextClass.addSingleLineText(CurrencyFormat.format(order.getSubTotal()) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 650, helveticaBold, 14, Color.BLACK);

            myTextClass.addSingleLineText("Phí vận chuyển: ", 25, pageHeight - 670, font, 14, Color.BLACK);
            myTextClass.addSingleLineText(CurrencyFormat.format(order.getDeliveryFee()) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 670, helveticaBold, 14, Color.BLACK);

            myTextClass.addSingleLineText("Giảm giá: ", 25, pageHeight - 690, font, 14, Color.BLACK);
            myTextClass.addSingleLineText(CurrencyFormat.format(order.getDiscount()) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 690, helveticaBold, 14, Color.BLACK);

            myTextClass.addSingleLineText("Tổng thanh toán: ", 25, pageHeight - 710, font, 14, Color.BLACK);
            myTextClass.addSingleLineText(CurrencyFormat.format(order.getSubTotal() - order.getDiscount() + order.getDeliveryFee()) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 710, helveticaBold, 14, Color.BLACK);

            myTextClass.addSingleLineText("Đã thanh toán: ", 25, pageHeight - 740, font, 14, Color.BLACK);
            myTextClass.addSingleLineText(CurrencyFormat.format(order.getTotalPaid()) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 740, helveticaBold, 14, Color.BLACK);

//            myTextClass.addSingleLineText("Tổng thanh toán: ", 25, pageHeight - 760, font, 14, Color.BLACK);
//            myTextClass.addSingleLineText(CurrencyFormat.format(order.getTotal()) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 760, helveticaBold, 14, Color.BLACK);
//
//            myTextClass.addSingleLineText("(Phụ phí): ", 25, pageHeight - 780, font, 14, Color.BLACK);
//            myTextClass.addSingleLineText(CurrencyFormat.format(CalculateUtil.getSurcharge(order)) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 780, helveticaBold, 14, Color.BLACK);
//
//            myTextClass.addSingleLineText("(Hoàn trả): ", 25, pageHeight - 800, font, 14, Color.BLACK);
//            myTextClass.addSingleLineText(CurrencyFormat.format(CalculateUtil.getRefund(order)) + " VND", (int) (pageWidth - 25 - textWidth), pageHeight - 800, helveticaBold, 14, Color.BLACK);

            Color bottomRectColor = new Color(122, 122, 122);
            contentStream.setNonStrokingColor(bottomRectColor);
            contentStream.addRect(0, 0, pageWidth, 30);
            contentStream.fill();


            contentStream.close();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            document.close();
            System.out.println("PDF CREATED");
            return outputStream;


        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }

    }

    public ByteArrayOutputStream exportPdfOnline(Integer idOrder) {
        try {
            Order order = orderRepository.findById(idOrder).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy hóa đơn này"));
            String recipientName = order.getRecipientName();
            String phone = order.getPhone();
            String orderCode = order.getCode();

            PDDocument document = new PDDocument();
            PDPage firstPage = new PDPage(PDRectangle.A4);
            document.addPage(firstPage);

            Format d_format = new SimpleDateFormat("dd/MM/yyyy");
            Format t_format = new SimpleDateFormat("HH:mm");

            int pageWidth = (int) firstPage.getTrimBox().getWidth();
            int pageHeight = (int) firstPage.getTrimBox().getHeight();

            PDPageContentStream contentStream = new PDPageContentStream(document, firstPage);
            MyTextClass myTextClass = new MyTextClass(document, contentStream);

            PDFont italicFont = PDType1Font.HELVETICA_OBLIQUE;
            PDFont helveticaBold = PDType1Font.HELVETICA_BOLD;

            ClassLoader classLoader = OrderPdfService.class.getClassLoader();

            InputStream fontStream = classLoader.getResourceAsStream("dejavu-sans/ttf/DejaVuSans.ttf");
            InputStream timeBoldStream = classLoader.getResourceAsStream("dejavu-sans/ttf/DejaVuSans-Bold.ttf");
            InputStream condensedBoldStream = classLoader.getResourceAsStream("dejavu-sans/ttf/DejaVuSans-BoldOblique.ttf");

            PDFont font = PDType0Font.load(document, fontStream);
            PDFont timeBold = PDType0Font.load(document, timeBoldStream);
            PDFont condensedBold = PDType0Font.load(document, condensedBoldStream);

            Color bottomRectColor = new Color(122, 122, 122);
            BufferedImage bufferedImageQR = QRUtil.generateQRCodeWithoutBorder(orderCode, 100, 100);
//            PDImageXObject headImage = PDImageXObject.createFromFile("src/main/resources/image/ghn.png", document);
            PDImageXObject qrCodeImage = LosslessFactory.createFromImage(document, bufferedImageQR);

            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("image/ghn.png");
            PDImageXObject headImage = PDImageXObject.createFromByteArray(document, inputStream.readAllBytes(), "ghn");



            myTextClass.addSingleLineText("CADTH", 25, pageHeight - 70, font, 40, Color.BLACK);
            contentStream.drawImage(headImage, 25, pageHeight - 125, 140, 45);

            contentStream.drawImage(qrCodeImage, pageWidth - 100, pageHeight - 130, 100, 100);

            String fromAddress = "FPT POLYTECHNIC Kieu Mai, Phúc Diễn, Từ Liêm, Hà Nội";
            myTextClass.addSingleLineText("Từ: " + fromAddress, 25, pageHeight - 205, font, 12, Color.BLACK);

            String fromPhone = "0833486527";
            myTextClass.addSingleLineText("Sdt: " + fromPhone, 25, pageHeight - 220, font, 12, Color.BLACK);

            contentStream.setNonStrokingColor(bottomRectColor);
            contentStream.addRect(25, pageHeight - 240, pageWidth, 2);
            contentStream.fill();


            String toAddress = String.format("%s, %s , %s, %s", order.getAddress(), order.getWardName(), order.getDistrictName(), order.getProvinceName());
            myTextClass.addSingleLineText("Đến: " + toAddress, 25, pageHeight - 260, font, 12, Color.BLACK);

            String receiveName = order.getRecipientName();
            myTextClass.addSingleLineText("Tên: " + receiveName, 25, pageHeight - 275, font, 12, Color.BLACK);

            String receivePhone = order.getPhone();
            myTextClass.addSingleLineText("Sdt: " + receivePhone, 25, pageHeight - 290, font, 12, Color.BLACK);

            contentStream.setNonStrokingColor(bottomRectColor);
            contentStream.addRect(25, pageHeight - 310, pageWidth, 2);
            contentStream.fill();

            myTextClass.addSingleLineText("Nội dung hàng (Tổng SL sản phẩm: %s): ".formatted(order.getOrderDetails().size()), 25, pageHeight - 330, font, 12, Color.BLACK);


            AtomicInteger availableHeight = new AtomicInteger(pageHeight - 330 - 20);

            order.getOrderDetails().forEach(s -> {
                try {
                    ProductDetail productDetail = s.getProductDetail();
                    String nameProduct = productDetail.getProduct().getName();
                    String colorProduct = productDetail.getColor().getName();
                    String sizeProduct = productDetail.getSize().getName();
                    String quantity = s.getQuantity().toString();
                    String text = "+ " + nameProduct + " " + colorProduct + " [" + sizeProduct + "]" + "      SL: " + quantity;

                    availableHeight.addAndGet(-15); // Increment the height by 15
                    myTextClass.addSingleLineText(text, 25, availableHeight.get(), font, 12, Color.BLACK);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });

            contentStream.setNonStrokingColor(bottomRectColor);
            contentStream.addRect(25, availableHeight.addAndGet(-15), pageWidth, 2);
            contentStream.fill();


            int yConfirm = availableHeight.addAndGet(-20);
            myTextClass.addSingleLineText("Tông thu người nhận: " , 25, yConfirm, font, 12, Color.BLACK);
            int yConfirmNote = availableHeight.addAndGet(-15);

            myTextClass.addSingleLineText(CurrencyFormat.format(order.getTotal()) + " VND" , 25,  yConfirmNote, helveticaBold, 12, Color.BLACK);


            String confirmText = "Chữ ký người nhận";
            float confirmTextWidth = myTextClass.getTextWidth(confirmText, font, 12);
            myTextClass.addSingleLineText(confirmText , (int)(pageWidth - 25 - confirmTextWidth), yConfirm, font, 12, Color.BLACK);


            String confirmTextNote = "(Xác nhận hàng nguyên vẹn)";
            float confirmTextNoteWidth = myTextClass.getTextWidth(confirmTextNote, font, 12);
            myTextClass.addSingleLineText(confirmTextNote , (int)(pageWidth - 25 - confirmTextNoteWidth), yConfirmNote, font, 12, Color.BLACK);


            contentStream.close();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            document.close();
            System.out.println("PDF CREATED");
            return outputStream;


        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }

    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class MyTextClass {
        PDDocument document;
        PDPageContentStream contentStream;

        void addSingleLineText(
                String text,
                int xPosition,
                int yPosition,
                PDFont font,
                float fontSize,
                Color color
        ) throws IOException {
            contentStream.beginText();
            contentStream.setFont(font, fontSize);
            contentStream.setNonStrokingColor(color);
            contentStream.newLineAtOffset(xPosition, yPosition);
            contentStream.showText(text);
            contentStream.endText();
            contentStream.moveTo(0, 0);
        }

        void addMultiLineText(
                String[] textArray,
                float leading,
                int xPosition,
                int yPosition,
                PDFont font,
                float fontSize,
                Color color
        ) throws IOException {
            contentStream.beginText();
            contentStream.setFont(font, fontSize);
            contentStream.setNonStrokingColor(color);
            contentStream.setLeading(leading);
            contentStream.newLineAtOffset(xPosition, yPosition);
            for (String text : textArray) {
                contentStream.showText(text);
                contentStream.newLine();
            }
            contentStream.endText();
            contentStream.moveTo(0, 0);
        }

        float getTextWidth(String text, PDFont font, float fontSize) throws IOException {
            return font.getStringWidth(text) / 1000 * fontSize;
        }

    }


    public static class MyTableClass {
        PDDocument document;
        PDPageContentStream contentStream;
        private int[] colWidths;
        private int cellHeight;
        private int yPosition;
        private int xPosition;
        private int colPosition = 0;
        private int xInitialPosition;
        private float fontSize;
        private PDFont font;
        private Color fontColor;

        public MyTableClass(PDDocument document, PDPageContentStream contentStream) {
            this.document = document;
            this.contentStream = contentStream;
        }

        void setTable(int[] colWidths, int cellHeight, int xPosition, int yPosition) {
            this.colWidths = colWidths;
            this.cellHeight = cellHeight;
            this.xPosition = xPosition;
            this.yPosition = yPosition;
            xInitialPosition = xPosition;
        }

        void setTableFont(PDFont font, float fontSize, Color fontColor) {
            this.font = font;
            this.fontSize = fontSize;
            this.fontColor = fontColor;
        }

        void addCell(String text, Color fillColor) throws IOException {
            if (fillColor != null) {
                contentStream.setNonStrokingColor(fillColor);
            }
            contentStream.addRect(xPosition, yPosition, colWidths[colPosition], cellHeight);
            if (fillColor == null) {
                contentStream.stroke();
            } else {
                contentStream.fillAndStroke();
            }
            contentStream.beginText();
            contentStream.setFont(font, this.fontSize);
            contentStream.setNonStrokingColor(fontColor);

            if (colPosition == 4 || colPosition == 2) {
                float fontWidth = font.getStringWidth(text) / 1000 * fontSize;
                contentStream.newLineAtOffset(xPosition + colWidths[colPosition] - 5 - fontWidth, yPosition + 10);
            } else {
                contentStream.newLineAtOffset(xPosition + 5, yPosition + 10);
            }
            contentStream.showText(text);
            contentStream.endText();

            xPosition = xPosition + colWidths[colPosition];
            colPosition++;

            if (colPosition == colWidths.length) {
                colPosition = 0;
                xPosition = xInitialPosition;
                yPosition -= cellHeight;
            }
        }
    }
}
