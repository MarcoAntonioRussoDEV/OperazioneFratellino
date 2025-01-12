package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.entities.Log;
import it.operazione_fratellino.of_backend.services.LogService;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/logs")
public class ApiLogController {

    @Autowired
    private LogService logService;

    @GetMapping("/all")
    public PaginateResponse<Log> getAllLogs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, logService::findAll);
    }

}
