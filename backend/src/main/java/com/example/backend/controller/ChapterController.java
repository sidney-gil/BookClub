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
import com.example.backend.service.ChapterService;

@RestController
@RequestMapping("/api/chapters")
@CrossOrigin(origins = "*")
public class ChapterController {
    @Autowired
    private ChapterService chapterService;
    
    @PostMapping
    public ResponseEntity<Chapter> createChapter(@RequestBody Chapter chapter) {
        return ResponseEntity.ok(chapterService.createChapter(chapter));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getChapter(@PathVariable Long id) {
        return ResponseEntity.ok(chapterService.getChapterById(id));
    }
    
    @GetMapping("/week/{weekId}")
    public ResponseEntity<List<Chapter>> getChaptersByWeek(@PathVariable Long weekId) {
        return ResponseEntity.ok(chapterService.getChaptersByWeek(weekId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Chapter> updateChapter(@PathVariable Long id, @RequestBody Chapter chapter) {
        return ResponseEntity.ok(chapterService.updateChapter(id, chapter));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.ok().build();
    }
}
