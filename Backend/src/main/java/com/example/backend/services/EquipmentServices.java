package com.example.backend.services;

import com.example.backend.Equipment.Equipment;
import com.example.backend.Equipment.EquipmentState;
import com.example.backend.Equipment.PlantType;
import com.example.backend.Equipment.ProcessType;
import com.example.backend.Equipment.DocumentEntity;
import com.example.backend.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsCriteria;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipmentServices {

    private final EquipmentRepository equipmentRepository;
    private final GridFsTemplate gridFsTemplate;
    @Autowired
    private GridFsOperations gridFsOperations;

    /**
     * Add equipment along with its documents in a single request.
     */
    public Equipment addEquipment(
            String name, String serialNumber, String immobilizationNumber,
            String plant, String process, String state, String description, String type,
            List<MultipartFile> files) {

        // Check if equipment with this serial number already exists
        Optional<Equipment> existing = equipmentRepository.findBySerialNumber(serialNumber);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("An equipment with the same serial number already exists.");
        }

        // Convert strings to enums
        PlantType plantType;
        ProcessType processType;
        EquipmentState equipmentState;

        try {
            plantType = PlantType.valueOf(plant);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid PlantType value: " + plant);
        }

        try {
            processType = ProcessType.valueOf(process);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ProcessType value: " + process);
        }

        try {
            equipmentState = EquipmentState.valueOf(state);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid EquipmentState value: " + state);
        }

        // Handle file upload to GridFS
        List<DocumentEntity> documentEntities = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                try {
                    ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
                    DocumentEntity document = new DocumentEntity(fileId.toString(), file.getOriginalFilename(), "/files/" + fileId, LocalDateTime.now());
                    documentEntities.add(document);
                } catch (IOException e) {
                    throw new RuntimeException("Error storing file: " + file.getOriginalFilename(), e);
                }
            }
        }

        // Create and save Equipment
        Equipment equipment = new Equipment(
                name,
                serialNumber,
                immobilizationNumber,
                plantType,
                processType,
                equipmentState,
                description,
                type,
                documentEntities
        );

        return equipmentRepository.save(equipment);
    }

    /**
     * Get all equipment
     */
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    /**
     * Get equipment by ID
     */
    public Optional<Equipment> getEquipmentById(String id) {
        return equipmentRepository.findBySerialNumber(id);
    }

    
    
    
    
    /**
     * Update equipment details and add new documents if provided.
     */
    
    public Equipment updateEquipment(
            String id,
            String name,
            String serialNumber,
            String immobilizationNumber,
            String plant,
            String process,
            String state,
            String description,
            String type,
            List<MultipartFile> documents, // Changed key to "documents"
            String fileIdToReplace // New file ID to replace
    ) {
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(id);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();

            // Convert strings to enums for plant, process, and state if they are provided
            PlantType plantType = equipment.getPlant();
            ProcessType processType = equipment.getProcess();
            EquipmentState equipmentState = equipment.getState();

            // Update the values only if they are provided, otherwise, keep the existing values
            if (plant != null && !plant.isEmpty()) {
                try {
                    plantType = PlantType.valueOf(plant); // Convert string to PlantType enum
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid PlantType value: " + plant);
                }
            }

            if (process != null && !process.isEmpty()) {
                try {
                    processType = ProcessType.valueOf(process); // Convert string to ProcessType enum
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid ProcessType value: " + process);
                }
            }

            if (state != null && !state.isEmpty()) {
                try {
                    equipmentState = EquipmentState.valueOf(state); // Convert string to EquipmentState enum
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid EquipmentState value: " + state);
                }
            }

            // Update the fields of the existing equipment object, set existing value if null
            equipment.setName(name != null ? name : equipment.getName());
            equipment.setSerialNumber(serialNumber != null ? serialNumber : equipment.getSerialNumber());
            equipment.setImmobilizationNumber(immobilizationNumber != null ? immobilizationNumber : equipment.getImmobilizationNumber());
            equipment.setPlant(plantType); // Set the enum value
            equipment.setProcess(processType); // Set the enum value
            equipment.setState(equipmentState); // Set the enum value
            equipment.setDescription(description != null ? description : equipment.getDescription());
            equipment.setType(type != null ? type : equipment.getType());

            // If documents are provided, handle the file updates
            if (documents != null) {
                for (MultipartFile document : documents) {
                    try {
                        if (fileIdToReplace != null) {
                            // Find the document to replace using fileIdToReplace
                            for (int i = 0; i < equipment.getDocuments().size(); i++) {
                                DocumentEntity doc = equipment.getDocuments().get(i);
                                if (doc.getId().equals(fileIdToReplace)) {
                                    // Log deletion attempt
                                    System.out.println("Attempting to delete file with ID: " + fileIdToReplace);

                                    // Delete the old file from GridFS
                                    gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(fileIdToReplace))));
                                    System.out.println("Deleted file with ID: " + fileIdToReplace);

                                    // Store the new file in GridFS
                                    ObjectId newFileId = gridFsTemplate.store(document.getInputStream(), document.getOriginalFilename(), document.getContentType());
                                    System.out.println("New file stored with ID: " + newFileId);

                                    // Update the document entity with the new file
                                    DocumentEntity updatedDocument = new DocumentEntity(newFileId.toString(), document.getOriginalFilename(), "/files/" + newFileId, LocalDateTime.now());
                                    equipment.getDocuments().set(i, updatedDocument); // Replace the old document
                                    break; // Stop after replacing the document
                                }
                            }
                        } else {
                            // Add the new document if no file ID is provided to replace
                            ObjectId fileId = gridFsTemplate.store(document.getInputStream(), document.getOriginalFilename(), document.getContentType());
                            DocumentEntity doc = new DocumentEntity(fileId.toString(), document.getOriginalFilename(), "/files/" + fileId, LocalDateTime.now());
                            equipment.getDocuments().add(doc);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException("Error storing document: " + document.getOriginalFilename(), e);
                    }
                }
            }

            // Save the updated equipment object in the repository
            return equipmentRepository.save(equipment);
        }
        return null;
    }


    
    /**
     * Delete equipment by ID.
     */
    public void deleteEquipment(String id) {
        Optional<Equipment> optionalEquipment = equipmentRepository.findById(id);

        if (optionalEquipment.isPresent()) {
            Equipment equipment = optionalEquipment.get();

            // Delete each associated file from GridFS
            if (equipment.getDocuments() != null) {
                equipment.getDocuments().forEach(document -> {
                    String fileId =  document.getId(); // or document.getId() depending on your model
                    gridFsOperations.delete(Query.query(Criteria.where("_id").is(fileId)));
                });
            }

            // Now delete the equipment itself
            equipmentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Equipment not found with id: " + id);
        }
    }


    /**
     * Add a document to existing equipment.
     */
    public Equipment addDocumentToEquipment(String equipmentId, MultipartFile file) {
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();
            try {
                ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
                DocumentEntity document = new DocumentEntity(fileId.toString(), file.getOriginalFilename(), "/files/" + fileId, LocalDateTime.now());
                equipment.getDocuments().add(document);
                return equipmentRepository.save(equipment);
            } catch (IOException e) {
                throw new RuntimeException("Error storing file: " + file.getOriginalFilename(), e);
            }
        }
        return null;
    }

    /**
     * Remove a document from an equipment.
     */
    public Equipment removeDocumentFromEquipment(String equipmentId, String documentId) {
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();
            equipment.getDocuments().removeIf(doc -> doc.getId().equals(documentId));
            return equipmentRepository.save(equipment);
        }
        return null;
    }
    
    
    // Update only a specific document of a specific equipment
    public Equipment updateDocumentOfEquipment(
            String equipmentId,
            String fileIdToReplace,
            MultipartFile newFile
    ) {
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isPresent()) {
            Equipment equipment = equipmentOpt.get();

            // Find the document to replace by its fileId
            for (int i = 0; i < equipment.getDocuments().size(); i++) {
                DocumentEntity doc = equipment.getDocuments().get(i);
                if (doc.getId().equals(fileIdToReplace)) {
                    try {
                        // Delete the old file from GridFS
                        gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(fileIdToReplace))));

                        // Store the new file in GridFS
                        ObjectId newFileId = gridFsTemplate.store(newFile.getInputStream(), newFile.getOriginalFilename(), newFile.getContentType());

                        // Create the updated document entity
                        DocumentEntity updatedDocument = new DocumentEntity(
                                newFileId.toString(),
                                newFile.getOriginalFilename(),
                                "/files/" + newFileId,
                                LocalDateTime.now()
                        );

                        // Replace the old document with the new one
                        equipment.getDocuments().set(i, updatedDocument);
                        equipmentRepository.save(equipment);  // Save the updated equipment

                        return equipment;

                    } catch (IOException e) {
                        throw new RuntimeException("Error updating document: " + newFile.getOriginalFilename(), e);
                    }
                }
            }
        }
        return null;  // Return null if equipment or document not found
    }
    
    
}
