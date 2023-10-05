package io.apicurio.designer.storage.postgres;

import io.apicurio.common.apps.config.DynamicConfigPropertyDto;
import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.designer.spi.storage.DesignerStorage;
import io.apicurio.designer.storage.common.AbstractSqlDesignerStorage;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class PostgresDesignerStorage extends AbstractSqlDesignerStorage implements DesignerStorage {

    @Inject
    LoggerProducer loggerProducer;

    @Override
    @PostConstruct
    @Transactional
    protected void init() {
        storageEngine.start(loggerProducer, handles, BaseSqlStorageComponent.Configuration.builder()
                .sqlStatements(sqlStatements)
                .supportsAtomicSequenceIncrement(true)
                .ddlDirRootPath("META-INF/storage/schema")
                .build());
    }

    @Override
    public boolean isReady() {
        return true;
    }

    @Override
    public DynamicConfigPropertyDto getConfigProperty(String s) {
        return null;
    }

    @Override
    public void setConfigProperty(DynamicConfigPropertyDto dynamicConfigPropertyDto) {

    }

    @Override
    public void deleteConfigProperty(String s) {

    }

    @Override
    public List<DynamicConfigPropertyDto> getConfigProperties() {
        return null;
    }
}
