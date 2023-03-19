package io.apicurio.designer.test.run.rest.v0;

import io.apicurio.designer.test.shared.rest.v0.SystemResourceTestShared;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
class SystemResourceTest {

    @Inject
    SystemResourceTestShared srts;

    @Test
    void basic() {
        srts.runBasic();
    }
}
