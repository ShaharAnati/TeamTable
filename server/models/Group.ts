import { Restaurant } from "./Restaurant";

type Filters = {
    day?: string;
    hour?: string;
    tags?: string[];
    selectedArea?: any;
}

export interface Group {
    id: any;
    creator?: string;
    members: GroupUser[];
    filters?: Filters;
}

export interface GroupLikedRestaurants {
    [resId:string]: number;   
}

export interface GroupUser {
    username: string;
    active: boolean;
}

export interface ExtendedGroupData extends Group {
    restaurants: Restaurant[];
}