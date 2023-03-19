package io.apicurio.designer.spi.storage;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.designer.spi.storage.model.DesignMetadataDto;

import java.util.List;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public interface DesignerStorage {

    DesignMetadataDto createDesign(DesignMetadataDto metadata, ContentHandle content);

    ContentHandle getDesignContent(String designId);

    DesignMetadataDto updateDesignContent(String designId, ContentHandle content);

    DesignMetadataDto getDesignMetadata(String designId);

    DesignMetadataDto updateDesignMetadata(String designId, DesignMetadataDto metadata);

    List<DesignMetadataDto> getDesignMetadataList(int page, int size);

    long countDesigns();

    void deleteDesign(String designId);
}
