package io.apicurio.designer.rest.v0.impl.ex;

import io.apicurio.designer.DesignerAppException;

import java.util.function.Predicate;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class BadRequestException extends DesignerAppException {

    private static final long serialVersionUID = -8366496167281697695L;

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }

    public static <T> void requireNotNullAnd(T parameter, String message, Predicate<T> isValid) {
        if (parameter == null || !isValid.test(parameter)) {
            throw new BadRequestException(message);
        }
    }
}
