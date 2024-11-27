package it.operazione_fratellino.of_backend.components;


import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;


import java.sql.SQLException;

@Component
public class ExceptionHandlerService {

    public ResponseEntity<String> handleException(Exception e, String entityName) {
        String errorMessage;

        if (e instanceof DataIntegrityViolationException) {
            errorMessage = "Errore: L'entità: '" + entityName + "' è già presente nel database.";
        } else if (e instanceof ConstraintViolationException) {
            errorMessage = "Errore: Violazione dei requisiti di validazione per i campi.";
        } else if (e instanceof OptimisticLockException) {
            errorMessage = "Errore: Conflitto di versione durante l'aggiornamento dell'entità.";
        } else if (e instanceof EntityNotFoundException) {
            errorMessage = "Errore: L'entità non è stata trovata.";
        } else if (e instanceof SQLException) {
            errorMessage = "Errore del database.";
        } else {
            errorMessage = "Errore nel salvataggio dell'entità: $" + e.getLocalizedMessage() + "$";
        }

        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
}
