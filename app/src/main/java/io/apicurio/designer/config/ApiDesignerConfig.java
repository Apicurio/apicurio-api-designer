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

package io.apicurio.designer.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;

import io.apicurio.designer.common.config.DesignerProperties;

/**
 * @author eric.wittmann@gmail.com
 */
@Singleton
public class ApiDesignerConfig {

    @Inject
    Logger log;

    @Inject
    @ConfigProperty(name = "designer.ui.config.uiContextPath", defaultValue = "/ui/")
    //@Info(category = "ui", description = "UI context path", availableSince = "1.0.0.Final")
    public String uiContextPath;

    @Inject
    @ConfigProperty(name = "designer.ui.config.apiUrl", defaultValue = "_")
    //@Info(category = "ui", description = "UI APIs URL", availableSince = "1.0.0.Final")
    public String apiUrl;

    @Inject
    @ConfigProperty(name = "designer.ui.config.editorsUrl", defaultValue = "/editors/")
    //@Info(category = "ui", description = "UI APIs URL", availableSince = "1.0.0.Final")
    public String editorsUrl;

    @Inject
    @ConfigProperty(name = "quarkus.oidc.tenant-enabled", defaultValue = "false")
    //@Info(category = "ui", description = "UI OIDC tenant enabled", availableSince = "1.0.0.Final")
    public boolean authenticationEnabled;

    @Inject
    @ConfigProperty(name = "designer.ui.config.auth.type", defaultValue = "none")
    //@Info(category = "ui", description = "UI auth type", availableSince = "1.0.0.Final")
    public String uiAuthType;

    @Inject
    @ConfigProperty(name = "designer.ui.config.auth.oidc.url", defaultValue = "none")
    //@Info(category = "ui", description = "UI auth OIDC URL", availableSince = "1.0.0.Final")
    public String oidcUrl;

    @Inject
    @ConfigProperty(name = "designer.ui.config.auth.oidc.client-id", defaultValue = "none")
    //@Info(category = "ui", description = "UI auth OIDC client ID", availableSince = "1.0.0.Final")
    public String oidcClientId;

    @Inject
    @ConfigProperty(name = "designer.ui.config.auth.oidc.redirect-url", defaultValue = "none")
    //@Info(category = "ui", description = "UI auth OIDC redirect URL", availableSince = "1.0.0.Final")
    public String oidcRedirectUri;

    public final Map<String, Object> keycloakConfig;

    /**
     * Constructor.
     * @param kcProperties
     */
    public ApiDesignerConfig(@DesignerProperties(value = {"designer.ui.config.auth.keycloak"}) Properties kcProperties) {
        this.keycloakConfig = new HashMap<>();
        kcProperties.stringPropertyNames().forEach(key -> keycloakConfig.put(key, kcProperties.get(key)));
    }

    @PostConstruct
    void onConstruct() {
        log.debug("============> kcProperties  " + keycloakConfig);
        log.debug("============> authenticationEnabled  " + authenticationEnabled);
        log.debug("============> uiContextPath  " + uiContextPath);
        log.debug("============> apiUrl  " + apiUrl);
    }

}
