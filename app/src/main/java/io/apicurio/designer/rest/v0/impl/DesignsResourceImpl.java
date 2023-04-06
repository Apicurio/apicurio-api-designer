package io.apicurio.designer.rest.v0.impl;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.designer.auth.Authorized;
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
import io.apicurio.designer.rest.v0.impl.ex.BadRequestException;
import io.apicurio.designer.service.DesignEventService;
import io.apicurio.designer.service.DesignService;
import io.apicurio.designer.spi.storage.ResourceNotFoundStorageException;
import io.apicurio.designer.spi.storage.SearchQuerySpecification.SearchOrdering;
import io.apicurio.designer.spi.storage.SearchQuerySpecification.SearchQuery;
import io.apicurio.designer.spi.storage.model.DesignMetadataDto;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.function.Consumer;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.core.Response;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignsResourceImpl implements DesignsResource {

    @Inject
    DesignService designService;

    @Inject
    DesignEventService eventService;

    @Override
    @Authorized
    public DesignSearchResults getDesigns(String name, SortOrder order, SortBy orderby, String description,
                                          String type, Integer pageSize, Integer page) {
        // TODO Do we want to limit max page size?
        if (page != null && page < 0) {
            throw new ValidationException("Page index must not be negative");
        }

        var search = new SearchQuery()
                .column("name", name)
                .column("description", description)
                .column("type", type);

        order = order != null ? order : SortOrder.desc;
        // TODO Write the default ordering in API spec
        // TODO Sort by modifiedOn (best for UI) or createdOn (best for more consistent processing)
        orderby = orderby != null ? orderby : SortBy.modifiedOn;
        search.orderBy(orderby.name(), order == SortOrder.desc ? SearchOrdering.DESC : SearchOrdering.ASC);

        page = page != null ? page : 0;
        pageSize = pageSize != null ? pageSize : 20;

        search.limit(page * pageSize, pageSize);
        // TODO: Move vvv to service layer
        var list = designService.searchDesignMetadata(search);
        int total = (int) designService.countDesigns(); // TODO Check cast
        return DesignSearchResults.builder()
                .kind("DesignSearchResults")
                .count(total)
                .page(page)
                .pageSize(pageSize)
                .designs(list.stream().map(this::convert).toList())
                .build();
    }

    /**
     * @see io.apicurio.designer.rest.v0.DesignsResource#createDesign(java.lang.String, java.lang.String, java.lang.String, io.apicurio.designer.rest.v0.beans.DesignOriginType, java.io.InputStream)
     */
    @Override
    @Authorized
    public Design createDesign(String xDesignerName, String xDesignerDescription, String xDesignerType,
                               DesignOriginType xDesignerOrigin, InputStream data) {

        BadRequestException.requireNotNullAnd(xDesignerName, "Valid 'X-Designer-Name' header is required.", p -> !p.isBlank());
        BadRequestException.requireNotNullAnd(xDesignerType, "Valid 'X-Designer-Type' header is required.", p -> !p.isBlank());
        BadRequestException.requireNotNullAnd(xDesignerOrigin, "Valid 'X-Designer-Origin' header is required.", p -> true);

        if (xDesignerName.startsWith("==")) {
            xDesignerName = decodeHeaderValue(xDesignerName);
        }
        if (xDesignerDescription != null && xDesignerDescription.startsWith("==")) {
            xDesignerDescription = decodeHeaderValue(xDesignerDescription);
        }

        var metadata = DesignMetadataDto.builder()
                .name(xDesignerName)
                .description(xDesignerDescription)
                .type(xDesignerType)
                .origin(xDesignerOrigin.name())
                .build();
        return convert(designService.createDesign(metadata, ContentHandle.create(data)));
    }

    @Override
    @Authorized
    public Response getDesign(String designId) {
        var content = designService.getDesignContent(designId);
        return Response.ok(content.string(), MediaTypes.BINARY).build();
    }

    @Override
    @Authorized
    public Design updateDesign(String designId, InputStream data) {
        return convert(designService.updateDesignContent(designId, ContentHandle.create(data)));
    }

    @Override
    @Authorized
    public void deleteDesign(String designId) {
        designService.deleteDesign(designId);
    }

    @Override
    @Authorized
    public Design getDesignMetadata(String designId) {
        return convert(designService.getDesignMetadata(designId));
    }

    @Override
    @Authorized
    public Design updateDesignMetadata(String designId, EditableDesignMetadata editableMetadata) {
        var metadata = designService.getDesignMetadata(designId);
        setIfNotNull(editableMetadata.getName(), metadata::setName);
        setIfNotNull(editableMetadata.getDescription(), metadata::setDescription);
        return convert(designService.updateDesignMetadata(designId, metadata));
    }

    /**
     * @see io.apicurio.designer.rest.v0.DesignsResource#getFirstEvent(java.lang.String)
     */
    @Override
    public DesignEvent getFirstEvent(String designId) {
        // TODO This endpoint feels really hacky. Use paging.
        return getAllDesignEvents(designId).stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundStorageException("There is no first event yet."));
    }

    private static String decodeHeaderValue(String encodedString) {
        if (encodedString.length() == 2) {
            return "";
        }
        byte[] decodedBytes = Base64.getDecoder().decode(encodedString.substring(2));
        return new String(decodedBytes, StandardCharsets.UTF_8);
    }

    private Design convert(DesignMetadataDto from) {
        return Design.builder()
                .id(from.getId())
                .kind("DesignMetadata")
                .href("/apis/designer/v0/designs/" + from.getId())
                .name(from.getName())
                .description(from.getDescription())
                .type(from.getType())
                .origin(DesignOriginType.fromValue(from.getOrigin()))
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

    /**
     * @see io.apicurio.designer.rest.v0.DesignsResource#getAllDesignEvents(java.lang.String)
     */
    @Override
    public List<DesignEvent> getAllDesignEvents(String designId) {
        return eventService.getAllDesignEvents(designId);
    }

    /**
     * @see io.apicurio.designer.rest.v0.DesignsResource#createDesignEvent(java.lang.String, io.apicurio.designer.rest.v0.beans.CreateDesignEvent)
     */
    @Override
    public DesignEvent createDesignEvent(String designId, CreateDesignEvent data) {
        return eventService.createDesignEvent(designId, data);
    }
}
