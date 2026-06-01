package com.copareplay.api.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
        @NotBlank(message = "Senha atual e obrigatoria")
        String currentPassword,

        @NotBlank(message = "Nova senha e obrigatoria")
        @Size(min = 6, message = "Nova senha deve ter no minimo 6 caracteres")
        String newPassword
) {
}
