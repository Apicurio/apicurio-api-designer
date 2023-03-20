package io.apicurio.designer.rest.v0;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import javax.ws.rs.core.Response;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

/**
 * @author Jakub Senko <m@jsenko.net>
 */
@QuarkusTest
class SystemResourceTest {

    //private final Logger log = LoggerFactory.getLogger(getClass());

    @Test
    void basic() {

        given()
                .when()
                .contentType(ContentType.JSON)
                .get("/apis/designer/v0/system/info")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", is("Apicurio API Designer"));
    }
}
