package com.yourcompany.notes.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Table(name="notes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Note {
  @Id @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false) private String title;
  @Column(columnDefinition = "text") private String content;
  @Column(nullable = false) private String color;

  @Column(nullable = false) private Instant createdAt;
  @Column(nullable = false) private Instant updatedAt;
}
