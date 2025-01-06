package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.CityDTO;
import it.operazione_fratellino.of_backend.entities.City;
import it.operazione_fratellino.of_backend.services.CityService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.CityConverter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class ApiCityControllerTest {

    @Mock
    private CityService cityService;

    @Mock
    private CityConverter cityConverter;

    @InjectMocks
    private ApiCityController apiCityController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindByName() {
        // Arrange
        CityDTO cityDTO = new CityDTO();
        cityDTO.setName("Test City");

        when(cityService.findByName(anyString())).thenReturn(new City());
        when(cityConverter.toDTO(any())).thenReturn(cityDTO);

        // Act
        CityDTO response = apiCityController.findByName("Test City");

        // Assert
        assertEquals("Test City", response.getName());
    }
}