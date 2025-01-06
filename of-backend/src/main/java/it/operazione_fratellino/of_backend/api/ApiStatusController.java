package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.StatusDTO;
import it.operazione_fratellino.of_backend.services.StatusService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.StatusConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Log
@RequestMapping("/api/status")
public class ApiStatusController {
    @Autowired
    private StatusService statusService;
    @Autowired
    private StatusConverter statusConverter;

    @GetMapping("/all")
    public PaginateResponse<StatusDTO> getAllStatus(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, statusService::findAll, statusConverter::toDTO);
    }


}
