/*
 * Copyright 2023 Red Hat Inc
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

package io.apicurio.designer.ui;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import io.apicurio.designer.config.ApiDesignerConfig;
import io.apicurio.designer.ui.beans.ApiDesignerConfigType;
import io.apicurio.designer.ui.beans.ApisType;
import io.apicurio.designer.ui.beans.AuthType;
import io.apicurio.designer.ui.beans.ComponentsType;
import io.apicurio.designer.ui.beans.EditorsType;
import io.apicurio.designer.ui.beans.MastheadType;
import io.apicurio.designer.ui.beans.NavType;
import io.apicurio.designer.ui.beans.UiType;

/**
 * @author eric.wittmann@gmail.com
 */
public class ConfigJsServlet extends io.apicurio.common.apps.web.servlets.ConfigJsServlet {

    private static final long serialVersionUID = 4295566125954142924L;

    @Inject
    ApiDesignerConfig appConfig;

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#getVarName()
     */
    @Override
    protected String getVarName() {
        return "ApiDesignerConfig";
    }

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#generateConfig(javax.servlet.http.HttpServletRequest)
     */
    @Override
    protected Object generateConfig(HttpServletRequest request) {
        return ApiDesignerConfigType.builder()
                .ui(generateUiConfig())
                .apis(generateApiConfig())
                .auth(generateAuthConfig())
                .components(generateComponentConfig())
                .build();
    }

    private UiType generateUiConfig() {
        return UiType.builder()
                .contextPath("/ui/")
                .navPrefixPath("")
                .build();
    }

    private ApisType generateApiConfig() {
        return ApisType.builder()
                .registry(getRegistryApiUrl())
                .build();
    }

    private ComponentsType generateComponentConfig() {
        return ComponentsType.builder()
                .masthead(generateMastheadConfig())
                .editors(generateEditorsConfig())
                .nav(generateNavConfig())
                .build();
    }

    private MastheadType generateMastheadConfig() {
        return MastheadType.builder()
                .show(true)
                .label("API Designer")
                .build();
    }

    private NavType generateNavConfig() {
        // FIXME implement this!
        return NavType.builder()
                .show(false)
                .registry("")
                .build();
    }

    private EditorsType generateEditorsConfig() {
        return EditorsType.builder()
                .url(getEditorsUrl())
                .build();
    }

    private String getEditorsUrl() {
        // FIXME implement this!
        return "editors-url";
    }

    private String getRegistryApiUrl() {
        // FIXME implement this!
        return "registry-api-url";
    }

    private AuthType generateAuthConfig() {
        if (appConfig.authenticationEnabled) {
            // When auth is enabled but the type is not set, default to keycloak
            if (appConfig.uiAuthType.equals("keycloakjs") || appConfig.uiAuthType.equals("none")) {
                return AuthType.builder()
                    .type("keycloakjs")
                    .options(appConfig.keycloakConfig)
                    .build();
            } else if (appConfig.uiAuthType.equals("oidc")) {
                Map<String, Object> options = new HashMap<>();
                options.put("clientId", appConfig.oidcClientId);
                options.put("url", appConfig.oidcUrl);
                options.put("redirectUri", appConfig.oidcRedirectUri);

                return AuthType.builder()
                    .type("oidc")
                    .options(options)
                    .build();
            }
        }
        return AuthType.builder().type("none").build();
    }

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#getApiUrlOverride()
     */
    @Override
    protected String getApiUrlOverride() {
        throw new RuntimeException("Not yet implemented.");
    }

    /**
     * @see io.apicurio.common.apps.web.servlets.ConfigJsServlet#getApiRelativePath()
     */
    @Override
    protected String getApiRelativePath() {
        return "/apis/designer/v0";
    }

}
