package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.StatusDTO;
import it.operazione_fratellino.of_backend.entities.Status;
import it.operazione_fratellino.of_backend.services.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class StatusConverter {

    @Autowired
    StatusService statusService;

    public StatusDTO toDTO(Status status){
        StatusDTO dto = new StatusDTO();
        dto.setId(status.getId());
        dto.setValue(status.getValue());

        return  dto;
    }

    public Status toEntity(StatusDTO dto){
        return statusService.findByValue(dto.getValue());
    }

}
