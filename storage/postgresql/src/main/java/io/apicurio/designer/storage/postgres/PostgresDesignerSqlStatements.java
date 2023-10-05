/*
 * Copyright 2020 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.designer.storage.postgres;

import io.apicurio.common.apps.storage.sql.jdbi.query.Update;
import io.apicurio.common.apps.storage.sql.jdbi.query.UpdateImpl;
import io.apicurio.designer.spi.storage.DesignerSqlStatements;
import io.apicurio.designer.storage.common.AbstractDesignerSqlStatements;

import java.sql.SQLException;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class PostgresDesignerSqlStatements extends AbstractDesignerSqlStatements implements DesignerSqlStatements {

    @Override
    public String dbType() {
        return "postgresql";
    }

    @Override
    public boolean isPrimaryKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("violates unique constraint");
    }

    @Override
    public boolean isForeignKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("violates foreign key constraint");
    }

    @Override
    public Update setStorageProperty(String key, String value) {
        var q = new UpdateImpl("""
                INSERT INTO apicurio ("key", "value") VALUES (?, ?) \
                ON CONFLICT ("key") \
                DO UPDATE SET "value" = ?\
                """);
        return q.bind(0, key)
                .bind(1, value)
                .bind(2, value);
    }

    @Override
    public String getNextSequenceValue() {
        return """
                INSERT INTO sequences (tenantId, "key", "value") VALUES (?, ?, 1) \
                ON CONFLICT (tenantId, "key") \
                DO UPDATE SET value = sequences.value + 1 \
                RETURNING value
                """;
    }

    @Override
    public String getSequenceValue() {
        // PostgreSQL supports atomic increment
        throw new UnsupportedOperationException();
    }

    @Override
    public String casSequenceValue() {
        // PostgreSQL supports atomic increment
        throw new UnsupportedOperationException();
    }

    @Override
    public String insertSequenceValue() {
        // PostgreSQL supports atomic increment
        throw new UnsupportedOperationException();
    }
}
