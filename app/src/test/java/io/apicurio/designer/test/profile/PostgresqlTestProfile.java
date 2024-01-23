package io.apicurio.designer.test.profile;

import io.apicurio.designer.test.resource.PostgresqlResource;
import io.quarkus.test.junit.QuarkusTestProfile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class PostgresqlTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Collections.singletonMap("apicurio.storage.db-kind", "postgresql");
    }

    @Override
    public List<TestResourceEntry> testResources() {
        return List.of(
                new TestResourceEntry(PostgresqlResource.class));
    }
}
