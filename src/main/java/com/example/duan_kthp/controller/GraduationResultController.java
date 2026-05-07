package com.example.duan_kthp.controller;

import com.example.duan_kthp.entity.GraduationResult;
import com.example.duan_kthp.service.GraduationResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/graduation-results")
public class GraduationResultController {

    @Autowired
    private GraduationResultService service;

    @GetMapping
    public List<GraduationResult> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GraduationResult> getById(@PathVariable UUID id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GraduationResult create(@RequestBody GraduationResult result) {
        return service.create(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GraduationResult> update(@PathVariable UUID id, @RequestBody GraduationResult result) {
        try {
            return ResponseEntity.ok(service.update(id, result));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
