package com.example.duan_kthp.service;

import com.example.duan_kthp.entity.GraduationResult;
import com.example.duan_kthp.repository.GraduationResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GraduationResultService {

    @Autowired
    private GraduationResultRepository repository;

    public List<GraduationResult> getAll() {
        return repository.findByIsActiveTrue();
    }

    public Optional<GraduationResult> getById(UUID id) {
        return repository.findById(id).filter(r -> r.getIsActive() != null && r.getIsActive());
    }

    public GraduationResult create(GraduationResult result) {
        result.setIsActive(true);
        return repository.save(result);
    }

    public GraduationResult update(UUID id, GraduationResult updatedResult) {
        return repository.findById(id).map(existing -> {
            existing.setStudentId(updatedResult.getStudentId());
            existing.setConditionId(updatedResult.getConditionId());
            existing.setGpa(updatedResult.getGpa());
            existing.setTotalCredits(updatedResult.getTotalCredits());
            existing.setFailedCredits(updatedResult.getFailedCredits());
            existing.setResult(updatedResult.getResult());
            existing.setClassification(updatedResult.getClassification());
            existing.setDecisionDate(updatedResult.getDecisionDate());
            existing.setReviewer(updatedResult.getReviewer());
            existing.setNote(updatedResult.getNote());
            existing.setUpdatedBy(updatedResult.getUpdatedBy());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("GraduationResult not found with id: " + id));
    }

    public void delete(UUID id) {
        repository.findById(id).ifPresent(existing -> {
            existing.setIsActive(false);
            existing.setDeletedAt(LocalDateTime.now());
            repository.save(existing);
        });
    }
}
