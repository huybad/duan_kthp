package com.example.duan_kthp.repository;

import com.example.duan_kthp.entity.GraduationCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GraduationConditionRepository extends JpaRepository<GraduationCondition, UUID> {
    // Chỉ lấy những điều kiện chưa bị xóa mềm
    List<GraduationCondition> findByIsActiveTrueAndDeletedAtIsNullOrderByCreatedAtDesc();
}
