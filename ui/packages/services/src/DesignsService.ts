import {
    ContentTypes,
    CreateDesign,
    CreateDesignContent,
    Design,
    DesignContent,
    DesignEvent,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging, RenameDesign,
} from "@apicurio/apicurio-api-designer-models";
import {
    createEndpoint,
    createOptions, httpDelete,
    httpGet,
    httpPostWithReturn, httpPut
} from "@apicurio/apicurio-api-designer-utils";
import { ServiceConfig, useServiceConfig } from "./ServiceConfigContext";
import { useBrowserDesignsService } from "./BrowserDesignsService";


async function createDesign(svcConfig: ServiceConfig, cd: CreateDesign, cdc: CreateDesignContent): Promise<Design> {
    console.debug("[DesignsService] Creating a new design: ", cd, cdc);
    const token: string | undefined = await svcConfig.auth.getToken();

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs");
    const headers: any = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": cdc.contentType,
        "X-Designer-Name": cd.name,
        "X-Designer-Description": cd.description,
        "X-Designer-Origin": cd.context?.type || "create",
        "X-Designer-Type": cd.type,
    };
    return httpPostWithReturn<any, Design>(endpoint, cdc.data, createOptions(headers));
}

async function searchDesigns(svcConfig: ServiceConfig, criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults> {
    // FIXME Need a Search operation in the Designs API
    console.debug("[DesignsService] Searching for designs: ", criteria, paging, sort);
    const token: string | undefined = await svcConfig.auth.getToken();

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs", {}, {
        page: paging.page,
        pageSize: paging.pageSize
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignsSearchResults>(endpoint, createOptions(headers));
}


async function getDesign(svcConfig: ServiceConfig, id: string): Promise<Design> {
    const token: string | undefined = await svcConfig.auth.getToken();

    console.info("[DesignsService] Getting design with ID: ", id);
    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId/meta", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<Design>(endpoint, createOptions(headers), (data) => {
        return data;
    });
}

async function deleteDesign(svcConfig: ServiceConfig, id: string): Promise<void> {
    const token: string | undefined = await svcConfig.auth.getToken();

    console.info("[DesignsService] Deleting design with ID: ", id);
    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpDelete(endpoint, createOptions(headers));
}

async function renameDesign(svcConfig: ServiceConfig, id: string, newName: string, newDescription?: string): Promise<void> {
    console.debug("[DesignsService] Renaming design with ID: ", id, newName);
    const token: string | undefined = await svcConfig.auth.getToken();

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpPut<RenameDesign>(endpoint, {
        name: newName,
        description: newDescription
    }, createOptions(headers));

}

async function getDesignContent(svcConfig: ServiceConfig, id: string): Promise<DesignContent> {
    const token: string | undefined = await svcConfig.auth.getToken();

    console.info("[DesignsService] Getting design *content* with ID: ", id);
    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };

    const options: any = createOptions(headers);
    options.maxContentLength = "5242880"; // TODO 5MB hard-coded, make this configurable?
    options.responseType = "text";
    options.transformResponse = (data: any) => data;

    return httpGet<DesignContent>(endpoint, options, (data, response) => {
        return {
            id,
            contentType: response.headers["Content-Type"] || ContentTypes.APPLICATION_JSON,
            data
        };
    });
}

async function updateDesignContent(svcConfig: ServiceConfig, content: DesignContent): Promise<void> {
    console.debug("[DesignsService] Updating the content of a design: ", content.id);
    const token: string | undefined = await svcConfig.auth.getToken();

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId", {
        designId: content.id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": content.contentType,
    };
    return httpPut<any>(endpoint, content.data, createOptions(headers));
}

async function getEvents(svcConfig: ServiceConfig, id: string): Promise<DesignEvent[]> {
    // FIXME implement this - REST API needs an /events endpoint for designs
    return Promise.resolve([]);
}

async function createEvent(svcConfig: ServiceConfig, event: DesignEvent): Promise<DesignEvent> {
    // FIXME implement this - REST API needs an /events endpoint for designs
    return Promise.resolve({} as DesignEvent);
}


/**
 * The Designs Service interface.
 */
export interface DesignsService {
    createDesign(cd: CreateDesign, cdc: CreateDesignContent): Promise<Design>;
    getDesign(id: string): Promise<Design>;
    searchDesigns(criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults>;
    deleteDesign(id: string): Promise<void>;
    renameDesign(id: string, newName: string, newDescription?: string): Promise<void>;
    getDesignContent(id: string): Promise<DesignContent>;
    updateDesignContent(content: DesignContent): Promise<void>;
    getEvents(id: string): Promise<DesignEvent[]>;
    createEvent(event: DesignEvent): Promise<DesignEvent>;
}


/**
 * React hook to get the Designs service.
 */
export const useDesignsService: () => DesignsService = (): DesignsService => {
    const svcConfig: ServiceConfig = useServiceConfig();
    if (svcConfig.designs.type === "browser") {
        return useBrowserDesignsService();
    }

    return {
        createDesign: (cd: CreateDesign, cdc: CreateDesignContent) => createDesign(svcConfig, cd, cdc),
        searchDesigns: (criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort) => searchDesigns(svcConfig, criteria, paging, sort),
        getDesign: (id: string) => getDesign(svcConfig, id),
        deleteDesign: (id: string) => deleteDesign(svcConfig, id),
        renameDesign: (id: string, newName: string, newDescription?: string) => renameDesign(svcConfig, id, newName, newDescription),
        getDesignContent: (id: string) => getDesignContent(svcConfig, id),
        updateDesignContent: (content: DesignContent) => updateDesignContent(svcConfig, content),
        getEvents: (id: string) => getEvents(svcConfig, id),
        createEvent: (event: DesignEvent) => createEvent(svcConfig, event)
    };
};
