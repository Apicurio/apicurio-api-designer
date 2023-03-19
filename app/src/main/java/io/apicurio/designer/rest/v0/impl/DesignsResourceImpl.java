package io.apicurio.designer.rest.v0.impl;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.designer.common.MediaTypes;
import io.apicurio.designer.rest.v0.DesignsResource;
import io.apicurio.designer.rest.v0.beans.DesignMetaData;
import io.apicurio.designer.rest.v0.beans.DesignMetaDataList;
import io.apicurio.designer.rest.v0.beans.EditableDesignMetadata;
import io.apicurio.designer.service.DesignService;
import io.apicurio.designer.spi.storage.model.DesignMetadataDto;

import java.io.InputStream;
import java.util.Date;
import java.util.function.Consumer;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignsResourceImpl implements DesignsResource {

    @Inject
    DesignService designService;

    @Override
    public DesignMetaDataList getDesigns(Integer size, Integer page) {
        page = page != null ? page : 0;
        size = size != null ? size : 10;
        var list = designService.getDesignMetadataList(size, page);
        var total = designService.countDesigns();
        return DesignMetaDataList.builder()
                .kind("DesignMetaDataList")
                .page(page)
                .size(size)
                .total((int) total)
                .items(list.stream().map(this::convert).toList())
                .build();
    }

    @Override
    public DesignMetaData createDesign(String xDesignerName, String xDesignerDescription, String xDesignerType, String xDesignerSource, InputStream data) {
        var metadata = DesignMetadataDto.builder()
                .name(xDesignerName)
                .description(xDesignerDescription)
                .type(xDesignerType)
                .source(xDesignerSource)
                .build();
        return convert(designService.createDesign(metadata, ContentHandle.create(data)));
    }

    @Override
    public Response getDesign(String designId) {
        var content = designService.getDesignContent(designId);
        return Response.ok(content.string(), MediaTypes.BINARY).build();
    }

    @Override
    public DesignMetaData updateDesign(String designId, InputStream data) {
        return convert(designService.updateDesignContent(designId, ContentHandle.create(data)));
    }

    @Override
    public void deleteDesign(String designId) {
        designService.deleteDesign(designId);
    }

    @Override
    public DesignMetaData getDesignMetadata(String designId) {
        return convert(designService.getDesignMetadata(designId));
    }

    @Override
    public DesignMetaData updateDesignMetadata(String designId, EditableDesignMetadata editableMetadata) {
        var metadata = designService.getDesignMetadata(designId);
        setIfNotNull(editableMetadata.getName(), metadata::setName);
        setIfNotNull(editableMetadata.getDescription(), metadata::setDescription);
        setIfNotNull(editableMetadata.getType(), metadata::setType);
        setIfNotNull(editableMetadata.getSource(), metadata::setSource);
        return convert(designService.updateDesignMetadata(designId, metadata));
    }

    private DesignMetaData convert(DesignMetadataDto from) {
        return DesignMetaData.builder()
                .id(from.getId())
                .kind("DesignMetadata")
                .href("/apis/designer/v0/designs/" + from.getId())
                .name(from.getName())
                .description(from.getDescription())
                .type(from.getType())
                .source(from.getSource())
                .createdOn(Date.from(from.getCreatedOn()))
                .createdBy(from.getCreatedBy())
                .modifiedOn(Date.from(from.getModifiedOn()))
                .modifiedBy(from.getModifiedBy())
                .build();
    }

    private <T> void setIfNotNull(T data, Consumer<T> setter) {
        if (data != null) {
            setter.accept(data);
        }
    }
}
