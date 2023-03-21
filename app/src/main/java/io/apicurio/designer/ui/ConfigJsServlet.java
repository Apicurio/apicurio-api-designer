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

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import io.apicurio.designer.ui.config.ApiDesignerConfig;
import io.apicurio.designer.ui.config.ApisType;
import io.apicurio.designer.ui.config.AuthType;
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

    /**
     * @return
     */
    private ApisType generateApiConfig() {
        return ApisType.builder()
                .registry(getRegistryApiUrl())
                .build();
    }

    /**
     * @return
     */
    private ComponentsType generateComponentConfig() {
        return ComponentsType.builder()
                .editors(EditorsType.builder()
                        .url(getEditorsUrl())
                        .build())
                .nav(NavType.builder()
                        .show(false)
                        .registry("")
                        .build())
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
        // FIXME implement this!
        return AuthType.builder()
                .enabled(false)
                .build();
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
