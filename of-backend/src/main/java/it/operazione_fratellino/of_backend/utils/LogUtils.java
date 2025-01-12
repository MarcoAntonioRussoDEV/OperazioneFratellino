package it.operazione_fratellino.of_backend.utils;

import it.operazione_fratellino.of_backend.services.LogService;
import lombok.extern.java.Log;
import org.fusesource.jansi.Ansi;
import org.fusesource.jansi.AnsiColors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Log
@Component
public class LogUtils {


    public static void log(String message, SeverityEnum severity, LogService logService, String caller) {
        logService.save(new it.operazione_fratellino.of_backend.entities.Log(message, severity.toString(),new Date(), caller ));
        switch (severity) {
            case INFO:
                log.info(Ansi.ansi().fg(Ansi.Color.BLUE.value()).a("###LOG---" + message).reset().toString());
                break;
            case WARNING:
                log.warning(Ansi.ansi().fg(Ansi.Color.YELLOW.value()).a("###WARNING---" + message).reset().toString());
                break;
            case ERROR:
                log.severe(Ansi.ansi().fg(Ansi.Color.MAGENTA.value()).a("###ERROR---" + message).reset().toString());
                break;
        }

    }
}

