package com.example.duan_kthp.service;

import com.example.duan_kthp.entity.Student;
import com.example.duan_kthp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public List<Student> getAll() {
        return repository.findAll();
    }

    public Optional<Student> getById(UUID id) {
        return repository.findById(id);
    }

    public Student create(Student student) {
        return repository.save(student);
    }

    public Student update(UUID id, Student updatedStudent) {
        return repository.findById(id).map(student -> {
            student.setName(updatedStudent.getName());
            student.setStudentCode(updatedStudent.getStudentCode());
            student.setEarnedCredits(updatedStudent.getEarnedCredits());
            student.setGpa(updatedStudent.getGpa());
            student.setCohort(updatedStudent.getCohort());
            student.setHasPhysicalEdu(updatedStudent.getHasPhysicalEdu());
            student.setHasDefenseEdu(updatedStudent.getHasDefenseEdu());
            student.setIsActive(updatedStudent.getIsActive());
            return repository.save(student);
        }).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
