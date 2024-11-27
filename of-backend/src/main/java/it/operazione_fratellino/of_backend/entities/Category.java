package it.operazione_fratellino.of_backend.entities;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Category {


// Columns
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Il campo non può essere vuoto")
    @Size(min = 4, max = 4)
    @Column(unique = true)
    private String code;

    @NotBlank(message = "Il campo non può essere vuoto")
    @Size(min = 4)
    @Column(unique = true)
    private String name;


// Methods
    public Category(String name, String code) {
        this.name = name;
        this.code = code;
    }

    @OneToMany(mappedBy = "category")
//    @JsonManagedReference
    private Set<Product> products = new LinkedHashSet<>();

}