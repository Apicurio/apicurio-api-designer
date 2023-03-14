package io.apicurio.designer.rest.v0.impl;

import io.apicurio.designer.rest.v0.SystemResource;
import io.apicurio.designer.rest.v0.beans.SystemInfo;
import io.apicurio.designer.service.SystemService;

import java.sql.Date;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * @author Jakub Senko <m@jsenko.net>
 */
@ApplicationScoped
public class SystemResourceImpl implements SystemResource {

    @Inject
    SystemService systemService;

    @Override
    public SystemInfo getSystemInfo() {
        // TODO Caching...
        var from = systemService.getSystemInfo();
        return SystemInfo.builder()
                .name(from.getName())
                .description(from.getDescription())
                .version(from.getVersion())
                .apiVersion(from.getApiVersion())
                .builtOn(Date.from(from.getBuiltOn()))
                .build();
    }
}
