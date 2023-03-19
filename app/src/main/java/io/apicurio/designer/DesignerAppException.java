package io.apicurio.designer;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class DesignerAppException extends RuntimeException {

    private static final long serialVersionUID = -7260750324268131408L;

    public DesignerAppException(String message) {
        super(message);
    }

    public DesignerAppException(String message, Throwable cause) {
        super(message, cause);
    }
}
