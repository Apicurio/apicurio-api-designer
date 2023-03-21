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

import io.apicurio.designer.ui.config.ApiDesignerConfig;
import io.apicurio.designer.ui.config.ApisType;
import io.apicurio.designer.ui.config.AuthType;
import io.apicurio.designer.ui.config.AuthType.AuthTypeBuilder;
import io.apicurio.designer.ui.config.ComponentsType;
import io.apicurio.designer.ui.config.EditorsType;
import io.apicurio.designer.ui.config.NavType;

/**
 * @author eric.wittmann@gmail.com
 */
public class ConfigJsServlet extends io.apicurio.common.apps.web.servlets.ConfigJsServlet {

    private static final long serialVersionUID = 4295566125954142924L;

    @Inject
    UiConfigProperties uiConfig;

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
        return ApiDesignerConfig.builder()
                .apis(generateApiConfig())
                .auth(generateAuthConfig())
                .components(generateComponentConfig())
                .build();
    }

    private ApisType generateApiConfig() {
        // FIXME implement this!
        return ApisType.builder()
                .registry(getRegistryApiUrl())
                .build();
    }

    private ComponentsType generateComponentConfig() {
        // FIXME implement this!
        return ComponentsType.builder()
                .editors(generateEditorsConfig())
                .nav(generateNavConfig())
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
        // FIXME implement this!
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
        if (uiConfig.isAuthenticationEnabled()) {
            AuthTypeBuilder auth = AuthType.builder();
            
            // When auth is enabled but the type is not set, default to keycloak
            if (uiConfig.getUiAuthType().equals("keycloakjs") || uiConfig.getUiAuthType().equals("none")) {
                auth.type("keycloakjs");
                auth.options(uiConfig.getKeycloakProperties());
            } else if (uiConfig.getUiAuthType().equals("oidc")) {
                auth.type("oidc");
                Map<String, Object> options = new HashMap<>();
                options.put("clientId", uiConfig.getOidcClientId());
                options.put("url", uiConfig.getOidcUrl());
                options.put("redirectUri", uiConfig.getOidcRedirectUrl());
                auth.options(options);
            }
            return auth.build();
        } else {
            return AuthType.builder().type("none").build();
        }
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
