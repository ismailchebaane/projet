package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.Equipment.*;
import java.util.List;
import com.example.backend.services.*;

import lombok.RequiredArgsConstructor;

import com.example.backend.repository.*;import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {
	@Autowired
    private final EquipmentServices equipmentService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<Equipment> addEquipment(
            @RequestParam("name") String name,
            @RequestParam("serialNumber") String serialNumber,
            @RequestParam("immobilizationNumber") String immobilizationNumber,
            @RequestParam("plant") String plant,
            @RequestParam("process") String process,
            @RequestParam("state") String state,
            @RequestParam("description") String description,
            @RequestParam("type") String type,
            @RequestParam("documents") List<MultipartFile> files) {

        Equipment equipment = equipmentService.addEquipment(
                name, serialNumber, immobilizationNumber, plant, process, state, description, type, files);

        return ResponseEntity.ok(equipment);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        List<Equipment> equipments = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipments);
    }
    
    /**
     * Get equipment by ID.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable String id) {
        Optional<Equipment> equipment = equipmentService.getEquipmentById(id);
        return equipment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Update equipment details.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping ("/update/{id}")
    public ResponseEntity<Equipment> updateEquipment(
            @PathVariable  String id,
            @RequestParam (required = false)  String name,
            @RequestParam(required = false)  String serialNumber,
            @RequestParam(required = false)  String immobilizationNumber,
            @RequestParam (required = false) String plant,
            @RequestParam (required = false) String process,
            @RequestParam (required = false) String state,
            @RequestParam(required = false)  String description,
            @RequestParam (required = false) String type,
            @RequestParam(required = false) List<MultipartFile> documents,
            @RequestParam(required = false) String fileIdToReplace) {

        Equipment updatedEquipment = equipmentService.updateEquipment(
                id, name, serialNumber, immobilizationNumber, plant, process, state, description, type, documents, fileIdToReplace);
        System.out.print(documents);
        return updatedEquipment != null ? ResponseEntity.ok(updatedEquipment) : ResponseEntity.notFound().build();
    }

    /**
     * Delete equipment by ID.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable String id) {
    	equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Add a document to an existing equipment.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{equipmentId}/add-document")
    public ResponseEntity<Equipment> addDocumentToEquipment(
            @PathVariable String equipmentId,
            @RequestParam MultipartFile file) {
        Equipment updatedEquipment = equipmentService.addDocumentToEquipment(equipmentId, file);
        return updatedEquipment != null ? ResponseEntity.ok(updatedEquipment) : ResponseEntity.notFound().build();
    }

    /**
     * Remove a document from equipment.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{equipmentId}/remove-document/{documentId}")
    public ResponseEntity<Equipment> removeDocumentFromEquipment(
            @PathVariable String equipmentId,
            @PathVariable String documentId) {
        Equipment updatedEquipment = equipmentService.removeDocumentFromEquipment(equipmentId, documentId);
        return updatedEquipment != null ? ResponseEntity.ok(updatedEquipment) : ResponseEntity.notFound().build();
    }
    
    // Endpoint for updating a specific document of a specific equipment
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{equipmentId}/document/{fileIdToReplace}")
    public ResponseEntity<Equipment> updateDocument(
            @PathVariable String equipmentId,
            @PathVariable String fileIdToReplace,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Equipment updatedEquipment = equipmentService.updateDocumentOfEquipment(
                    equipmentId,
                    fileIdToReplace,
                    file
            );
            if (updatedEquipment != null) {
                return ResponseEntity.ok(updatedEquipment);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    
}