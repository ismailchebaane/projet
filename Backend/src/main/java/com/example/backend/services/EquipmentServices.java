package com.example.backend.services;

import com.example.backend.Equipment.Equipment;
import com.example.backend.Equipment.EquipmentState;
import com.example.backend.Equipment.PlantType;
import com.example.backend.Equipment.ProcessType;
import com.example.backend.Equipment.DocumentEntity;
import com.example.backend.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsCriteria;
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

    /**
     * Add equipment along with its documents in a single request.
     */

    public Equipment addEquipment( 
            String name, String serialNumber, String immobilizationNumber,
            String plant, String process, String state, String description, String type,
            List<MultipartFile> files) {

        // Convert strings to enums
        PlantType plantType = null;
        ProcessType processType = null;
        EquipmentState equipmentState = null;

        try {
            plantType = PlantType.valueOf(plant); // Convert plant string to PlantType enum
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid PlantType value: " + plant);
        }

        try {
            processType = ProcessType.valueOf(process); // Convert process string to ProcessType enum
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ProcessType value: " + process);
        }

        try {
            equipmentState = EquipmentState.valueOf(state); // Convert state string to EquipmentState enum
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid EquipmentState value: " + state);
        }

        // Store documents in GridFS
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
                plantType,  // Pass the enum value here
                processType, // Pass the enum value here
                equipmentState, // Pass the enum value here
                description, 
                type, 
                documentEntities
        );

        return equipmentRepository.save(equipment); // Save the equipment
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
        return equipmentRepository.findById(id);
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
    	    List<MultipartFile> files, 
    	    String fileIdToReplace // New file ID to replace
    	) {
    	    Optional<Equipment> equipmentOpt = equipmentRepository.findById(id);
    	    if (equipmentOpt.isPresent()) {
    	        Equipment equipment = equipmentOpt.get();

    	        // Convert strings to enums for plant, process, and state
    	        PlantType plantType = null;
    	        ProcessType processType = null;
    	        EquipmentState equipmentState = null;

    	        try {
    	            plantType = PlantType.valueOf(plant); // Convert string to PlantType enum
    	        } catch (IllegalArgumentException e) {
    	            throw new IllegalArgumentException("Invalid PlantType value: " + plant);
    	        }

    	        try {
    	            processType = ProcessType.valueOf(process); // Convert string to ProcessType enum
    	        } catch (IllegalArgumentException e) {
    	            throw new IllegalArgumentException("Invalid ProcessType value: " + process);
    	        }

    	        try {
    	            equipmentState = EquipmentState.valueOf(state); // Convert string to EquipmentState enum
    	        } catch (IllegalArgumentException e) {
    	            throw new IllegalArgumentException("Invalid EquipmentState value: " + state);
    	        }

    	        // Update the fields of the existing equipment object
    	        equipment.setName(name);
    	        equipment.setSerialNumber(serialNumber);
    	        equipment.setImmobilizationNumber(immobilizationNumber);
    	        equipment.setPlant(plantType); // Set the enum value
    	        equipment.setProcess(processType); // Set the enum value
    	        equipment.setState(equipmentState); // Set the enum value
    	        equipment.setDescription(description);
    	        equipment.setType(type);

    	        // If files are provided, handle the file updates
    	        if (files != null) {
    	            for (MultipartFile file : files) {
    	                try {
    	                    if (fileIdToReplace != null) {
    	                        // Find the file to replace using fileIdToReplace
    	                        for (int i = 0; i < equipment.getDocuments().size(); i++) {
    	                            DocumentEntity document = equipment.getDocuments().get(i);
    	                            if (document.getId().equals(fileIdToReplace)) {
    	                                // Replace the existing file with the new file
    	                            	gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(fileIdToReplace))));

    	                                ObjectId newFileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
    	                                DocumentEntity updatedDocument = new DocumentEntity(newFileId.toString(), file.getOriginalFilename(), "/files/" + newFileId, LocalDateTime.now());
    	                                equipment.getDocuments().set(i, updatedDocument); // Replace the old document
    	                                break; // Stop after replacing the file
    	                            }
    	                        }
    	                    } else {
    	                        // Add the new file as a new document if no file ID is provided to replace
    	                        ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
    	                        DocumentEntity document = new DocumentEntity(fileId.toString(), file.getOriginalFilename(), "/files/" + fileId, LocalDateTime.now());
    	                        equipment.getDocuments().add(document);
    	                    }
    	                } catch (IOException e) {
    	                    throw new RuntimeException("Error storing file: " + file.getOriginalFilename(), e);
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
        equipmentRepository.deleteById(id);
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
}
