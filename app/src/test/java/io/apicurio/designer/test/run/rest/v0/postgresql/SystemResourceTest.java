package io.apicurio.designer.test.run.rest.v0.postgresql;

import io.apicurio.designer.test.profile.PostgresqlTestProfile;
import io.apicurio.designer.test.shared.rest.v0.SystemResourceTestShared;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
@TestProfile(PostgresqlTestProfile.class)
class SystemResourceTest {

    @Inject
    SystemResourceTestShared srts;

    @Test
    void basic() {
        srts.runBasic();
    }
}
