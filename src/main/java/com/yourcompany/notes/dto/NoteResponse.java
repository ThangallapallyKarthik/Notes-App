package com.yourcompany.notes.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class NoteResponse {
    private String id;
    private String title;
    private String content;
    private String color;
    private Instant createdAt;
    private Instant updatedAt;
}
