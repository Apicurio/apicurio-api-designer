package io.apicurio.designer;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

/**
 * @author eric.wittmann@gmail.com
 * @author Jakub Senko "m@jsenko.net"
 */
@QuarkusMain(name = "DesignerQuarkusMain")
public class DesignerQuarkusMain {

    public static void main(String... args) {
        Quarkus.run(args);
    }
}
