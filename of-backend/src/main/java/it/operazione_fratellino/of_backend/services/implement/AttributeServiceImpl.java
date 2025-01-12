package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.repositories.AttributeRepository;
import it.operazione_fratellino.of_backend.services.AttributeService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Log
@Service
public class AttributeServiceImpl implements AttributeService {

    @Autowired
    AttributeRepository attributeRepository;
    @Autowired
    private ExceptionHandlerService exceptionHandlerService;
    @Autowired
    private LogServiceImpl logService;


    @Override
    public List<Attribute> findAll() {
        try {
            return attributeRepository.findAll();
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero dell'attributo paginato: " + e.getMessage(), SeverityEnum.ERROR, logService, "AttributeServiceImpl");
            throw new RuntimeException("Errore durante il recupero dell'attributo paginato", e);
        }
    }

    @Override
    public Page<Attribute> findAll(PageRequest pageRequest) {
        return attributeRepository.findAll(pageRequest);
    }

    @Override
    public Attribute findById(Integer id) {
        Optional<Attribute> attribute = attributeRepository.findById(id);
        if(attribute.isPresent()){
            return attribute.get();
        }

        throw new RuntimeException("Attribute not found");
    }

    @Override
    public Attribute findByName(String name) {
        Optional<Attribute> attribute = attributeRepository.findByName(name);
        if(attribute.isPresent()){
            return attribute.get();
        }

        throw new RuntimeException("Attribute not found");
    }

    @Override
    public ResponseEntity<String> save(Attribute attribute) {

        try {
            attributeRepository.save(attribute);
            log.info("LOG: Creata categoria: " + attribute.getName());
            return new ResponseEntity<String>("Attributo salvato con successo", HttpStatus.CREATED);
        }catch(Exception e){
            log.info("LOG: Errore creazione attributo: " + attribute.getName());
            return exceptionHandlerService.handleException( e, attribute.getName());
        }
    }

    @Override
    public Attribute saveAndGet(Attribute attribute) {
        Attribute savedAttribute = attributeRepository.save(attribute);
        return attributeRepository.findById(savedAttribute.getId()).orElseThrow(()->new RuntimeException("Attribute just saved not found"));
    }

}
