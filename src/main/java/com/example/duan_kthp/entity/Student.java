package com.example.duan_kthp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "student_code", nullable = false, unique = true)
    private String studentCode;

    @Column(name = "earned_credits", nullable = false)
    private Integer earnedCredits;

    @Column(name = "gpa", precision = 3, scale = 2, nullable = false)
    private BigDecimal gpa;

    @Column(name = "cohort", nullable = false)
    private String cohort;

    @Column(name = "has_physical_edu", nullable = false)
    private Boolean hasPhysicalEdu;

    @Column(name = "has_defense_edu", nullable = false)
    private Boolean hasDefenseEdu;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "id_card_number")
    private String idCardNumber;

    @Column(name = "id_card_issue_place")
    private String idCardIssuePlace;

    @Column(name = "address")
    private String address;

    @Column(name = "status")
    private String status;

    @Column(name = "admin_class")
    private String adminClass;

    @Column(name = "major")
    private String major;

    @Column(name = "record_status")
    private String recordStatus;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public Integer getEarnedCredits() { return earnedCredits; }
    public void setEarnedCredits(Integer earnedCredits) { this.earnedCredits = earnedCredits; }

    public BigDecimal getGpa() { return gpa; }
    public void setGpa(BigDecimal gpa) { this.gpa = gpa; }

    public String getCohort() { return cohort; }
    public void setCohort(String cohort) { this.cohort = cohort; }

    public Boolean getHasPhysicalEdu() { return hasPhysicalEdu; }
    public void setHasPhysicalEdu(Boolean hasPhysicalEdu) { this.hasPhysicalEdu = hasPhysicalEdu; }

    public Boolean getHasDefenseEdu() { return hasDefenseEdu; }
    public void setHasDefenseEdu(Boolean hasDefenseEdu) { this.hasDefenseEdu = hasDefenseEdu; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getIdCardNumber() { return idCardNumber; }
    public void setIdCardNumber(String idCardNumber) { this.idCardNumber = idCardNumber; }

    public String getIdCardIssuePlace() { return idCardIssuePlace; }
    public void setIdCardIssuePlace(String idCardIssuePlace) { this.idCardIssuePlace = idCardIssuePlace; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminClass() { return adminClass; }
    public void setAdminClass(String adminClass) { this.adminClass = adminClass; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }

    public String getRecordStatus() { return recordStatus; }
    public void setRecordStatus(String recordStatus) { this.recordStatus = recordStatus; }
}
