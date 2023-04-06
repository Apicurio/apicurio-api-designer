package io.apicurio.designer.rest.v0.impl;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.designer.common.MediaTypes;
import io.apicurio.designer.rest.v0.DesignsResource;
import io.apicurio.designer.rest.v0.beans.CreateDesignEvent;
import io.apicurio.designer.rest.v0.beans.Design;
import io.apicurio.designer.rest.v0.beans.DesignEvent;
import io.apicurio.designer.rest.v0.beans.DesignOriginType;
import io.apicurio.designer.rest.v0.beans.DesignSearchResults;
import io.apicurio.designer.rest.v0.beans.EditableDesignMetadata;
import io.apicurio.designer.rest.v0.beans.SortBy;
import io.apicurio.designer.rest.v0.beans.SortOrder;
import io.apicurio.designer.service.DesignService;
import io.apicurio.designer.spi.storage.model.DesignMetadataDto;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignsResourceImpl implements DesignsResource {

    @Inject
    DesignService designService;

    @Override
    public DesignSearchResults getDesigns(String name, SortOrder order, SortBy orderby, String description,
            String type, Integer pageSize, Integer page) {
        page = page != null ? page : 1;
        pageSize = pageSize != null ? pageSize : 10;
        // Note: the design service has page # as zero-based
        var list = designService.getDesignMetadataList(page - 1, pageSize);
        int total = (int) designService.countDesigns();
        return DesignSearchResults.builder().kind("DesignSearchResults").count(total).page(page).pageSize(pageSize)
                .designs(list.stream().map(this::convert).toList())
                .build();
    }

    /**
     * @see io.apicurio.designer.rest.v0.DesignsResource#createDesign(java.lang.String, java.lang.String, java.lang.String, io.apicurio.designer.rest.v0.beans.DesignOriginType, java.io.InputStream)
     */
    @Override
    public Design createDesign(String xDesignerName, String xDesignerDescription, String xDesignerType,
            DesignOriginType xDesignerOrigin, InputStream data) {
        if (xDesignerOrigin == null) {
            xDesignerOrigin = DesignOriginType.create;
        }
        if (xDesignerName.startsWith("==")) {
            xDesignerName = decodeHeaderValue(xDesignerName);
        }
        if (xDesignerDescription.startsWith("==")) {
            xDesignerDescription = decodeHeaderValue(xDesignerDescription);
        }
        
        // FIXME handle "origin" rather than "source"
        var metadata = DesignMetadataDto.builder().name(xDesignerName).description(xDesignerDescription)
                .type(xDesignerType).source(xDesignerOrigin.name()).build();
        return convert(designService.createDesign(metadata, ContentHandle.create(data)));
    }

    @Override
    public Response getDesign(String designId) {
        var content = designService.getDesignContent(designId);
        return Response.ok(content.string(), MediaTypes.BINARY).build();
    }

    @Override
    public Design updateDesign(String designId, InputStream data) {
        return convert(designService.updateDesignContent(designId, ContentHandle.create(data)));
    }

    @Override
    public void deleteDesign(String designId) {
        designService.deleteDesign(designId);
    }

    @Override
    public Design getDesignMetadata(String designId) {
        return convert(designService.getDesignMetadata(designId));
    }

    @Override
    public Design updateDesignMetadata(String designId, EditableDesignMetadata editableMetadata) {
        var metadata = designService.getDesignMetadata(designId);
        setIfNotNull(editableMetadata.getName(), metadata::setName);
        setIfNotNull(editableMetadata.getDescription(), metadata::setDescription);
        return convert(designService.updateDesignMetadata(designId, metadata));
    }

    private Design convert(DesignMetadataDto from) {
        // FIXME handle Origin better?
        return Design.builder().id(from.getId()).kind("DesignMetadata")
                .href("/apis/designer/v0/designs/" + from.getId()).name(from.getName())
                .description(from.getDescription()).type(from.getType()).origin(DesignOriginType.fromValue(from.getSource()))
                .createdOn(Date.from(from.getCreatedOn())).createdBy(from.getCreatedBy())
                .modifiedOn(Date.from(from.getModifiedOn())).modifiedBy(from.getModifiedBy()).build();
    }

    private <T> void setIfNotNull(T data, Consumer<T> setter) {
        if (data != null) {
            setter.accept(data);
        }
    }

    /**
     * @see io.apicurio.designer.rest.v0.DesignsResource#getAllDesignEvents(java.lang.String)
     */
    @Override
    public List<DesignEvent> getAllDesignEvents(String designId) {
        List<DesignEvent> events = new ArrayList<>();
        return events;
    }

    /**
     * @see io.apicurio.designer.rest.v0.DesignsResource#createDesignEvent(java.lang.String, io.apicurio.designer.rest.v0.beans.CreateDesignEvent)
     */
    @Override
    public DesignEvent createDesignEvent(String designId, CreateDesignEvent data) {
        return DesignEvent.builder()
                .designId(designId)
                .id(UUID.randomUUID().toString())
                .kind("DesignEvent")
                .on(new Date())
                .build();
    }

    private static String decodeHeaderValue(String encodedString) {
        if (encodedString.length() == 2) {
            return "";
        }
        byte[] decodedBytes = Base64.getDecoder().decode(encodedString.substring(2));
        return new String(decodedBytes, StandardCharsets.UTF_8);
    }

}
