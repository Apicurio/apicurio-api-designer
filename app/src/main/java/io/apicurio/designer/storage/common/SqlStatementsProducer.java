package io.apicurio.designer.storage.common;

import io.apicurio.common.apps.config.Info;
import io.apicurio.common.apps.storage.sql.SqlStatements;
import io.apicurio.designer.spi.storage.DesignerSqlStatements;
import io.apicurio.designer.storage.h2.H2DesignerSqlStatements;
import io.apicurio.designer.storage.postgresql.PostgresDesignerSqlStatements;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;

@ApplicationScoped
public class SqlStatementsProducer {

    @Inject
    Logger log;

    @ConfigProperty(name = "apicurio.storage.db-kind", defaultValue = "h2")
    @Info(category = "storage", description = "Datasource Db kind", availableSince = "0.1.0.Final")
    String databaseType;

    /**
     * Produces an {@link SqlStatements} instance for injection.
     */
    @Produces
    @ApplicationScoped
    @Named("apicurioSqlStatements")
    public DesignerSqlStatements createSqlStatements() {
        log.debug("Creating an instance of ISqlStatements for DB: " + databaseType);
        if ("h2".equals(databaseType)) {
            return new H2DesignerSqlStatements();
        }
        if ("postgresql".equals(databaseType)) {
            return new PostgresDesignerSqlStatements();
        }
        throw new RuntimeException("Unsupported database type: " + databaseType);
    }
}