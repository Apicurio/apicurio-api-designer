package io.apicurio.designer.storage.common;

import io.apicurio.common.apps.storage.exceptions.AlreadyExistsException;
import io.apicurio.common.apps.storage.exceptions.NotFoundException;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.designer.spi.storage.DesignerStorageException;
import io.apicurio.designer.spi.storage.ResourceAlreadyExistsStorageException;
import io.apicurio.designer.spi.storage.ResourceNotFoundStorageException;

import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
@SuppressWarnings("unchecked")
public class StorageExceptionMapperImpl implements StorageExceptionMapper {

    @Override
    public DesignerStorageException map(StorageException original) {
        if (original instanceof NotFoundException) {
            return new ResourceNotFoundStorageException("Resource not found.", original);
        }
        if (original instanceof AlreadyExistsException) {
            return new ResourceAlreadyExistsStorageException("Resource already exists.", original);
        }
        return new DesignerStorageException("Something went wrong when accessing SQL storage.", original);
    }
}
