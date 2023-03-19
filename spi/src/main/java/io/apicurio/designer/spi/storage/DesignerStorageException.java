package io.apicurio.designer.spi.storage;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class DesignerStorageException extends RuntimeException {

    public DesignerStorageException(String message) {
        super(message);
    }

    public DesignerStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
