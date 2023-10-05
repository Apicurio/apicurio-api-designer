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

package io.apicurio.designer.storage;

import io.apicurio.common.apps.config.DynamicConfigStorage;
import io.apicurio.common.apps.config.DynamicConfigStorageAccessor;
import io.apicurio.designer.spi.storage.DesignerStorage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class InMemoryDynamicConfigStorageAccessor implements DynamicConfigStorageAccessor {

    @Inject
    DesignerStorage designerStorage;

    /**
     * @see DynamicConfigStorageAccessor#getConfigStorage()
     */
    @Override
    public DynamicConfigStorage getConfigStorage() {
        return designerStorage;
    }

}
