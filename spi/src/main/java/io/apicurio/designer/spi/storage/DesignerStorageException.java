package io.apicurio.designer.spi.storage;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class DesignerStorageException extends RuntimeException {

    private static final long serialVersionUID = 5993756013495297077L;

    public DesignerStorageException(String message) {
        super(message);
    }

    public DesignerStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
