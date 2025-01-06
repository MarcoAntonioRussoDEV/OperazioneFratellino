package it.operazione_fratellino.of_backend.utils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.function.Function;

public class PaginationUtils {

    public static <T, D> PaginateResponse<D> getAllEntities(int page, int size, Function<PageRequest, Page<T>> entityService, Function<T, D> entityConverter) {
        if (page < 0) {
            page = 0;
        }

        if (size < 0) {
            size = Integer.MAX_VALUE;
        }

        Page<T> entities = entityService.apply(PageRequest.of(page, size));
        List<D> content = entities.stream().map(entityConverter).toList();


        return new PaginateResponse<>(content, entities.getNumber(), entities.getSize(), entities.getTotalElements(), entities.getTotalPages());

    }
}
