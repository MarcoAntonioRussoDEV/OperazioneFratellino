package it.operazione_fratellino.of_backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.awt.*;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Table(name = "users")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    private String name;

    @Email
    @Column(unique = true)
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "id", fetch = FetchType.LAZY)
    private List<Sale> sales;

    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] avatar;

    @Size(min = 10 ,max = 10, message = "phone value must be 10 characters")
    private String phone;

    @NotNull
    private Date createdAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @OneToOne(mappedBy = "user")
    private Client client;

    @OneToMany(mappedBy = "user")
    private List<Preorder> preorders;

    @OneToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @Column(name = "is_first_access")
    private Boolean isFirstAccess;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(this.role);
    }


    @Override
    public String getUsername() {
        return this.email;
    }

    @PrePersist
    private void prePersist() {
        if (this.isDeleted == null) {
            this.isDeleted = false;
        }
        if (this.createdAt == null) {
            this.createdAt = new Date();
        }

    }

}
