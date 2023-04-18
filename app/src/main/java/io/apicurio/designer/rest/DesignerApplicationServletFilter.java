package io.apicurio.designer.rest;


import io.apicurio.common.apps.multitenancy.MultitenancyProperties;
import io.apicurio.common.apps.multitenancy.TenantManagerService;
import io.apicurio.common.apps.multitenancy.exceptions.TenantNotFoundException;
import io.apicurio.tenantmanager.api.datamodel.NewApicurioTenantRequest;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
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
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
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
