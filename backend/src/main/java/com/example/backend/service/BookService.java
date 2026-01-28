package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Book;
import com.example.backend.model.Week;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.WeekRepository;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private WeekRepository weekRepository;
    
    public Book getCurrentBook() {
        return bookRepository.findByIsActiveTrue()
            .orElseThrow(() -> new RuntimeException("No active book found"));
    }
    
    public List<Week> getWeeksForBook(Long bookId) {
        return weekRepository.findByBookIdOrderByWeekNumber(bookId);
    }
    
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }
    
    public void setActiveBook(Long bookId) {
        // Deactivate all books
        bookRepository.findAll().forEach(b -> {
            b.setIsActive(false);
            bookRepository.save(b);
        });
        
        // Activate selected book
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setIsActive(true);
        bookRepository.save(book);
    }
}