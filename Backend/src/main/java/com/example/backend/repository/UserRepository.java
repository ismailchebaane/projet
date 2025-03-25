package com.example.backend.repository;
import com.example.backend.user.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {


    Optional<User> findByUsername(String username);

    Optional<User> findByMatricule(String matricule);
}
