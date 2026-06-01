package com.copareplay.api.controller;

import com.copareplay.api.dto.auth.UpdatePasswordRequest;
import com.copareplay.api.dto.auth.UpdateProfileRequest;
import com.copareplay.api.dto.auth.UserResponse;
import com.copareplay.api.service.AuthService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @PutMapping("/me")
    public UserResponse updateProfile(Principal principal, @Valid @RequestBody UpdateProfileRequest request) {
        return authService.updateProfile(principal.getName(), request);
    }

    @PutMapping("/me/password")
    public Map<String, String> updatePassword(
            Principal principal,
            @Valid @RequestBody UpdatePasswordRequest request
    ) {
        authService.updatePassword(principal.getName(), request);
        return Map.of("message", "Senha atualizada com sucesso");
    }
}
