package com.copareplay.api.repository;

import com.copareplay.api.entity.Team;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByNameIgnoreCase(String name);

    Optional<Team> findByCodeIgnoreCase(String code);
}
