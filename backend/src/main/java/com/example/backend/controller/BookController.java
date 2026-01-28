package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Book;
import com.example.backend.model.Week;
import com.example.backend.service.BookService;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    @Autowired
    private BookService bookService;
    
    @GetMapping("/current")
    public ResponseEntity<Book> getCurrentBook() {
        return ResponseEntity.ok(bookService.getCurrentBook());
    }
    
    @GetMapping("/{bookId}/weeks")
    public ResponseEntity<List<Week>> getWeeks(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookService.getWeeksForBook(bookId));
    }
    
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.createBook(book));
    }
    
    @PutMapping("/{bookId}/activate")
    public ResponseEntity<Void> setActiveBook(@PathVariable Long bookId) {
        bookService.setActiveBook(bookId);
        return ResponseEntity.ok().build();
    }
}