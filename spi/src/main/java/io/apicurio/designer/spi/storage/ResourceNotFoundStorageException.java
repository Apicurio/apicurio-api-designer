package io.apicurio.designer.spi.storage;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class ResourceNotFoundStorageException extends DesignerStorageException {

    public ResourceNotFoundStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
