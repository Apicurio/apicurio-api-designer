
export type EditorsType = {
    url: string;
};

export type UiType = {
    contextPath: string;
    navPrefixPath: string;
};

export type MastheadType = {
    show: boolean;
    label: string;
};

export type ComponentsType = {
    masthead: MastheadType;
    editors: EditorsType;
};

export type ApisType = {
    designer: string;
};

export type AuthType = {
    type: string;
    options?: any;
};

export interface VersionType {
    name: string;
    version: string;
    digest: string;
    builtOn: string;
    url: string;
}

export type ApiDesignerConfig = {
    apis: ApisType;
    ui: UiType;
    components: ComponentsType;
    auth: AuthType;
    version?: VersionType;
};


const DEFAULT_VERSION: VersionType = {
    name: "Apicurio API Designer",
    version: "DEV",
    digest: "DEV",
    builtOn: new Date().toString(),
    url: "https://www.apicur.io/studio"
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


export function getApiDesignerConfig(): ApiDesignerConfig {
    let config: ApiDesignerConfig | undefined;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ApiDesignerConfig) { config = ApiDesignerConfig as ApiDesignerConfig; }

    const gw: any = window as any;
    if (gw["ApiDesignerConfig"]) {
        config = gw["ApiDesignerConfig"] as ApiDesignerConfig;
    }

    if (config) {
        config.version = getApiDesignerVersion();

        // Make sure the EditorsUrl is absolute and based on the current window location.
        const editorsUrl: string = config.components.editors.url.startsWith("/") ?
            (window.location.origin + config.components.editors.url) :
            config.components.editors.url;
        config.components.editors.url = editorsUrl;

        return config;
    }

    throw new Error("ApiDesignerConfig not found.");
}

const apiDesignerConfig: ApiDesignerConfig = getApiDesignerConfig();


/**
 * React hook to get the app config.
 */
export const useApiDesignerConfig: () => ApiDesignerConfig = (): ApiDesignerConfig => {
    return apiDesignerConfig;
};
