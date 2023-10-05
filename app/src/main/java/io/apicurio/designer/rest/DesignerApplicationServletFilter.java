package io.apicurio.designer.rest;


import io.apicurio.common.apps.multitenancy.MultitenancyProperties;
import io.apicurio.common.apps.multitenancy.TenantManagerService;
import io.apicurio.common.apps.multitenancy.exceptions.TenantNotFoundException;
import io.apicurio.tenantmanager.api.datamodel.NewApicurioTenantRequest;
import org.eclipse.microprofile.jwt.JsonWebToken;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * This Servlet Filter is used to create handle the tenant resolution when the application
 * is running in multitenant mode.
 */
@ApplicationScoped
public class DesignerApplicationServletFilter implements Filter {

    @Inject
    MultitenancyProperties multitenancyProperties;

    @Inject
    TenantManagerService tenantManagerService;

    @Inject
    Instance<JsonWebToken> jsonWebToken;

    /**
     * @see jakarta.servlet.Filter#doFilter(jakarta.servlet.ServletRequest, jakarta.servlet.ServletResponse, jakarta.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        if (multitenancyProperties.isMultitenancyEnabled()) {

            final String organizationId = resolveTenantId();

            try {
                tenantManagerService.getTenant(resolveTenantId());
            } catch (TenantNotFoundException tnfe) {
                NewApicurioTenantRequest apicurioTenantRequest = new NewApicurioTenantRequest();
                apicurioTenantRequest.setTenantId(organizationId);
                apicurioTenantRequest.setName(organizationId);
                apicurioTenantRequest.setOrganizationId(organizationId);
                apicurioTenantRequest.setCreatedBy(organizationId);
                apicurioTenantRequest.setDescription(organizationId);
                apicurioTenantRequest.setResources(Collections.emptyList());
                tenantManagerService.createTenant(apicurioTenantRequest);
            }
        }
        chain.doFilter(request, response);
    }

    private String resolveTenantId() {
        for (String tenantIdClaim : multitenancyProperties.getTenantIdClaims()) {
            final Optional<Object> claimValue = jsonWebToken.get().claim(tenantIdClaim);
            if (claimValue.isPresent()) {
                return (String) claimValue.get();
            }
        }
        //TODO change exception
        throw new IllegalStateException("Cannot resolve tenant id from token");
    }


}
