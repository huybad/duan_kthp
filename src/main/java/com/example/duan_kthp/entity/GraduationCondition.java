package com.example.duan_kthp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "graduation_conditions")
public class GraduationCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID programId;
    private String appliedCohort;
    private Integer minTotalCredits;
    private BigDecimal minGpa;
    private Integer maxFailedCredits;
    private String englishRequirement;
    private String itRequirement;
    private String conductRequired;
    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    
    private UUID createdBy;
    private UUID updatedBy;
    private UUID deletedBy;

    private Boolean isActive;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
