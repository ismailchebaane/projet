package com.example.backend.controllers;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.Equipment.*;

import java.time.LocalDateTime;
import java.util.*;

import com.example.backend.services.*;

import lombok.RequiredArgsConstructor;

import com.example.backend.repository.*;import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {
	@Autowired
    private final EquipmentServices equipmentService;



    @Autowired
    private GridFsTemplate gridFsTemplate;

    private final EquipmentRepository equipmentRepository;

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
    @GetMapping("/check/{serialNumber}")
    public ResponseEntity<Map<String, Boolean>> checkSerialNumberExists(@PathVariable String serialNumber) {
        boolean exists = equipmentRepository.findBySerialNumber(serialNumber).isPresent();
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }


    @PostMapping("/{equipmentId}/replace-document/{docId}")
    public ResponseEntity<?> replaceDocument(
            @PathVariable String equipmentId,
            @PathVariable String docId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("oldDocName") String oldDocName) {

        try {
            // 1. Get Equipment
            Optional<Equipment> optionalEquipment = equipmentRepository.findBySerialNumber(equipmentId);
            if (optionalEquipment.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Equipment not found");
            }
            Equipment equipment = optionalEquipment.get();

            // 2. Find old document
            DocumentEntity oldDoc = equipment.getDocuments().stream()
                    .filter(doc -> doc.getId().equals(docId))
                    .findFirst()
                    .orElse(null);

            if (oldDoc == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found in equipment");
            }

            // 3. Move old document to archive
            if (equipment.getArchive() == null) {
                equipment.setArchive(new ArrayList<>());
            }
            equipment.getArchive().add(oldDoc);

            // 4. Delete file from GridFS by ID
            gridFsTemplate.delete(new Query(Criteria.where("_id").is(docId)));

            // 5. Save new file to GridFS
            ObjectId newFileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());

            DocumentEntity newDoc = new DocumentEntity();
            newDoc.setId(newFileId.toString());
            newDoc.setName(file.getOriginalFilename());
            newDoc.setFilePath("/files/" + newFileId.toString());
            newDoc.setUploadDate(LocalDateTime.now());

            // 6. Replace the old doc in the documents list
            List<DocumentEntity> updatedDocs = equipment.getDocuments().stream()
                    .map(d -> d.getId().equals(docId) ? newDoc : d)
                    .collect(Collectors.toList());

            equipment.setDocuments(updatedDocs);

            // 7. Save updated equipment
            Equipment saved = equipmentRepository.save(equipment);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error replacing document: " + e.getMessage());
        }
    }


}