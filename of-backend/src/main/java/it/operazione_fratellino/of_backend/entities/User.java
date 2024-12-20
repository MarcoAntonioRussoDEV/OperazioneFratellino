package it.operazione_fratellino.of_backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
    private String avatar;

    @NotNull
    private Date createdAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(this.role);
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
