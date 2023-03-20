package io.apicurio.designer.spi.storage;

public class StorageException extends RuntimeException {

    private static final long serialVersionUID = -5686981137511830018L;

    public StorageException(String message) {
        super(message);
    }

    public StorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
