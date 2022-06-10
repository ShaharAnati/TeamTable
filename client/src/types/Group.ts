export type Filters = {
    day?: string;
    hour?: string;
    tags?: string[]
    priceRange?: number[]
}

export interface Group {
    id: any;
    creator?: string;
    members?: string[];
    filters?: Filters;
}