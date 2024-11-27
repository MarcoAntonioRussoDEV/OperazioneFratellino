package it.operazione_fratellino.of_backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "attributes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Attribute {

    // Columns
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Il campo non può essere vuoto")
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "attribute")
    private List<ProductAttributes> productAttributes;

    public Attribute(String name) {
        this.name = name;
    }

    public Attribute(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
