package com.copareplay.api.controller;

import com.copareplay.api.service.AdminService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/seed")
    public Map<String, Object> seed() {
        return adminService.seed();
    }

    @PostMapping("/import/worldcup/{year}")
    public Map<String, Object> importWorldCup(@PathVariable Integer year) {
        return adminService.importWorldCup(year);
    }
}
