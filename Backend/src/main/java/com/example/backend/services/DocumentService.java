package com.example.backend.services;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class DocumentService {

    @Autowired
    private GridFsOperations gridFsOperations;

    public String uploadFile(MultipartFile file) throws IOException {
        ObjectId fileId = gridFsOperations.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
        return fileId.toString();
    }

    public GridFsResource getFile(String fileId) {
        GridFSFile file = gridFsOperations.findOne(query(where("_id").is(fileId)));
        return gridFsOperations.getResource(file);
    }

    public void deleteFile(String fileId) {
        gridFsOperations.delete(query(where("_id").is(fileId)));
    }
}
