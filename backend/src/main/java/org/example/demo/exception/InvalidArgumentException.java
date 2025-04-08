package org.example.demo.exception;

import lombok.Getter;


@Getter
public class InvalidArgumentException extends RuntimeException {
    private String argumentValue;
    private String argumentName;

    public InvalidArgumentException(String message) {
        super(message);
    }

    public InvalidArgumentException(String message, String argumentValue, String argumentName) {
        super(message);
        this.argumentName = argumentName;
        this.argumentValue = argumentValue;
    }

}
