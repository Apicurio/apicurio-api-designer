package io.apicurio.designer.storage.h2;

import io.apicurio.common.apps.config.DynamicConfigPropertyDto;
import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.designer.spi.storage.DesignerStorage;
import io.apicurio.designer.storage.common.AbstractSqlDesignerStorage;
import io.quarkus.arc.DefaultBean;
import jakarta.annotation.PostConstruct;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
@DefaultBean
public class H2DesignerStorage extends AbstractSqlDesignerStorage implements DesignerStorage {

    Map<String, String> properties = new HashMap<>();

    @Inject
    LoggerProducer loggerProducer;

    @Override
    @PostConstruct
    @Transactional
    protected void init() {
        storageEngine.start(loggerProducer, handles, BaseSqlStorageComponent.Configuration.builder()
                .sqlStatements(sqlStatements)
                .supportsAtomicSequenceIncrement(false)
                .ddlDirRootPath("META-INF/storage/schema")
                .build());
    }

    @Override
    public boolean isReady() {
        return true;
    }

    @Override
    public DynamicConfigPropertyDto getConfigProperty(String propertyName) {
        String value = properties.get(propertyName);
        return new DynamicConfigPropertyDto(propertyName, value);
    }

    @Override
    public void setConfigProperty(DynamicConfigPropertyDto propertyDto) {
        properties.put(propertyDto.getName(), propertyDto.getValue());
    }

    @Override
    public void deleteConfigProperty(String propertyName) {
        properties.remove(propertyName);
    }

    @Override
    public List<DynamicConfigPropertyDto> getConfigProperties() {
        return null;
    }
}
