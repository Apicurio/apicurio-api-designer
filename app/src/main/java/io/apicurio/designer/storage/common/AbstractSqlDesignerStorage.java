package io.apicurio.designer.storage.common;

import io.apicurio.common.apps.config.DynamicConfigPropertyDto;
import io.apicurio.common.apps.config.impl.storage.DynamicConfigSqlStorageComponent;
import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.common.apps.multitenancy.TenantContext;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.common.apps.storage.sql.jdbi.HandleFactory;
import io.apicurio.designer.spi.storage.DesignerSqlStatements;
import io.apicurio.designer.spi.storage.DesignerStorage;
import io.apicurio.designer.spi.storage.DesignerStorageException;
import io.apicurio.designer.spi.storage.SearchQuerySpecification.SearchQuery;
import io.apicurio.designer.spi.storage.model.DesignDto;
import io.apicurio.designer.spi.storage.model.DesignEventDto;
import io.apicurio.designer.spi.storage.model.DesignMetadataDto;
import org.slf4j.Logger;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static io.apicurio.common.apps.storage.sql.jdbi.query.Sql.RESOURCE_CONTEXT_KEY;
import static io.apicurio.common.apps.storage.sql.jdbi.query.Sql.RESOURCE_IDENTIFIER_CONTEXT_KEY;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public abstract class AbstractSqlDesignerStorage implements DesignerStorage {

    protected static String CONTENT_SEQUENCE_KEY = "content";
    protected static String DESIGN_EVENT_SEQUENCE_KEY = "design_event";

    @Inject
    protected HandleFactory handles;

    @Inject
    protected DesignerSqlStatements sqlStatements;

    @Inject
    protected BaseSqlStorageComponent storageEngine;

    @Inject
    protected DynamicConfigSqlStorageComponent dynamicConfigSqlStorageComponent;

    @Inject
    protected StorageExceptionMapper exceptionMapper;

    @Inject
    protected TenantContext tenantContext;

    @Inject
    Logger log;

    /**
     * The overriding method MUST be annotated with:
     * \@PostConstruct
     * \@Transactional
     */
    protected abstract void init();

    @Override
    @Transactional
    public DesignMetadataDto createDesign(DesignMetadataDto metadata, ContentHandle content) {

        // Create Content
        // TODO Deduplication
        var contentId = exceptionMapper.with(() ->
                storageEngine.nextSequenceValue(CONTENT_SEQUENCE_KEY)
        );
        handles.withHandleNoExceptionMapped(handle ->
                handle.createUpdate(sqlStatements.insertDesignContent())
                        .setContext(RESOURCE_CONTEXT_KEY, "content")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, String.valueOf(contentId))
                        .bind(0, tenantContext.tenantId())
                        .bind(1, contentId) // TODO Nested handle
                        .bind(2, content.getSha256Hash())
                        .bind(3, content)
                        .execute()
        );

        // Create Design
        var designId = UUID.randomUUID().toString();
        handles.withHandleNoExceptionMapped(handle ->
                handle.createUpdate(sqlStatements.insertDesign())
                        .setContext(RESOURCE_CONTEXT_KEY, "design")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, tenantContext.tenantId())
                        .bind(1, designId)
                        .bind(2, contentId)
                        .execute()
        );

        // Create Metadata
        metadata.setId(designId);
        metadata.setCreatedBy("TODO");
        metadata.setCreatedOn(Instant.now());
        metadata.setModifiedBy(metadata.getCreatedBy());
        metadata.setModifiedOn(metadata.getCreatedOn());
        handles.withHandleNoExceptionMapped(handle ->
                handle.createUpdate(sqlStatements.insertMetadata())
                        .setContext(RESOURCE_CONTEXT_KEY, "design metadata")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, metadata.getId())
                        .bind(0, tenantContext.tenantId())
                        .bind(1, metadata.getId())
                        .bind(2, metadata.getName())
                        .bind(3, metadata.getDescription())
                        .bind(4, metadata.getCreatedBy())
                        .bind(5, metadata.getCreatedOn())
                        .bind(6, metadata.getModifiedBy())
                        .bind(7, metadata.getModifiedOn())
                        .bind(8, metadata.getType())
                        .bind(9, metadata.getOrigin())
                        .execute()
        );

        return metadata;
    }

    @Override
    @Transactional
    public ContentHandle getDesignContent(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.selectContentByDesignId())
                        .setContext(RESOURCE_CONTEXT_KEY, "content")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, tenantContext.tenantId())
                        .bind(1, designId)
                        .mapTo(ContentHandle.class)
                        .one()
        );
    }

    @Override
    @Transactional
    public DesignMetadataDto updateDesignContent(String designId, ContentHandle content) {
        return handles.withHandleNoExceptionMapped(handle -> {

            handle.createUpdate(sqlStatements.updateContentByDesignId())
                    .setContext(RESOURCE_CONTEXT_KEY, "content")
                    .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                    .bind(0, content)
                    .bind(1, tenantContext.tenantId())
                    .bind(2, tenantContext.tenantId())
                    .bind(3, designId)
                    .execute();

            // TODO Touch Operation
            var metadata = getDesignMetadata(designId);
            updateDesignMetadata(designId, metadata);

            return metadata;
        });
    }

    @Override
    @Transactional
    public DesignMetadataDto getDesignMetadata(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.selectDesignMetadata())
                        .setContext(RESOURCE_CONTEXT_KEY, "content")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, tenantContext.tenantId())
                        .bind(1, designId)
                        .mapTo(DesignMetadataDto.class)
                        .one()
        );
    }

    @Override
    @Transactional
    public DesignMetadataDto updateDesignMetadata(String designId, DesignMetadataDto metadata) {
        return handles.withHandleNoExceptionMapped(handle -> {

            metadata.setModifiedBy("TODO");
            metadata.setModifiedOn(Instant.now());

            handle.createUpdate(sqlStatements.updateDesignMetadata())
                    .setContext(RESOURCE_CONTEXT_KEY, "design metadata")
                    .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, metadata.getId())
                    .bind(0, metadata.getName())
                    .bind(1, metadata.getDescription())
                    .bind(2, metadata.getCreatedBy())
                    .bind(3, metadata.getCreatedOn())
                    .bind(4, metadata.getModifiedBy())
                    .bind(5, metadata.getModifiedOn())
                    .bind(6, metadata.getType())
                    .bind(7, metadata.getOrigin())
                    .bind(8, tenantContext.tenantId())
                    .bind(9, metadata.getId())
                    .execute();

            return metadata;
        });
    }

    @Override
    @Transactional
    public List<DesignMetadataDto> searchDesignMetadata(SearchQuery search) {
        var spec = sqlStatements.searchDesignMetadataSpecification();

        spec.apply(search);
        log.warn("Search: {}", sqlStatements.searchDesignMetadata(spec));

        return handles.withHandleNoExceptionMapped(handle -> {
            var q = handle.createQuery(sqlStatements.searchDesignMetadata(spec))
                    .setContext(RESOURCE_CONTEXT_KEY, "design metadata")
                    .bind(0, tenantContext.tenantId());

            spec.bindWhere(1, q);

            return q.mapTo(DesignMetadataDto.class)
                    .list();
        });
    }

    @Override
    @Transactional
    public long countDesigns() {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.countDesigns())
                        .setContext(RESOURCE_CONTEXT_KEY, "design")
                        .bind(0, tenantContext.tenantId())
                        .mapTo(Long.class)
                        .one()
        );
    }

    @Override
    @Transactional
    public void deleteDesign(String designId) {
        var design = getDesign(designId);
        try {
            handles.withHandle(handle ->
                    handle.createUpdate(sqlStatements.deleteDesign())
                            .setContext(RESOURCE_CONTEXT_KEY, "design")
                            .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                            .bind(0, tenantContext.tenantId())
                            .bind(1, designId)
                            .execute()
            );
            handles.withHandle(handle ->
                    handle.createUpdate(sqlStatements.deleteDesignMetadata())
                            .setContext(RESOURCE_CONTEXT_KEY, "design metadata")
                            .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                            .bind(0, tenantContext.tenantId())
                            .bind(1, designId)
                            .execute()
            );
            handles.withHandle(handle ->
                    handle.createUpdate(sqlStatements.deleteDesignContent())
                            .setContext(RESOURCE_CONTEXT_KEY, "content")
                            .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, String.valueOf(design.getContentId()))
                            .bind(0, tenantContext.tenantId())
                            .bind(1, design.getContentId())
                            .execute()
            );
        } catch (StorageException ex) {
            throw new DesignerStorageException("Could not delete design with ID " + designId + ".", ex);
        }
    }

    @Transactional
    private DesignDto getDesign(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.selectDesign())
                        .setContext(RESOURCE_CONTEXT_KEY, "design")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, tenantContext.tenantId())
                        .bind(1, designId)
                        .mapTo(DesignDto.class)
                        .one()
        );
    }

    @Override
    public DynamicConfigPropertyDto getConfigProperty(String name) {
        return dynamicConfigSqlStorageComponent.getConfigProperty(name);
    }

    @Override
    public void setConfigProperty(DynamicConfigPropertyDto dynamicConfigPropertyDto) {
        dynamicConfigSqlStorageComponent.setConfigProperty(dynamicConfigPropertyDto);
    }

    @Override
    public void deleteConfigProperty(String name) {
        dynamicConfigSqlStorageComponent.deleteConfigProperty(name);
    }

    @Override
    public List<DynamicConfigPropertyDto> getConfigProperties() {
        return dynamicConfigSqlStorageComponent.getConfigProperties();
    }

    @Override
    @Transactional
    public DesignEventDto createDesignEvent(DesignEventDto event) {
        var eventId = exceptionMapper.with(() ->
                storageEngine.nextSequenceValue(DESIGN_EVENT_SEQUENCE_KEY)
        );
        event.setId(String.valueOf(eventId));
        event.setCreatedOn(Instant.now());
        handles.withHandleNoExceptionMapped(handle ->

                handle.createUpdate(sqlStatements.insertDesignEvent())
                        .setContext(RESOURCE_CONTEXT_KEY, "design event")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, event.getId())
                        .bind(0, tenantContext.tenantId())
                        .bind(1, event.getId())
                        .bind(2, event.getDesignId())
                        .bind(3, event.getCreatedOn())
                        .bind(4, event.getType())
                        .bind(5, event.getData())
                        .execute()
        );
        return event;
    }

    @Override
    public List<DesignEventDto> getDesignEvents(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->

                handle.createQuery(sqlStatements.selectDesignEvents())
                        .setContext(RESOURCE_CONTEXT_KEY, "design event")
                        .bind(0, tenantContext.tenantId())
                        .bind(1, designId)
                        .mapTo(DesignEventDto.class)
                        .list()
        );
    }
}
