import {
    CreateDesign,
    CreateDesignContent,
    Design,
    DesignContent,
    DesignEvent,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging
} from "@apicurio/apicurio-api-designer-models";
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import { limit } from "@apicurio/apicurio-api-designer-utils";
import { DesignsService } from "./DesignsService";
import { CreateDesignEvent } from "@apicurio/apicurio-api-designer-models/src/designs/CreateDesignEvent";


const db = new Dexie("designsDB");
db.version(4).stores({
    designs: "++id, type, name, createdOn, modifiedOn", // Primary key and indexed props
    content: "++id",
    events: "++eventId, id, type, on"
});


async function createDesign(cd: CreateDesign, cdc: CreateDesignContent, cde?: CreateDesignEvent): Promise<Design> {
    const id: string = uuidv4();
    const newDesign: Design = {
        id,
        name: limit(cd.name, 64) as string,
        description: limit(cd.description, 256),
        type: cd.type,
        createdOn: new Date(),
        createdBy: "user",
        modifiedOn: new Date(),
        modifiedBy: "user",
        origin: cd.origin
    };
    const newDesignContent: DesignContent = {
        id,
        contentType: cdc.contentType,
        data: cdc.data
    };

    return Promise.all([
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        db.designs.add(newDesign),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        db.content.add(newDesignContent),
        createEvent(id, cde || {
            type: "CREATE",
            data: {
                create: {
                    template: ""
                }
            }
        })
    ]).then(() => newDesign);
}

async function getDesigns(): Promise<Design[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return db.designs.toArray();
}

async function searchDesigns(criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults> {
    console.debug("[DesignsService] Searching for designs: ", criteria, paging);
    const accept = (design: Design): boolean => {
        let matches: boolean = false;
        if (!criteria.filterValue || criteria.filterValue.trim().length === 0) {
            matches = true;
        } else if (design.name.toLowerCase().indexOf(criteria.filterValue.toLowerCase()) >= 0) {
            matches = true;
        } else if (design.description && design.description.toLowerCase().indexOf(criteria.filterValue.toLowerCase()) >= 0) {
            matches = true;
        } else if (design.type.toLowerCase().indexOf(criteria.filterValue.toLowerCase()) >= 0) {
            matches = true;
        }
        return matches;
    };

    return getDesigns().then(designs => {
        // TODO Explore whether we can use dexie to filter and page the results.

        // filter and sort the results
        const filteredDesigns: Design[] = designs.filter(accept).sort((design1, design2) => {
            let rval: number = sort.by === "name" ? (
                design1.name.localeCompare(design2.name)
            ) : (
                design1.modifiedOn.getTime() - design2.modifiedOn.getTime()
            );
            if (sort.direction !== "asc") {
                rval *= -1;
            }
            return rval;
        });
        // get the total count
        const totalCount: number = filteredDesigns.length;
        // get the subset of results based on paging
        const start: number = (paging.page - 1) * paging.pageSize;
        const end: number = start + paging.pageSize;
        const pagedDesigns: Design[] = filteredDesigns.slice(start, end);
        return {
            designs: pagedDesigns,
            page: paging.page,
            pageSize: paging.pageSize,
            count: totalCount
        };
    });
}


async function getDesign(id: string): Promise<Design> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return db.designs.where("id").equals(id).first();
}

async function deleteDesign(id: string): Promise<void> {
    return Promise.all([
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        db.designs.where("id").equals(id).delete(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        db.content.where("id").equals(id).delete(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        db.events.where("id").equals(id).delete(),
    ]).then(() => {
        // This space intentionally left blank.
    });
}

async function renameDesign(id: string, newName: string, newDescription?: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return db.designs.update(id, {
        name: limit(newName, 64) as string,
        description: limit(newDescription, 256),
    });
}

async function getDesignContent(id: string): Promise<DesignContent> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return db.content.where("id").equals(id).first();
}

async function updateDesignContent(content: DesignContent): Promise<void> {
    const cevent: CreateDesignEvent = {
        type: "UPDATE",
        data: {
            update: {
                notes: ""
            }
        }
    };

    return Promise.all([
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        db.content.update(content.id, {
            data: content.data
        }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        db.designs.update(content.id, {
            modifiedOn: new Date()
        }),
        createEvent(content.id, cevent)
    ]).then(() => {
        // This space intentionally left blank.
    });
}


async function getEvents(id: string): Promise<DesignEvent[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return db.events.where("id").equals(id).reverse().sortBy("on");
}


async function createEvent(id: string, cevent: CreateDesignEvent): Promise<DesignEvent> {
    const newEvent: DesignEvent = {
        id,
        eventId: uuidv4(),
        type: cevent.type,
        on: new Date(),
        data: cevent.data
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return db.events.add(newEvent);
}


/**
 * React hook to get the Designs service.
 */
export const useBrowserDesignsService: () => DesignsService = (): DesignsService => {
    return {
        createDesign,
        searchDesigns,
        getDesign,
        deleteDesign,
        renameDesign,
        getDesignContent,
        updateDesignContent,
        getEvents,
        createEvent
    };
};
