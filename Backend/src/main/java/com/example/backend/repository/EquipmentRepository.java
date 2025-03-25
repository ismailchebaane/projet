package com.example.backend.repository;

import com.example.backend.Equipment.*;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EquipmentRepository extends MongoRepository<Equipment, String> {
}
