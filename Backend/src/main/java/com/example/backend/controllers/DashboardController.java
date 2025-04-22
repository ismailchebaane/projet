package com.example.backend.controllers;


import com.example.backend.Equipment.Equipment;
import com.example.backend.Equipment.EquipmentState;
import com.example.backend.Equipment.ProcessType;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.bson.Document;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

import java.util.*;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor

public class DashboardController {

    private final EquipmentRepository equipmentRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        long total = equipmentRepository.count();
        long approved = equipmentRepository.countByState(EquipmentState.Validated);
        long pending = equipmentRepository.countByState(EquipmentState.Pending);

        long documentCount = equipmentRepository.findAll().stream()
                .flatMap(e -> e.getDocuments().stream())
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("addedEquipment", total);
        response.put("addedEquipmentChange", "+10"); // Static change, replace with real if needed
        response.put("approvedEquipment", approved);
        response.put("approvedEquipmentChange", "+5");
        response.put("pendingEquipment", pending);
        response.put("pendingEquipmentChange", "-2");
        response.put("addedDocuments", documentCount);
        response.put("addedDocumentsChange", "+7");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pie")
    public ResponseEntity<List<Map<String, Object>>> getEquipmentByType() {
        List<Equipment> all = equipmentRepository.findAll();
        Map<String, Long> grouped = all.stream()
                .collect(Collectors.groupingBy(Equipment::getType, Collectors.counting()));

        List<Map<String, Object>> response = grouped.entrySet().stream().map(entry -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", entry.getKey());
            map.put("value", entry.getValue());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/bar")
    public ResponseEntity<List<Map<String, Object>>> getEquipmentByProcessAndPlant() {
        List<Equipment> all = equipmentRepository.findAll();
        Map<String, Map<String, Long>> matrix = new HashMap<>();

        for (Equipment eq : all) {
            String process = eq.getProcess().name();
            String plant = eq.getPlant().name();
            matrix.computeIfAbsent(process, k -> new HashMap<>());
            matrix.get(process).merge(plant, 1L, Long::sum);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Map<String, Long>> entry : matrix.entrySet()) {
            Map<String, Object> row = new HashMap<>();
            row.put("process", entry.getKey());
            row.putAll(entry.getValue());
            result.add(row);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/line")
    public ResponseEntity<List<Map<String, Object>>> getProcessTrends() {
        List<Equipment> all = equipmentRepository.findAll();
        Map<String, Long> grouped = all.stream()
                .collect(Collectors.groupingBy(e -> e.getProcess().name(), Collectors.counting()));

        List<Map<String, Object>> response = grouped.entrySet().stream().map(entry -> {
            Map<String, Object> map = new HashMap<>();
            map.put("process", entry.getKey());
            map.put("value", entry.getValue());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/good-machines")
    public ResponseEntity<Map<String, Integer>> getGoodMachines() {
        int good = (int) equipmentRepository.countByState(EquipmentState.Validated);
        int total = (int) equipmentRepository.count();
        return ResponseEntity.ok(Map.of("good", good, "total", total));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<Map<String, String>>> getRecentActivity() {
        List<Equipment> recent = equipmentRepository.findTop10ByOrderByIdDesc();

        List<Map<String, String>> response = recent.stream()
                .map(eq -> Map.of(
                        "code", eq.getSerialNumber(),
                        "machine", eq.getName(),
                        "date", LocalDate.now().toString(), // Use createdAt if available
                        "plant", eq.getPlant().name()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
