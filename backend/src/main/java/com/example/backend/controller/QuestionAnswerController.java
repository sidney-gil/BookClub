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
import com.example.backend.service.QuestionAnswerService;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "*")
public class QuestionAnswerController {
    @Autowired
    private QuestionAnswerService questionAnswerService;
    
    @PostMapping
    public ResponseEntity<QuestionAnswer> createAnswer(@RequestBody QuestionAnswer answer) {
        return ResponseEntity.ok(questionAnswerService.createAnswer(answer));
    }
    
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<QuestionAnswer>> getAnswersByQuestion(@PathVariable Long questionId) {
        return ResponseEntity.ok(questionAnswerService.getAnswersByQuestion(questionId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuestionAnswer> getAnswer(@PathVariable Long id) {
        return ResponseEntity.ok(questionAnswerService.getAnswerById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<QuestionAnswer> updateAnswer(@PathVariable Long id, @RequestBody String answerText) {
        return ResponseEntity.ok(questionAnswerService.updateAnswer(id, answerText));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long id) {
        questionAnswerService.deleteAnswer(id);
        return ResponseEntity.ok().build();
    }
}
