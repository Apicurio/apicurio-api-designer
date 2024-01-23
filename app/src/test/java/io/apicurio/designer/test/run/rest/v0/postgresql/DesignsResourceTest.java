package io.apicurio.designer.test.run.rest.v0.postgresql;

import io.apicurio.designer.test.profile.PostgresqlTestProfile;
import io.apicurio.designer.test.shared.rest.v0.DesignsResourceTestShared;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
@TestProfile(PostgresqlTestProfile.class)
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
