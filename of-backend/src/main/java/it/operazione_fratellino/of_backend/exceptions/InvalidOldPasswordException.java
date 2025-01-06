package it.operazione_fratellino.of_backend.exceptions;

public class InvalidOldPasswordException extends RuntimeException{

    public InvalidOldPasswordException(String message) {
        super(message);
    }
}
