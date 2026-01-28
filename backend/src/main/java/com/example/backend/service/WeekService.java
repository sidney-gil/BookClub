package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Chapter;
import com.example.backend.model.Week;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.WeekRepository;

@Service
public class WeekService {
    @Autowired
    private WeekRepository weekRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    public Week createWeek(Week week) {
        // Validate book exists
        bookRepository.findById(week.getBook().getId())
            .orElseThrow(() -> new RuntimeException("Book not found"));
        
        return weekRepository.save(week);
    }
    
    public Week getWeekById(Long id) {
        return weekRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Week not found"));
    }
    
    public List<Week> getWeeksByBook(Long bookId) {
        return weekRepository.findByBookIdOrderByWeekNumber(bookId);
    }
    
    public List<Chapter> getChaptersForWeek(Long weekId) {
        Week week = getWeekById(weekId);
        return week.getChapters();
    }
    
    public Week updateWeek(Long id, Week weekDetails) {
        Week week = getWeekById(id);
        week.setTitle(weekDetails.getTitle());
        week.setStartDate(weekDetails.getStartDate());
        week.setEndDate(weekDetails.getEndDate());
        week.setWeekNumber(weekDetails.getWeekNumber());
        return weekRepository.save(week);
    }
    
    public void deleteWeek(Long id) {
        Week week = getWeekById(id);
        weekRepository.delete(week);
    }
}
