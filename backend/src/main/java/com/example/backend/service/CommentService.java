package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Comment;
import com.example.backend.repository.ChapterRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.UserRepository;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private ChapterRepository chapterRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Comment createComment(Comment comment) {
        // Validate chapter exists
        chapterRepository.findById(comment.getChapter().getId())
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
        
        // Validate user exists
        userRepository.findById(comment.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return commentRepository.save(comment);
    }
    
    public List<Comment> getCommentsByChapter(Long chapterId) {
        return commentRepository.findByChapterIdOrderByCreatedAtDesc(chapterId);
    }
    
    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
    }
    
    public Comment updateComment(Long id, String content) {
        Comment comment = getCommentById(id);
        comment.setContent(content);
        return commentRepository.save(comment);
    }
    
    public void deleteComment(Long id) {
        Comment comment = getCommentById(id);
        commentRepository.delete(comment);
    }
}
