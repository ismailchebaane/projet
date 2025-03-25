package com.example.backend.Equipment;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor

@Document(collection = "Equipment")
public class Equipment {

    @Id
    private String id;
    private String name;
    private String serialNumber;
    private String immobilizationNumber;
    private PlantType plant;
    private ProcessType process;
    private EquipmentState state;
    private String description;
    private String type;
    private List<DocumentEntity> documents;

    // Constructor without 'id' as MongoDB generates it
    public Equipment(String name, String serialNumber, String immobilizationNumber, 
                     PlantType plant, ProcessType process, EquipmentState state, 
                     String description, String type, List<DocumentEntity> documents) {
        this.name = name;
        this.serialNumber = serialNumber;
        this.immobilizationNumber = immobilizationNumber;
        this.plant = plant;
        this.process = process;
        this.state = state;
        this.description = description;
        this.type = type;
        this.documents = documents;
    }
}
