package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.QuestionAnswer;
import com.example.backend.model.WeeklyQuestion;
import com.example.backend.repository.WeekRepository;
import com.example.backend.repository.WeeklyQuestionRepository;

@Service
public class WeeklyQuestionService {
    @Autowired
    private WeeklyQuestionRepository weeklyQuestionRepository;
    
    @Autowired
    private WeekRepository weekRepository;
    
    public WeeklyQuestion createQuestion(WeeklyQuestion question) {
        // Validate week exists
        weekRepository.findById(question.getWeek().getId())
            .orElseThrow(() -> new RuntimeException("Week not found"));
        
        return weeklyQuestionRepository.save(question);
    }
    
    public List<WeeklyQuestion> getQuestionsByWeek(Long weekId) {
        return weeklyQuestionRepository.findByWeekId(weekId);
    }
    
    public WeeklyQuestion getQuestionById(Long id) {
        return weeklyQuestionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
    }
    
    public List<QuestionAnswer> getAnswersForQuestion(Long questionId) {
        WeeklyQuestion question = getQuestionById(questionId);
        return question.getAnswers();
    }
    
    public WeeklyQuestion updateQuestion(Long id, String questionText) {
        WeeklyQuestion question = getQuestionById(id);
        question.setQuestion(questionText);
        return weeklyQuestionRepository.save(question);
    }
    
    public void deleteQuestion(Long id) {
        WeeklyQuestion question = getQuestionById(id);
        weeklyQuestionRepository.delete(question);
    }
}
