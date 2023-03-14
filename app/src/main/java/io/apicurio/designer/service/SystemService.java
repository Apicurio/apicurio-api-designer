package io.apicurio.designer.service;

import io.apicurio.common.apps.core.System;
import io.apicurio.designer.service.model.SystemInfoDto;

import java.time.Instant;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * @author Jakub Senko <m@jsenko.net>
 */
@ApplicationScoped
public class SystemService {

    @Inject
    System system;

    public SystemInfoDto getSystemInfo() {
        return SystemInfoDto.builder()
                .name(system.getName())
                .description(system.getDescription())
                .version(system.getVersion())
                .apiVersion("v0")
                .builtOn(Instant.now()) // TODO
                .build();
    }
}
