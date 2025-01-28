package com.softeer.reacton.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private String university;

    @Column(nullable = false)
    private String classType;

    @Column(nullable = false)
    private String schedule;

    @Column(nullable = false)
    private int accessCode;

    @Column(nullable = false)
    private String status;

    @Column
    private String fileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @Getter
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules;

}
