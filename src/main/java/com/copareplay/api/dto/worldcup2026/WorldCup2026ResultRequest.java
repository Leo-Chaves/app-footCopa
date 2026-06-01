package com.copareplay.api.dto.worldcup2026;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record WorldCup2026ResultRequest(
        @NotBlank(message = "Selecao mandante e obrigatoria")
        String homeTeam,

        @NotBlank(message = "Selecao visitante e obrigatoria")
        String awayTeam,

        LocalDateTime matchDate,

        @NotBlank(message = "Fase e obrigatoria")
        String stage,

        String groupName,
        String stadium,
        String city,
        Boolean finished,

        @NotNull(message = "Placar do mandante e obrigatorio")
        @Min(value = 0, message = "Placar do mandante nao pode ser negativo")
        Integer homeScore,

        @NotNull(message = "Placar do visitante e obrigatorio")
        @Min(value = 0, message = "Placar do visitante nao pode ser negativo")
        Integer awayScore,

        @Size(max = 500, message = "Observacao deve ter no maximo 500 caracteres")
        String note
) {
}
