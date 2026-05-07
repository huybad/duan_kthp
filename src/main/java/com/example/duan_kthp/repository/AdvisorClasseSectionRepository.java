package com.example.duan_kthp.repository;

import com.example.duan_kthp.entity.AdvisorClasseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdvisorClasseSectionRepository extends JpaRepository<AdvisorClasseSection, UUID> {
    List<AdvisorClasseSection> findByIsActiveTrue();
}
