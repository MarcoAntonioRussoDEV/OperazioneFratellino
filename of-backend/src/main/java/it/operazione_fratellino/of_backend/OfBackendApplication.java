package it.operazione_fratellino.of_backend;

import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class OfBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OfBackendApplication.class, args);
	}

}
