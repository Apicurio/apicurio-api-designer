package io.apicurio.designer.test.resource;


import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.Map;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class PostgresqlResource implements QuarkusTestResourceLifecycleManager {

    static PostgreSQLContainer<?> POSTGRESQL =
            new PostgreSQLContainer<>("postgres:latest") // Use the latest tag to alert us on incompatibilities
                    .withDatabaseName("designer")
                    .withUsername("postgres")
                    .withPassword("postgres");

    @Override
    public Map<String, String> start() {
        POSTGRESQL.start();
        return Map.of(
                "quarkus.datasource.jdbc.url", POSTGRESQL.getJdbcUrl(),
                "quarkus.datasource.username", "postgres",
                "quarkus.datasource.password", "postgres"
        );
    }

    @Override
    public void stop() {
        POSTGRESQL.stop();
    }
}
