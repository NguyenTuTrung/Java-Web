package org.example.demo.controller;

import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
public interface IControllerBasic<ID, RQ> {
    ResponseEntity<?> create(RQ rq) throws BadRequestException;

    @PutMapping(value = {"{id}"})
    ResponseEntity<?> update(@PathVariable ID id, RQ rq);

    ResponseEntity<?> delete(ID id) throws BadRequestException;

    ResponseEntity<?> detail(ID id) throws BadRequestException;
}
