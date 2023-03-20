package io.apicurio.designer.spi.storage;

public class DesignNotFoundException extends StorageException {

    private static final long serialVersionUID = 3153648388051440385L;

    public DesignNotFoundException(String message) {
        super(message);
    }

    public DesignNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
