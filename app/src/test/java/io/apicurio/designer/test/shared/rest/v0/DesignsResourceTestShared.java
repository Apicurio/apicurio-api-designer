package io.apicurio.designer.test.shared.rest.v0;

import io.apicurio.designer.rest.v0.beans.DesignMetaData;
import io.apicurio.designer.rest.v0.beans.EditableDesignMetadata;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Assertions;
import org.slf4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.stream.Collectors;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response.Status;

import static io.restassured.RestAssured.given;
import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.*;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignsResourceTestShared {

    @Inject
    Logger log;

    public void runBasicCRUD() {

        String content1 = resourceToString("openapi-empty.json");

        var metadata = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(content1)
                .header("X-Designer-Name", "design1")
                .post("/apis/designer/v0/designs")
                .then()
                .statusCode(Status.OK.getStatusCode()) // TODO Codegen needs to be updated if we want to return 201
                .extract().as(DesignMetaData.class);

        assertEquals("design1", metadata.getName());

        log.info("{}", metadata);

        var metadata2 = given()
                .log().all()
                .when()
                .get("/apis/designer/v0/designs/{designId}/meta", metadata.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignMetaData.class);

        assertEquals(metadata.getId(), metadata2.getId());
        assertEquals(metadata.getKind(), metadata2.getKind());
        assertEquals(metadata.getHref(), metadata2.getHref());
        assertEquals(metadata.getName(), metadata2.getName());
        assertNull(metadata2.getDescription());
        assertEquals(metadata.getCreatedOn(), metadata2.getCreatedOn());
        assertEquals(metadata.getModifiedOn(), metadata2.getModifiedOn());

        var updatedMetadata = EditableDesignMetadata.builder()
                .description("foo")
                .build();

        await().pollDelay(Duration.ofSeconds(3)).untilAsserted(() -> Assertions.assertTrue(true));

        var metadata3 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(updatedMetadata)
                .put("/apis/designer/v0/designs/{designId}/meta", metadata.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignMetaData.class);

        assertEquals(metadata.getId(), metadata3.getId());
        assertEquals(metadata.getKind(), metadata3.getKind());
        assertEquals(metadata.getHref(), metadata3.getHref());
        assertEquals(metadata.getName(), metadata3.getName());
        assertEquals("foo", metadata3.getDescription());
        assertEquals(metadata.getCreatedOn(), metadata3.getCreatedOn());
        assertNotEquals(metadata.getModifiedOn(), metadata3.getModifiedOn());

        var content2 = given()
                .log().all()
                .when()
                .get("/apis/designer/v0/designs/{designId}", metadata.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().asString();

        assertEquals(content1, content2);

        given()
                .log().all()
                .when()
                .delete("/apis/designer/v0/designs/{designId}", metadata.getId())
                .then()
                .statusCode(Status.NO_CONTENT.getStatusCode());

        given()
                .log().all()
                .when()
                .get("/apis/designer/v0/designs/{designId}/meta", metadata.getId())
                .then()
                .statusCode(Status.NOT_FOUND.getStatusCode());
    }

    /**
     * TODO: CAC candidate
     */
    protected final String resourceToString(String resourceName) {
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream(resourceName)) {
            Assertions.assertNotNull(stream, "Resource not found: " + resourceName);
            return new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
