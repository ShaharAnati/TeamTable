import { Filters } from "../../client/src/types/Filters";

export interface Group {
    id: any;
    creator?: string;
    members?: string[];
    filters?: Filters;
}