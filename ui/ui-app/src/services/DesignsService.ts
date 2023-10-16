import {
    ContentTypes,
    CreateDesign,
    CreateDesignContent, CreateDesignEvent,
    Design,
    DesignContent,
    DesignEvent,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging, RenameDesign,
} from "@models/designs";
import { ServiceConfig, useServiceConfig } from "./ServiceConfigContext";
import { useBrowserDesignsService } from "./BrowserDesignsService";
import { createEndpoint, createOptions, httpDelete, httpGet, httpPostWithReturn, httpPut } from "@utils/rest.utils.ts";

function limit(value: string | undefined, size: number): string {
    if (value != undefined && value.length > size) {
        return value.substring(0, size);
    }
    return value || "";
}

async function createDesign(svcConfig: ServiceConfig, cd: CreateDesign, cdc: CreateDesignContent, cde?: CreateDesignEvent): Promise<Design> {
    console.debug("[DesignsService] Creating a new design: ", cd);
    console.info("===> CDE 1: ", cde);
    const token: string | undefined = await svcConfig.auth.getToken();

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs");
    const headers: any = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": cdc.contentType,
        "X-Designer-Name": `==${btoa(limit(cd.name, 256))}`,
        "X-Designer-Description": `==${btoa(limit(cd.description || "", 1024))}`,
        "X-Designer-Origin": cd.origin || "create",
        "X-Designer-Type": cd.type,
    };

    return httpPostWithReturn<any, Design>(endpoint, cdc.data, createOptions(headers)).then(response => {
        console.info("===> CDE 2: ", cde);
        const cevent: CreateDesignEvent = cde || {
            type: "CREATE",
            data: {
                create: {
                    template: ""
                }
            }
        };
        createEvent(svcConfig, response.id, cevent);
        return response;
    });
}

async function searchDesigns(svcConfig: ServiceConfig, criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults> {
    console.debug("[DesignsService] Searching for designs: ", criteria, paging, sort);
    const token: string | undefined = await svcConfig.auth.getToken();

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs", {}, {
        page: paging.page,
        pageSize: paging.pageSize,
        order: sort.direction,
        orderby: sort.by
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
    return httpGet<Design>(endpoint, createOptions(headers));
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

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId/meta", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpPut<RenameDesign>(endpoint, {
        name: newName,
        description: newDescription || ""
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
    return httpPut<any>(endpoint, content.data, createOptions(headers)).then(response => {
        const cevent: CreateDesignEvent = {
            type: "UPDATE",
            data: {
                update: {
                    notes: ""
                }
            }
        };
        createEvent(svcConfig, content.id, cevent);
        return response;
    });
}

async function getEvents(svcConfig: ServiceConfig, id: string): Promise<DesignEvent[]> {
    const token: string | undefined = await svcConfig.auth.getToken();

    console.info("[DesignsService] Getting events for design with ID: ", id);
    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId/events", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignEvent[]>(endpoint, createOptions(headers));
}

async function getFirstEvent(svcConfig: ServiceConfig, id: string): Promise<DesignEvent> {
    const token: string | undefined = await svcConfig.auth.getToken();

    console.info("[DesignsService] Getting first event for design with ID: ", id);
    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId/events/first", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignEvent>(endpoint, createOptions(headers));
}

async function createEvent(svcConfig: ServiceConfig, id: string, cevent: CreateDesignEvent): Promise<DesignEvent> {
    console.debug("[DesignsService] Creating an event for design with ID: ", id);
    const token: string | undefined = await svcConfig.auth.getToken();

    const endpoint: string = createEndpoint(svcConfig.designs.api, "/designs/:designId/events", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpPostWithReturn<CreateDesignEvent, DesignEvent>(endpoint, cevent, createOptions(headers));
}


/**
 * The Designs Service interface.
 */
export interface DesignsService {
    createDesign(cd: CreateDesign, cdc: CreateDesignContent, cde?: CreateDesignEvent): Promise<Design>;
    getDesign(id: string): Promise<Design>;
    searchDesigns(criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults>;
    deleteDesign(id: string): Promise<void>;
    renameDesign(id: string, newName: string, newDescription?: string): Promise<void>;
    getDesignContent(id: string): Promise<DesignContent>;
    updateDesignContent(content: DesignContent): Promise<void>;
    getEvents(id: string): Promise<DesignEvent[]>;
    getFirstEvent(id: string): Promise<DesignEvent>;
    createEvent(id: string, event: CreateDesignEvent): Promise<DesignEvent>;
}


/**
 * React hook to get the Designs service.
 */
export const useDesignsService: () => DesignsService = (): DesignsService => {
    const svcConfig: ServiceConfig = useServiceConfig();
    const browserDesignsService: DesignsService = useBrowserDesignsService();
    const remoteDesignsService: DesignsService = {
        createDesign: (cd: CreateDesign, cdc: CreateDesignContent, cde: CreateDesignEvent) => createDesign(svcConfig, cd, cdc, cde),
        searchDesigns: (criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort) => searchDesigns(svcConfig, criteria, paging, sort),
        getDesign: (id: string) => getDesign(svcConfig, id),
        deleteDesign: (id: string) => deleteDesign(svcConfig, id),
        renameDesign: (id: string, newName: string, newDescription?: string) => renameDesign(svcConfig, id, newName, newDescription),
        getDesignContent: (id: string) => getDesignContent(svcConfig, id),
        updateDesignContent: (content: DesignContent) => updateDesignContent(svcConfig, content),
        getEvents: (id: string) => getEvents(svcConfig, id),
        getFirstEvent: (id: string) => getFirstEvent(svcConfig, id),
        createEvent: (id: string, cevent: CreateDesignEvent) => createEvent(svcConfig, id, cevent)
    };

    return (svcConfig.designs.type === "browser") ? browserDesignsService : remoteDesignsService;
};
