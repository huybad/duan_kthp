package com.example.duan_kthp.controller;

import com.example.duan_kthp.entity.GraduationCondition;
import com.example.duan_kthp.repository.GraduationConditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*") // Mở CORS cho Frontend gọi
@RestController
@RequestMapping("/api/graduation-conditions")
public class GraduationConditionController {

    @Autowired
    private GraduationConditionRepository repository;

    // 1. READ - Lấy danh sách
    @GetMapping
    public List<GraduationCondition> getAll() {
        return repository.findByIsActiveTrueAndDeletedAtIsNullOrderByCreatedAtDesc();
    }

    // 2. CREATE - Thêm mới
    @PostMapping
    public GraduationCondition create(@RequestBody GraduationCondition condition) {
        // Trong thực tế, UUID programId thường truyền từ Client lên.
        if (condition.getProgramId() == null) {
            condition.setProgramId(UUID.randomUUID()); // Fake ID nếu client không gửi
        }
        return repository.save(condition);
    }

    // 3. UPDATE - Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<GraduationCondition> update(@PathVariable UUID id, @RequestBody GraduationCondition details) {
        return repository.findById(id).map(condition -> {
            condition.setAppliedCohort(details.getAppliedCohort());
            condition.setMinTotalCredits(details.getMinTotalCredits());
            condition.setMinGpa(details.getMinGpa());
            condition.setEnglishRequirement(details.getEnglishRequirement());
            // Cập nhật thêm các trường khác nếu cần...
            return ResponseEntity.ok(repository.save(condition));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. DELETE - Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return repository.findById(id).map(condition -> {
            condition.setIsActive(false);
            condition.setDeletedAt(LocalDateTime.now());
            repository.save(condition);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
