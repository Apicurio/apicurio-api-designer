import { DesignEventDataCreate } from "./DesignEventDataCreate";
import { DesignEventDataImport } from "./DesignEventDataImport";
import { DesignEventDataRegister } from "./DesignEventDataRegister";
import { DesignEventDataUpdate } from "./DesignEventDataUpdate";

export interface DesignEventData {

    create?: DesignEventDataCreate;
    import?: DesignEventDataImport;
    register?: DesignEventDataRegister;
    update?: DesignEventDataUpdate;

}
