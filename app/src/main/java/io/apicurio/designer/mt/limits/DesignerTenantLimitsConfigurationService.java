package io.apicurio.designer.mt.limits;

import io.apicurio.common.apps.multitenancy.limits.TenantLimitsConfiguration;
import io.apicurio.common.apps.multitenancy.limits.TenantLimitsConfigurationService;
import io.apicurio.tenantmanager.api.datamodel.ApicurioTenant;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DesignerTenantLimitsConfigurationService implements TenantLimitsConfigurationService {
    @Override
    public TenantLimitsConfiguration fromTenantMetadata(ApicurioTenant tenantMetadata) {
        return new DesignerTenantLimitsConfiguration();
    }

    @Override
    public TenantLimitsConfiguration defaultConfigurationTenant() {
        return new DesignerTenantLimitsConfiguration();
    }

    @Override
    public boolean isConfigured() {
        return false;
    }
}
