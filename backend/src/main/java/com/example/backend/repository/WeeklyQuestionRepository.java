package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.WeeklyQuestion;

@Repository
public interface WeeklyQuestionRepository extends JpaRepository<WeeklyQuestion, Long> {
    List<WeeklyQuestion> findByWeekId(Long weekId);
}