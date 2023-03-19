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

package io.apicurio.designer.storage.common;

import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.sql.jdbi.Handle;
import io.apicurio.designer.spi.storage.DesignerSqlStatements;

/**
 * @author eric.wittmann@gmail.com
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public abstract class AbstractDesignerSqlStatements implements DesignerSqlStatements {

    // ==================== BaseSqlStatements ====================

    @Override
    public boolean isDatabaseInitialized(Handle handle) throws StorageException {
        int count = handle.createQuery("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'apicurio'")
                .mapTo(Integer.class).one();
        return count > 0;
    }

    @Override
    public String getStorageProperty() {
        return """
                SELECT a."value" FROM apicurio a WHERE a."key" = ?\
                """;
    }

    // ==================== DesignerSqlStatements ====================

    @Override
    public String insertDesignContent() {
        return """
                INSERT INTO content (tenantId, contentId, contentHash, content) \
                VALUES (?, ?, ?, ?)\
                """;
    }

    @Override
    public String insertDesign() {
        return """
                INSERT INTO designs (tenantId, designId, contentId) \
                VALUES (?, ?, ?)\
                """;
    }

    @Override
    public String selectDesign() {
        return """
                SELECT d.* FROM designs d \
                WHERE d.tenantId = ? AND d.designId = ?\
                """;
    }

    @Override
    public String insertMetadata() {
        return """
                INSERT INTO design_metadata (tenantId, designId, name, description, createdBy, createdOn, modifiedBy, modifiedOn, type, source) \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\
                """;
    }

    @Override
    public String selectContentByDesignId() {
        return """
                SELECT c.content FROM content c \
                JOIN designs d ON c.tenantId = d.tenantId AND c.contentId = d.contentId \
                WHERE d.tenantId = ? AND d.designId = ?\
                """;
    }

    @Override
    public String updateContentByDesignId() {
        return """
                UPDATE content c \
                SET content = ? \
                WHERE c.tenantId = ? AND c.contentId = \
                   (SELECT d.contentId FROM designs d WHERE d.tenantId = ? AND d.designId = ?)\
                """;
    }

    @Override
    public String selectDesignMetadata() {
        return """
                SELECT m.* FROM design_metadata m \
                WHERE m.tenantId = ? AND m.designId = ?\
                """;
    }

    @Override
    public String selectDesignMetadataPage() {
        return """
                SELECT m.* FROM design_metadata m \
                WHERE m.tenantId = ? \
                ORDER BY m.createdOn ASC LIMIT ? OFFSET ?\
                """;
    }

    @Override
    public String countDesigns() {
        return """
                SELECT COUNT(*) FROM designs d \
                WHERE d.tenantId = ?\
                """;
    }

    @Override
    public String updateDesignMetadata() {
        return """
                UPDATE design_metadata m \
                SET name = ?, description = ?, createdBy = ?, createdOn = ?, modifiedBy = ?, modifiedOn = ?, type = ?, source = ? \
                WHERE m.tenantId = ? AND m.designId = ?\
                """;
    }

    @Override
    public String deleteDesign() {
        return """
                DELETE FROM designs d \
                WHERE d.tenantId = ? AND d.designId = ?\
                """;
    }

    @Override
    public String deleteDesignMetadata() {
        return """
                DELETE FROM design_metadata m \
                WHERE m.tenantId = ? AND m.designId = ?\
                """;
    }

    // TODO Deduplication?
    @Override
    public String deleteDesignContent() {
        return """
                DELETE FROM content c \
                WHERE c.tenantId = ? AND c.contentId = ?\
                """;
    }
}
