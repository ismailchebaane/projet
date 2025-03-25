package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.Equipment.*;
import java.util.List;
import com.example.backend.services.*;

import lombok.RequiredArgsConstructor;

import com.example.backend.repository.*;import org.springframework.beans.factory.annotation.Autowired;
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
    
    @GetMapping("/all")
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        List<Equipment> equipments = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipments);
    }
    
}