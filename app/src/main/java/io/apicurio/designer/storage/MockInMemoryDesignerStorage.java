package io.apicurio.designer.storage;

import io.apicurio.designer.common.io.content.ContentHandle;
import io.apicurio.designer.spi.storage.DesignNotFoundException;
import io.apicurio.designer.spi.storage.DesignerStorage;
import io.apicurio.designer.spi.storage.StorageException;
import io.apicurio.designer.spi.storage.model.DesignMetadataDto;
import io.quarkus.arc.Lock;

import java.util.HashMap;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.UUID;
import javax.enterprise.context.ApplicationScoped;

/**
 * @author Jakub Senko <m@jsenko.net>
 */
@ApplicationScoped
@Lock
public class MockInMemoryDesignerStorage implements DesignerStorage {

    private final HashMap<String, ContentHandle> contentMap = new HashMap<>();
    private final SortedMap<String, DesignMetadataDto> metadataMap = new TreeMap<>();

    private String getFreshId() {
        String id;
        do {
            id = UUID.randomUUID().toString();
        } while (contentMap.containsKey(id));
        return id;
    }

    @Override
    public DesignMetadataDto createDesign(DesignMetadataDto metadata, ContentHandle content) {
        if (metadata.getId() != null) {
            throw new StorageException("Design ID must be empty");
        }
        metadata.setId(getFreshId());
        contentMap.put(metadata.getId(), content);
        metadataMap.put(metadata.getId(), metadata);
        return copy(metadata);
    }

    @Override
    public ContentHandle getDesignContent(String designId) {
        if (designId == null) {
            throw new StorageException("Design ID is empty");
        }
        var content = contentMap.get(designId);
        if (content == null) {
            throw new DesignNotFoundException("Design with ID %s not found".formatted(designId));
        }
        return content;
    }

    @Override
    public DesignMetadataDto updateDesignContent(String designId, ContentHandle content) {
        if (getDesignContent(designId) == null) {
            throw new DesignNotFoundException("Design with ID %s not found".formatted(designId));
        }
        contentMap.put(designId, content);
        return copy(metadataMap.get(designId));
    }

    @Override
    public DesignMetadataDto getDesignMetadata(String designId) {
        if (getDesignContent(designId) == null) {
            throw new DesignNotFoundException("Design with ID %s not found".formatted(designId));
        }
        return copy(metadataMap.get(designId));
    }

    @Override
    public DesignMetadataDto updateDesignMetadata(String designId, DesignMetadataDto metadata) {
        if (getDesignContent(designId) == null) {
            throw new DesignNotFoundException("Design with ID %s not found".formatted(designId));
        }
        metadataMap.put(designId, metadata);
        return copy(metadata);
    }

    @Override
    public List<DesignMetadataDto> getDesignMetadataList(int page, int size) {
        return metadataMap.values().stream().skip(page * size).limit(size).map(this::copy).toList();
    }

    @Override
    public long countDesigns() {
        return contentMap.size();
    }

    @Override
    public void deleteDesign(String designId) {
        if (getDesignContent(designId) == null) {
            throw new DesignNotFoundException("Design with ID %s not found".formatted(designId));
        }
        contentMap.remove(designId);
        metadataMap.remove(designId);
    }

    public DesignMetadataDto copy(DesignMetadataDto original) {
        return DesignMetadataDto.builder()
                .id(original.getId())
                .name(original.getName())
                .description(original.getDescription())
                .type(original.getType())
                .source(original.getSource())
                .createdBy(original.getCreatedBy())
                .createdOn(original.getCreatedOn())
                .modifiedBy(original.getModifiedBy())
                .modifiedOn(original.getModifiedOn())
                .build();
    }
}
