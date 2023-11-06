import { ApiDesignerConfigType, VersionType } from "@app/contexts/config.ts";

const DEFAULT_VERSION: VersionType = {
    name: "Apicurio API Designer",
    version: "DEV",
    digest: "DEV",
    builtOn: new Date().toString(),
    url: "http://www.apicur.io/studio"
};


function getApiDesignerVersion(): VersionType {
    let version: VersionType | undefined;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ApicurioInfo) { version = ApicurioInfo as VersionType; }

    const gw: any = window as any;
    if (gw["ApicurioInfo"]) {
        version = gw["ApicurioInfo"] as VersionType;
    }

    if (!version) {
        version = DEFAULT_VERSION;
    }

    return version;
}


export function getApiDesignerConfig(): ApiDesignerConfigType {
    let config: ApiDesignerConfigType | undefined;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ApiDesignerConfig) { config = ApiDesignerConfig as ApiDesignerConfigType; }

    const gw: any = window as any;
    if (gw["ApiDesignerConfig"]) {
        config = gw["ApiDesignerConfig"] as ApiDesignerConfigType;
    }

    if (config) {
        config.version = getApiDesignerVersion();
        return config;
    }

    throw new Error("ApiDesignerConfig not found.");
}
