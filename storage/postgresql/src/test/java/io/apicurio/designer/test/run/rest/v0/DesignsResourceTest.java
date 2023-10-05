package io.apicurio.designer.test.run.rest.v0;

import io.apicurio.designer.test.resource.PostgresqlResource;
import io.apicurio.designer.test.shared.rest.v0.DesignsResourceTestShared;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import jakarta.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
@QuarkusTestResource(PostgresqlResource.class)
class DesignsResourceTest {

    @Inject
    DesignsResourceTestShared drts;

    @Test
    void basicCRUD() {
        drts.runBasicCRUD();
    }

    @Test
    void createDesign() {
        drts.runCreateDesign();
    }

    @Test
    void createDesignEvent() {
        drts.runCreateDesignEvent();
    }

    @Test
    void searchDesigns() {
        drts.runSearchDesigns();
    }
}
