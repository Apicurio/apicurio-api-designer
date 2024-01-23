package io.apicurio.designer.storage.common;

import io.apicurio.common.apps.config.Info;
import io.apicurio.common.apps.storage.sql.SqlStatements;
import io.apicurio.designer.spi.storage.DesignerSqlStatements;
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

    @Inject
    @Named("postgresqlStatements")
    DesignerSqlStatements postgresqlStatements;

    @Inject
    @Named("h2sqlStatements")
    DesignerSqlStatements h2sqlStatements;

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
            return h2sqlStatements;
        }
        if ("postgresql".equals(databaseType)) {
            return postgresqlStatements;
        }
        throw new RuntimeException("Unsupported database type: " + databaseType);
    }
}