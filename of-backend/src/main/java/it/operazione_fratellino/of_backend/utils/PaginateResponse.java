package it.operazione_fratellino.of_backend.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PaginateResponse<T> {
    private List<T> content;
    private int currentPage;
    private int itemsPerPage;
    private long totalItems;
    private int totalPages;

}
