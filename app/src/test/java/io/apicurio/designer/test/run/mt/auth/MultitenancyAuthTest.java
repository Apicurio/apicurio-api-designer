/*
 * Copyright 2022 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.designer.test.run.mt.auth;

import io.apicurio.designer.test.profile.MultitenancyAuthTestProfile;
import io.apicurio.designer.test.resource.JWSMockResource;
import io.apicurio.designer.test.shared.rest.v0.DesignsResourceTestShared;
import io.apicurio.rest.client.VertxHttpClientProvider;
import io.apicurio.rest.client.auth.OidcAuth;
import io.apicurio.rest.client.auth.exception.AuthErrorHandler;
import io.apicurio.rest.client.spi.ApicurioHttpClientFactory;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.restassured.RestAssured;
import io.restassured.filter.Filter;
import io.vertx.core.Vertx;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@QuarkusTest
@TestProfile(MultitenancyAuthTestProfile.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class MultitenancyAuthTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(MultitenancyAuthTest.class);

    @Inject
    DesignsResourceTestShared drts;

    @ConfigProperty(name = "app.authn.token.endpoint")
    String tokenEndpoint;

    private List<Filter> original;

    @BeforeAll
    void beforeAll() {

        ApicurioHttpClientFactory.setProvider(new VertxHttpClientProvider(Vertx.vertx()));
        var oidcAuth = new OidcAuth(ApicurioHttpClientFactory.create(tokenEndpoint, new AuthErrorHandler()), JWSMockResource.ADMIN_CLIENT_ID, "test");
        var accessToken = oidcAuth.authenticate();

        original = new ArrayList<>(RestAssured.filters());
        RestAssured.filters((requestSpec, responseSpec, ctx) -> {
            requestSpec.header("Authorization", "Bearer " + accessToken);
            return ctx.next(requestSpec, responseSpec);
        });
    }

    @AfterAll
    void afterAll() {
        RestAssured.replaceFiltersWith(original);
    }

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
