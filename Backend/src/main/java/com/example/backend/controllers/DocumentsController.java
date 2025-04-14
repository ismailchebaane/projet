package com.example.backend.controllers;
import com.example.backend.Equipment.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import com.example.backend.services.*;
@RestController
@RequestMapping("/api/documents")
public class DocumentsController {

    @Autowired
    private DocumentService documentService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileId = documentService.uploadFile(file);
            return ResponseEntity.ok("File uploaded successfully with ID: " + fileId);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed.");
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getFile(@PathVariable String id) {
        Resource file = documentService.getFile(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable String id) {

        documentService.deleteFileAndRemoveFromEquipment(id);
        return ResponseEntity.ok("File deleted successfully.");
    }
}
