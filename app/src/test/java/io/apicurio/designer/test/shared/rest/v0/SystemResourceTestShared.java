package io.apicurio.designer.test.shared.rest.v0;

import io.restassured.http.ContentType;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.core.Response;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class SystemResourceTestShared {

    public void runBasic() {

        given()
                .when()
                .contentType(ContentType.JSON)
                .get("/apis/designer/v0/system/info")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", is("Apicurio API Designer"));
    }
}
