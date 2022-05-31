import { Restaurant } from "./Restaurant";

type Filters = {
    day?: string;
    hour?: string;
    tags: string[]
}
export interface Group {
    id: any;
    creator?: string;
    members?: string[];
    filters?: Filters;
}

export interface ExtendedGroupData extends Group{
    restaurants: Restaurant[];
}