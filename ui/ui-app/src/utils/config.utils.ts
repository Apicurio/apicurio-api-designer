import { ApiDesignerConfigType } from "@app/contexts/config.ts";

export function getApiDesignerConfig(): ApiDesignerConfigType {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ApiDesignerConfig) { return ApiDesignerConfig as ApiDesignerConfigType; }

    const gw: any = window as any;
    if (gw["ApiDesignerConfig"]) {
        return gw["ApiDesignerConfig"] as ApiDesignerConfigType;
    }

    throw new Error("ApiDesignerConfig not found.");
}
