package it.operazione_fratellino.of_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "logs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String message;

    @NonNull
    private String severity;

    @NonNull
    private Date createdAt;

    private String caller;

    public Log(@NonNull String message, @NonNull String severity, @NonNull Date createdAt, String caller) {
        this.message = message;
        this.severity = severity;
        this.createdAt = createdAt;
        this.caller = caller;
    }
}
