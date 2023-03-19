package io.apicurio.designer.storage.postgres;

import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.designer.spi.storage.DesignerStorage;
import io.apicurio.designer.storage.common.AbstractSqlDesignerStorage;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;

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
}
