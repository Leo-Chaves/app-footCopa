package com.copareplay.api.repository;

import com.copareplay.api.entity.Match;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MatchRepository extends JpaRepository<Match, Long>, JpaSpecificationExecutor<Match> {

    List<Match> findByWorldCupId(Long worldCupId);

    Optional<Match> findBySourceMatchId(String sourceMatchId);

    Optional<Match> findByWorldCupIdAndHomeTeamIdAndAwayTeamIdAndMatchDate(
            Long worldCupId,
            Long homeTeamId,
            Long awayTeamId,
            LocalDateTime matchDate
    );
}
