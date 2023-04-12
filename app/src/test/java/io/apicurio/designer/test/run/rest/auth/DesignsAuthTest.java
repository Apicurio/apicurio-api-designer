package io.apicurio.designer.test.run.rest.auth;

import io.apicurio.designer.test.profile.AuthTestProfile;
import io.apicurio.designer.test.resource.JWSMockResource;
import io.apicurio.designer.test.shared.rest.v0.DesignsResourceTestShared;
import io.apicurio.rest.client.VertxHttpClientProvider;
import io.apicurio.rest.client.auth.OidcAuth;
import io.apicurio.rest.client.auth.exception.AuthErrorHandler;
import io.apicurio.rest.client.spi.ApicurioHttpClientFactory;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.vertx.core.Vertx;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

/**
 * @author Carles Arnal
 */
@QuarkusTest
@TestProfile(AuthTestProfile.class)
class DesignsAuthTest {

    @Inject
    DesignsResourceTestShared drts;

    @ConfigProperty(name = "app.authn.token.endpoint")
    String tokenEndpoint;

    OidcAuth oidcAuth;

    @Test
    void basicCRUD() {
        ApicurioHttpClientFactory.setProvider(new VertxHttpClientProvider(Vertx.vertx()));
        oidcAuth = new OidcAuth(ApicurioHttpClientFactory.create(tokenEndpoint, new AuthErrorHandler()), JWSMockResource.ADMIN_CLIENT_ID, "test");
        drts.runBasicCRUD(oidcAuth.authenticate());
    }
}
