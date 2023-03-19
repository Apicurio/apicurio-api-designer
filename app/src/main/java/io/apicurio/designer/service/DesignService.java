package io.apicurio.designer.service;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.designer.spi.storage.DesignerStorage;
import io.apicurio.designer.spi.storage.model.DesignMetadataDto;

import java.time.Instant;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignService {

    @Inject
    DesignerStorage storage;

    public DesignMetadataDto createDesign(@NotNull DesignMetadataDto metadata, @NotNull ContentHandle content) {
        var now = Instant.now();
        var user = "user";
        metadata.setCreatedOn(now);
        metadata.setCreatedBy(user);
        metadata.setModifiedOn(now);
        metadata.setModifiedBy(user);
        return storage.createDesign(metadata, content);
    }

    public ContentHandle getDesignContent(@NotBlank String designId) {
        return storage.getDesignContent(designId);
    }

    public DesignMetadataDto updateDesignContent(@NotBlank String designId, @NotNull ContentHandle content) {
        // TODO Check if data changed?
        var metadata = storage.getDesignMetadata(designId);
        var now = Instant.now();
        var user = "user";
        metadata.setModifiedOn(now);
        metadata.setModifiedBy(user);
        storage.updateDesignMetadata(designId, metadata);
        return storage.updateDesignContent(designId, content);
    }

    public DesignMetadataDto getDesignMetadata(@NotBlank String designId) {
        return storage.getDesignMetadata(designId);
    }

    public DesignMetadataDto updateDesignMetadata(@NotBlank String designId, @NotNull DesignMetadataDto updatedMetadata) {
        var metadata = storage.getDesignMetadata(designId);
        if (!metadata.equals(updatedMetadata)) {
            var now = Instant.now();
            var user = "user";
            updatedMetadata.setModifiedOn(now);
            updatedMetadata.setModifiedBy(user);
            return storage.updateDesignMetadata(designId, updatedMetadata);
        } else {
            return metadata;
        }
    }

    public List<DesignMetadataDto> getDesignMetadataList(@Min(0) int page, @Min(10) @Max(100) int size) {
        return storage.getDesignMetadataList(page, size);
    }

    public long countDesigns() {
        return storage.countDesigns();
    }

    public void deleteDesign(@NotBlank String designId) {
        storage.deleteDesign(designId);
    }
}
