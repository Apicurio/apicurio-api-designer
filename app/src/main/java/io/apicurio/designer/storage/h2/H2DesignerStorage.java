package io.apicurio.designer.storage.h2;

import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.designer.spi.storage.DesignerStorage;
import io.apicurio.designer.storage.common.AbstractSqlDesignerStorage;
import io.quarkus.arc.DefaultBean;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
@DefaultBean
public class H2DesignerStorage extends AbstractSqlDesignerStorage implements DesignerStorage {

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
}
