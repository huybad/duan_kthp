package com.example.duan_kthp.controller;

import com.example.duan_kthp.entity.AdvisorClasseSection;
import com.example.duan_kthp.service.AdvisorClasseSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/advisors")
public class AdvisorClasseSectionController {

    @Autowired
    private AdvisorClasseSectionService service;

    @GetMapping
    public List<AdvisorClasseSection> getAll() {
        return service.getAll();
    }

    @GetMapping("/active")
    public List<AdvisorClasseSection> getAllActive() {
        return service.getAllActive();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdvisorClasseSection> getById(@PathVariable UUID id) {
        Optional<AdvisorClasseSection> entity = service.getById(id);
        return entity.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public AdvisorClasseSection create(@RequestBody AdvisorClasseSection entity) {
        return service.create(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdvisorClasseSection> update(@PathVariable UUID id,
            @RequestBody AdvisorClasseSection entity) {
        try {
            return ResponseEntity.ok(service.update(id, entity));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
