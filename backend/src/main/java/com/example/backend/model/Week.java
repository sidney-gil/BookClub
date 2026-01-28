package com.example.backend.model;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "weeks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Week {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonBackReference("book-weeks")
    private Book book;
    
    private Integer weekNumber;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    
    @OneToMany(mappedBy = "week", cascade = CascadeType.ALL)
    @JsonManagedReference("week-chapters")
    private List<Chapter> chapters = new ArrayList<>();
}
