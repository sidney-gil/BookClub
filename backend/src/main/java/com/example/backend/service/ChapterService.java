package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Chapter;
import com.example.backend.repository.ChapterRepository;
import com.example.backend.repository.WeekRepository;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;
    
    @Autowired
    private WeekRepository weekRepository;
    
    public Chapter createChapter(Chapter chapter) {
        // Validate week exists
        weekRepository.findById(chapter.getWeek().getId())
            .orElseThrow(() -> new RuntimeException("Week not found"));
        
        return chapterRepository.save(chapter);
    }
    
    public Chapter getChapterById(Long id) {
        return chapterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
    }
    
    public List<Chapter> getChaptersByWeek(Long weekId) {
        return chapterRepository.findByWeekIdOrderByChapterNumber(weekId);
    }
    
    public Chapter updateChapter(Long id, Chapter chapterDetails) {
        Chapter chapter = getChapterById(id);
        chapter.setChapterNumber(chapterDetails.getChapterNumber());
        chapter.setTitle(chapterDetails.getTitle());
        return chapterRepository.save(chapter);
    }
    
    public void deleteChapter(Long id) {
        Chapter chapter = getChapterById(id);
        chapterRepository.delete(chapter);
    }
}
