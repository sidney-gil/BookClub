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

import com.example.backend.model.Chapter;
import com.example.backend.model.Week;
import com.example.backend.service.WeekService;

@RestController
@RequestMapping("/api/weeks")
@CrossOrigin(origins = "*")
public class WeekController {
    @Autowired
    private WeekService weekService;
    
    @PostMapping
    public ResponseEntity<Week> createWeek(@RequestBody Week week) {
        return ResponseEntity.ok(weekService.createWeek(week));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Week> getWeek(@PathVariable Long id) {
        return ResponseEntity.ok(weekService.getWeekById(id));
    }
    
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Week>> getWeeksByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(weekService.getWeeksByBook(bookId));
    }
    
    @GetMapping("/{weekId}/chapters")
    public ResponseEntity<List<Chapter>> getChaptersForWeek(@PathVariable Long weekId) {
        return ResponseEntity.ok(weekService.getChaptersForWeek(weekId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Week> updateWeek(@PathVariable Long id, @RequestBody Week week) {
        return ResponseEntity.ok(weekService.updateWeek(id, week));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeek(@PathVariable Long id) {
        weekService.deleteWeek(id);
        return ResponseEntity.ok().build();
    }
}
