export type Filters = {
    day?: string;
    hour?: string;
    tags?: string[]
}

export interface Group {
    id: any;
    creator?: string;
    members?: string[];
    filters?: Filters;
}