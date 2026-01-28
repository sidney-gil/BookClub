package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.QuestionAnswer;
import com.example.backend.model.WeeklyQuestion;
import com.example.backend.service.WeeklyQuestionService;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class WeeklyQuestionController {
    @Autowired
    private WeeklyQuestionService weeklyQuestionService;
    
    @PostMapping
    public ResponseEntity<WeeklyQuestion> createQuestion(@RequestBody WeeklyQuestion question) {
        return ResponseEntity.ok(weeklyQuestionService.createQuestion(question));
    }
    
    @GetMapping("/week/{weekId}")
    public ResponseEntity<List<WeeklyQuestion>> getQuestionsByWeek(@PathVariable Long weekId) {
        return ResponseEntity.ok(weeklyQuestionService.getQuestionsByWeek(weekId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<WeeklyQuestion> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(weeklyQuestionService.getQuestionById(id));
    }
    
    @GetMapping("/{questionId}/answers")
    public ResponseEntity<List<QuestionAnswer>> getAnswersForQuestion(@PathVariable Long questionId) {
        return ResponseEntity.ok(weeklyQuestionService.getAnswersForQuestion(questionId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<WeeklyQuestion> updateQuestion(@PathVariable Long id, @RequestBody String questionText) {
        return ResponseEntity.ok(weeklyQuestionService.updateQuestion(id, questionText));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        weeklyQuestionService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }
}
