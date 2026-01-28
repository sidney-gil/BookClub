package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.QuestionAnswer;
import com.example.backend.repository.QuestionAnswerRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WeeklyQuestionRepository;

@Service
public class QuestionAnswerService {
    @Autowired
    private QuestionAnswerRepository questionAnswerRepository;
    
    @Autowired
    private WeeklyQuestionRepository weeklyQuestionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public QuestionAnswer createAnswer(QuestionAnswer answer) {
        // Validate question exists
        weeklyQuestionRepository.findById(answer.getQuestion().getId())
            .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Validate user exists
        userRepository.findById(answer.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return questionAnswerRepository.save(answer);
    }
    
    public List<QuestionAnswer> getAnswersByQuestion(Long questionId) {
        return questionAnswerRepository.findByQuestionId(questionId);
    }
    
    public QuestionAnswer getAnswerById(Long id) {
        return questionAnswerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Answer not found"));
    }
    
    public QuestionAnswer updateAnswer(Long id, String answerText) {
        QuestionAnswer answer = getAnswerById(id);
        answer.setAnswer(answerText);
        return questionAnswerRepository.save(answer);
    }
    
    public void deleteAnswer(Long id) {
        QuestionAnswer answer = getAnswerById(id);
        questionAnswerRepository.delete(answer);
    }
}
