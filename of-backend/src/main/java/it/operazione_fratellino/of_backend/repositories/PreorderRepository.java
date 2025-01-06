package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Preorder;
import it.operazione_fratellino.of_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PreorderRepository extends JpaRepository<Preorder, Integer> {

    Optional<Preorder> findById(Integer id);
    List<Preorder> findByUser(User user);

    @Query("SELECT COUNT(p) FROM Preorder p WHERE p.status.value = :status")
    Long countByStatus(@Param("status") String status);
}
