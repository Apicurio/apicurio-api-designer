package io.apicurio.designer.test.run.rest.v0;

import io.apicurio.designer.test.shared.rest.v0.DesignsResourceTestShared;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
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
