package com.yourcompany.notes.service;

import com.yourcompany.notes.dto.NoteRequest;
import com.yourcompany.notes.dto.NoteResponse;
import com.yourcompany.notes.entity.Note;
import com.yourcompany.notes.entity.User;
import com.yourcompany.notes.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class NoteService {
  private final NoteRepository noteRepository;

  public List<NoteResponse> list(User user) {
    return noteRepository.findByUserOrderByUpdatedAtDesc(user)
      .stream().map(this::toDto).collect(Collectors.toList());
  }

  public NoteResponse create(User user, NoteRequest req) {
    Instant now = Instant.now();
    Note note = Note.builder()
      .user(user)
      .title(req.getTitle() == null || req.getTitle().isBlank() ? "Untitled" : req.getTitle())
      .content(req.getContent())
      .color(req.getColor() == null || req.getColor().isBlank() ? "#FFD700" : req.getColor())
      .createdAt(now).updatedAt(now).build();
    return toDto(noteRepository.save(note));
  }

  public NoteResponse update(User user, String id, NoteRequest req) {
    Note n = noteRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    if (!n.getUser().getId().equals(user.getId()))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your note");
    if (req.getTitle()!=null) n.setTitle(req.getTitle());
    if (req.getContent()!=null) n.setContent(req.getContent());
    if (req.getColor()!=null) n.setColor(req.getColor());
    n.setUpdatedAt(Instant.now());
    return toDto(noteRepository.save(n));
  }

  public void delete(User user, String id) {
    Note n = noteRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    if (!n.getUser().getId().equals(user.getId()))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your note");
    noteRepository.delete(n);
  }

  private NoteResponse toDto(Note n) {
    return NoteResponse.builder()
      .id(n.getId()).title(n.getTitle()).content(n.getContent()).color(n.getColor())
      .createdAt(n.getCreatedAt()).updatedAt(n.getUpdatedAt()).build();
  }
}
