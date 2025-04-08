package org.example.demo.service.staff;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * The interface IService1.
 * Giao diện này định nghĩa các phương thức cơ bản cho một dịch vụ quản lý thực thể (entity).
 *
 * @param <E>  Loại thực thể
 * @param <ID> Loại ID của thực thể
 * @param <RQ> Loại DTO yêu cầu
 */
public interface IService1<E, ID, RQ> {

    /**
     * Tìm tất cả các thực thể (entities) với phân trang và các điều kiện tìm kiếm.
     *
     * @param code     Mã của thực thể
     * @param name     Tên của thực thể
     * @param fromDate Ngày bắt đầu
     * @param toDate   Ngày kết thúc
     * @param pageable Thông tin phân trang
     * @return Trang kết quả của thực thể dưới dạng DTO
     */
//    Page<StaffResponseDTO> findAllByPage(
//            String code,
//            String name,
//            LocalDate fromDate,
//            LocalDate toDate,
//            Pageable pageable);

    Page<StaffResponseDTO> findAllByPage(
//            Integer id,
            String code,
            String name,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Pageable pageable);

    /**
     * Tìm thực thể theo ID.
     *
     * @param id ID của thực thể
     * @return Thực thể tìm thấy
     * @throws BadRequestException Nếu yêu cầu không hợp lệ
     */
    E findById(ID id) throws BadRequestException;

    /**
     * Xóa thực thể theo ID (có thể là đánh dấu đã xóa hoặc xóa vật lý).
     *
     * @param id ID của thực thể
     * @return Thực thể đã bị xóa (đã cập nhật trạng thái)
     * @throws BadRequestException Nếu yêu cầu không hợp lệ
     */
    E delete(ID id) throws BadRequestException;

    /**
     * Lưu một thực thể mới từ DTO yêu cầu.
     *
     * @param requestDTO DTO yêu cầu chứa thông tin của thực thể mới
     * @return Thực thể đã lưu
     * @throws BadRequestException Nếu yêu cầu không hợp lệ
     */
    E save(RQ requestDTO) throws BadRequestException;

    /**
     * Cập nhật thực thể theo ID từ DTO yêu cầu (có thể bắt buộc giao dịch).
     *
     * @param id         ID của thực thể cần cập nhật
     * @param requestDTO DTO yêu cầu chứa thông tin cập nhật
     * @return DTO phản hồi sau khi cập nhật
     */
    @Transactional
    StaffResponseDTO update(ID id, RQ requestDTO) throws BadRequestException;

    /**
     * Cập nhật trạng thái của thực thể theo ID (có thể bắt buộc giao dịch).
     *
     * @param id        ID của thực thể cần cập nhật trạng thái
     * @param newStatus Trạng thái mới cần được cập nhật
     * @return Thực thể đã được cập nhật trạng thái
     */
    @Transactional
    Staff updateStatus(Integer id, String newStatus);

    /**
     * Import data from an Excel file
     *
     * @param file the Excel file to import
     * @throws java.io.IOException if an I/O error occurs
     */
//    void importFromExcel(MultipartFile file) throws IOException;
    List<Map<String, String>> importFromExcel(MultipartFile file) throws IOException;
}