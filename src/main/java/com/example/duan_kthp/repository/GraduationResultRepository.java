package com.example.duan_kthp.repository;

import com.example.duan_kthp.entity.GraduationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface GraduationResultRepository extends JpaRepository<GraduationResult, UUID> {
    List<GraduationResult> findByIsActiveTrue();
}
