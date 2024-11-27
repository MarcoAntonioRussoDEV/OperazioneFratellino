package it.operazione_fratellino.of_backend.services.implement;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStoreService {

    @Value("${uploadDir}")
    private String uploadDir;


    public String saveAvatar(MultipartFile file, Integer userID)throws IOException {
        String fileName = "avatar_" + userID;
        String fileExtension = "." + FilenameUtils.getExtension(file.getOriginalFilename());
        Path path = Paths.get(uploadDir + File.separator + "avatars" + File.separator + fileName + fileExtension);

        if (!Files.exists(path.getParent())) {
            Files.createDirectories(path.getParent());
        }

        Files.copy(file.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING);
        return path.toString();
    }

    public String saveImage(MultipartFile file, String productCode)throws IOException {
        String fileName = "product_" + productCode;
        String fileExtension = "." + FilenameUtils.getExtension(file.getOriginalFilename());
        Path path = Paths.get(uploadDir + File.separator + "products" + File.separator + fileName + fileExtension);

        if (!Files.exists(path.getParent())) {
            Files.createDirectories(path.getParent());
        }

        Files.copy(file.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING);
        return path.toString();
    }

}
