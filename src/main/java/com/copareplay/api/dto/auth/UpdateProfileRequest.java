package com.copareplay.api.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank(message = "Nome e obrigatorio")
        String name
) {
}
