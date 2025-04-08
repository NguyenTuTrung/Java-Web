package org.example.demo.exception;

public class PermissionDenyException extends Exception{
    public PermissionDenyException(String message) {
        super(message);
    }
}