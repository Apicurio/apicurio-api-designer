import React from "react";
import { Design, RenameDesign } from "@apicurio/apicurio-api-designer-models";
import { ExportDesign } from "@apicurio/apicurio-api-designer-models/src/designs/ExportDesign";
import { AlertVariant, ServiceConfig, useServiceConfig } from "./ServiceConfigContext";


export interface AlertsService {
    designDeleted(design: Design): void;
    designDeleteFailed(design: Design, error: any): void;
    designSaved(design: Design): void;
    designRenamed(event: RenameDesign): void;
    designExportedToRhosr(event: ExportDesign): void;
}


/**
 * React hook to get the Alerts service.
 */
export const useAlertsService: () => AlertsService = (): AlertsService => {
    const serviceConfig: ServiceConfig = useServiceConfig();

    return {
        designDeleted(design: Design): void {
            serviceConfig.alerts.addAlert({
                title: "Delete successful",
                description: `Design '${design.name}' was successfully deleted.`,
                variant: AlertVariant.success,
                dataTestId: "toast-design-deleted"
            });
        },

        designDeleteFailed(design: Design, error: any): void {
            serviceConfig.alerts.addAlert({
                title: "Delete failed",
                description: `Failed to delete design '${design.name}'.  ${error}`,
                variant: AlertVariant.danger,
                dataTestId: "toast-design-delete-error"
            });
        },

        designRenamed(event: RenameDesign): void {
            serviceConfig.alerts.addAlert({
                title: "Details successfully changed",
                description: `Details (name, summary) of design '${event.name}' were successfully changed.`,
                variant: AlertVariant.success,
                dataTestId: "toast-design-renamed"
            });
        },

        designSaved(design: Design): void {
            const description: React.ReactNode = (
                <React.Fragment>
                    <div>
                        Design '{design?.name}' was <span style={{ fontWeight: "bold" }}>successfully saved locally in your browser</span>.
                    </div>
                </React.Fragment>
            );

            serviceConfig.alerts.addAlert({
                title: "Save successful",
                description,
                variant: AlertVariant.success,
                dataTestId: "toast-design-saved"
            });
        },

        designExportedToRhosr(event: ExportDesign): void {
            const description: React.ReactNode = (
                <React.Fragment>
                    <div>{`Design '${event.design.name}' was successfully exported to Service Registry.`}</div>
                    {/*<RegistryNavLink registry={event.to} context={event.context}>View artifact in Service Registry</RegistryNavLink>*/}
                </React.Fragment>
            );

            serviceConfig.alerts.addAlert({
                title: "Export successful",
                description,
                variant: AlertVariant.success,
                dataTestId: "toast-design-registered"
            });
        },
    };
};
