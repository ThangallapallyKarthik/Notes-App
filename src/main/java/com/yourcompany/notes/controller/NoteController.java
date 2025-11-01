package com.yourcompany.notes.controller;

import com.yourcompany.notes.dto.NoteRequest;
import com.yourcompany.notes.dto.NoteResponse;
import com.yourcompany.notes.entity.User;
import com.yourcompany.notes.service.NoteService;
import com.yourcompany.notes.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/notes") @RequiredArgsConstructor
public class NoteController {
  private final NoteService noteService;
  private final UserService userService;

  private User current(Authentication auth){ return userService.getById((String) auth.getPrincipal()); }

  @GetMapping              public ResponseEntity<List<NoteResponse>> list(Authentication auth){ return ResponseEntity.ok(noteService.list(current(auth))); }
  @PostMapping             public ResponseEntity<NoteResponse> create(Authentication auth, @RequestBody NoteRequest req){ return ResponseEntity.ok(noteService.create(current(auth), req)); }
  @PutMapping("/{id}")     public ResponseEntity<NoteResponse> update(Authentication auth, @PathVariable String id, @RequestBody NoteRequest req){ return ResponseEntity.ok(noteService.update(current(auth), id, req)); }
  @DeleteMapping("/{id}")  public ResponseEntity<Void> delete(Authentication auth, @PathVariable String id){ noteService.delete(current(auth), id); return ResponseEntity.noContent().build(); }
}
