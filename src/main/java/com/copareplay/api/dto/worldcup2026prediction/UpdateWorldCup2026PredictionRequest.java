package com.copareplay.api.dto.worldcup2026prediction;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateWorldCup2026PredictionRequest(
        @NotNull(message = "Placar do mandante e obrigatorio")
        @Min(value = 0, message = "Placar do mandante nao pode ser negativo")
        Integer predictedHomeScore,

        @NotNull(message = "Placar do visitante e obrigatorio")
        @Min(value = 0, message = "Placar do visitante nao pode ser negativo")
        Integer predictedAwayScore,

        @Size(max = 500, message = "Observacao deve ter no maximo 500 caracteres")
        String note
) {
}
