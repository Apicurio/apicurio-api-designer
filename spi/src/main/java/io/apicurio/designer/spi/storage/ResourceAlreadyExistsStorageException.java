package io.apicurio.designer.spi.storage;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class ResourceAlreadyExistsStorageException extends DesignerStorageException {

    public ResourceAlreadyExistsStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
