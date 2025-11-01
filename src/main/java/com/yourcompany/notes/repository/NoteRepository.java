package com.yourcompany.notes.repository;

import com.yourcompany.notes.entity.Note;
import com.yourcompany.notes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, String> {
  List<Note> findByUserOrderByUpdatedAtDesc(User user);
}
