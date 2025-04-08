package org.example.demo.exception;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.coyote.BadRequestException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@ControllerAdvice
public class GlobalExceptionHandler {
    @Autowired
    private MessageSource messageSource;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class CustomErrors {
        @JsonProperty(value = "statusCode")
        HttpStatus httpStatus;
        @JsonProperty(value = "errors")
        private Map<String, String> errors;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class CustomError {
        @JsonProperty(value = "statusCode")
        HttpStatus httpStatus;
        @JsonProperty(value = "error")
        private String error;
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = messageSource.getMessage("typeMismatch", new Object[]{ex.getName()}, LocaleContextHolder.getLocale());
        CustomError customError = new CustomError();
        customError.setHttpStatus(HttpStatus.BAD_REQUEST);
        customError.setError(message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(customError);
    }

    @ExceptionHandler({BindException.class})
    public ResponseEntity<?> handleBindException(BindException ex) {
        Map<String, String> mapErrors = new HashMap<>();
        List<FieldError> listError = ex.getFieldErrors();
        listError.forEach(s -> {
            String code = s.getCode();
            System.out.println("CODE: " + s.getCode());
            System.out.println(s.getDefaultMessage());
            if (code != null) {
                if (code.equals("typeMismatch")) {
                    String message = messageSource.getMessage(code, new Object[]{}, LocaleContextHolder.getLocale());
                    mapErrors.put(s.getField(), message);

                } else {
                    String message = messageSource.getMessage(s.getDefaultMessage(), new Object[]{}, LocaleContextHolder.getLocale());
                    mapErrors.put(s.getField(), message);
                }
            }


        });
        CustomErrors error = new CustomErrors(HttpStatus.BAD_REQUEST, mapErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler({BadRequestException.class})
    public ResponseEntity<?> handleBadRequestsException(BadRequestException ex) {
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler({CustomExceptions.CustomBadRequest.class})
    public ResponseEntity<?> handleCustomBadRequestException(CustomExceptions.CustomBadRequest ex) {
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler({CustomExceptions.GHNException.class})
    public ResponseEntity<?> handleGHNException(CustomExceptions.GHNException ex) {
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler({CustomExceptions.CustomThrowMessage.class})
    public ResponseEntity<?> handleCustomThrowMessageException(CustomExceptions.CustomThrowMessage ex) {
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler({SQLIntegrityConstraintViolationException.class})
    public ResponseEntity<?> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException ex) {
        String fieldName = extractDuplicateFieldName(ex.getMessage());
        String message = messageSource.getMessage("SQLIntegrityConstraintViolationException", new Object[]{fieldName}, LocaleContextHolder.getLocale());
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler({DataIntegrityViolationException.class})
    public ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {

        String message = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }


    private String extractDuplicateFieldName(String errorMessage) {
        String fieldName = "";
        String[] parts = errorMessage.split("for key ")[1].split("\\.");
        if (parts.length > 1) {
            fieldName = parts[1].replace("'", "").trim();
        }
        return fieldName;
    }

    @ExceptionHandler(InvalidArgumentException.class)
    public ResponseEntity<?> handleMethodArgumentTypeMismatch(InvalidArgumentException ex) {
        String message = messageSource.getMessage("InvalidArgumentException", new Object[]{ex.getArgumentValue(), ex.getArgumentName()}, LocaleContextHolder.getLocale());
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, message);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class})
    public ResponseEntity<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        String message = messageSource.getMessage("HttpMessageNotReadableException", new Object[]{}, LocaleContextHolder.getLocale());
        CustomError error = new CustomError(HttpStatus.BAD_REQUEST, message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler({CustomExceptions.CustomBadSecurity.class})
    public ResponseEntity<?> handleCustomBadSecurityException(CustomExceptions.CustomBadSecurity ex) {
        CustomError error = new CustomError(HttpStatus.FORBIDDEN, ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
}
