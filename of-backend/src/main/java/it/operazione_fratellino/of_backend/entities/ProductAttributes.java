package it.operazione_fratellino.of_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "product_attributes")
@AllArgsConstructor
@NoArgsConstructor
public class ProductAttributes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_code", referencedColumnName = "code")
    @JsonBackReference
    private Product product;

    @ManyToOne
    @JoinColumn(name = "attribute_name", referencedColumnName = "name")
    private Attribute attribute;

    @NotBlank(message = "Il campo non può essere vuoto")
    private String value;


}