package io.apicurio.designer.test.run.rest.v0;

import io.apicurio.designer.test.resource.PostgresqlResource;
import io.apicurio.designer.test.shared.rest.v0.SystemResourceTestShared;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import jakarta.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
@QuarkusTestResource(PostgresqlResource.class)
class SystemResourceTest {

    @Inject
    SystemResourceTestShared srts;

    @Test
    void basic() {
        srts.runBasic();
    }
}
