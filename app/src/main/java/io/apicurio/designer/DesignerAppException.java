package io.apicurio.designer;

/**
 * @author Jakub Senko <m@jsenko.net>
 */
public class DesignerAppException extends RuntimeException {

    public DesignerAppException(String message) {
        super(message);
    }

    public DesignerAppException(String message, Throwable cause) {
        super(message, cause);
    }
}
