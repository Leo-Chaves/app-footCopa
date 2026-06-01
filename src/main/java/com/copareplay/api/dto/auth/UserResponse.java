package com.copareplay.api.dto.auth;

import com.copareplay.api.entity.Role;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}
