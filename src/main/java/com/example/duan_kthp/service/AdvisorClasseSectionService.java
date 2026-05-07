package com.example.duan_kthp.service;

import com.example.duan_kthp.entity.AdvisorClasseSection;
import com.example.duan_kthp.repository.AdvisorClasseSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdvisorClasseSectionService {

    @Autowired
    private AdvisorClasseSectionRepository repository;

    public List<AdvisorClasseSection> getAllActive() {
        return repository.findByIsActiveTrue();
    }

    public List<AdvisorClasseSection> getAll() {
        return repository.findAll();
    }

    public Optional<AdvisorClasseSection> getById(UUID id) {
        return repository.findById(id);
    }

    public AdvisorClasseSection create(AdvisorClasseSection entity) {
        return repository.save(entity);
    }

    public AdvisorClasseSection update(UUID id, AdvisorClasseSection updatedEntity) {
        return repository.findById(id).map(existing -> {
            existing.setEmployeeId(updatedEntity.getEmployeeId());
            existing.setStudentClasseId(updatedEntity.getStudentClasseId());
            existing.setStartDate(updatedEntity.getStartDate());
            existing.setEndDate(updatedEntity.getEndDate());
            if (updatedEntity.getIsActive() != null) {
                existing.setIsActive(updatedEntity.getIsActive());
            }
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Record not found with id " + id));
    }

    public void delete(UUID id) {
        repository.findById(id).ifPresent(existing -> {
            existing.setIsActive(false);
            existing.setDeletedAt(LocalDateTime.now());
            repository.save(existing);
        });
    }
}
