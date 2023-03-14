package io.apicurio.designer.spi.storage;

public class DesignNotFoundException extends StorageException {

    public DesignNotFoundException(String message) {
        super(message);
    }

    public DesignNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
