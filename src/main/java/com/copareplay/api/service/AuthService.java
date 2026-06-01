package com.copareplay.api.service;

import com.copareplay.api.dto.auth.AuthResponse;
import com.copareplay.api.dto.auth.LoginRequest;
import com.copareplay.api.dto.auth.SignupRequest;
import com.copareplay.api.dto.auth.UpdatePasswordRequest;
import com.copareplay.api.dto.auth.UpdateProfileRequest;
import com.copareplay.api.dto.auth.UserResponse;
import com.copareplay.api.entity.Role;
import com.copareplay.api.entity.User;
import com.copareplay.api.exception.BadRequestException;
import com.copareplay.api.exception.ResourceNotFoundException;
import com.copareplay.api.repository.UserRepository;
import com.copareplay.api.security.AppUserDetails;
import com.copareplay.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final DtoMapper mapper;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email ja cadastrado");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(new AppUserDetails(user));
        return new AuthResponse(token, mapper.toUserResponse(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password())
        );
        AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, mapper.toUserResponse(userDetails.getUser()));
    }

    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        return mapper.toUserResponse(getUserByEmail(email));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = getUserByEmail(email);
        user.setName(request.name().trim());
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void updatePassword(String email, UpdatePasswordRequest request) {
        User user = getUserByEmail(email);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Senha atual invalida");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
