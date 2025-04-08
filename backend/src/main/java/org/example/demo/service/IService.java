package org.example.demo.service;

import org.apache.coyote.BadRequestException;

/**
 * The type Staff response dto.
 *
 * @param <E>  Entity
 * @param <ID> Kiểu dữ liệu ID của Entity
 * @param <RQ> Đối tượng requestDTO
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 **/
public interface IService<E, ID, RQ> {
    E findById(ID id) throws BadRequestException;

    E delete(ID id) throws BadRequestException;

    E save(RQ requestDTO) throws BadRequestException;

    E update(ID id, RQ requestDTO)  throws BadRequestException;


}
