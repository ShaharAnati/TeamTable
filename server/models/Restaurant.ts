export interface Restaurant {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    tags: string[];
    openingTimes: {
        [day: string]: string[];

    },
    location?: {
        lat: number;
        lng: number;
      };
    address?: any;
    contactIndo: {
      phoneNumber:  string;
      email: string;
    }  
    url?: string;
    isVerified?: boolean;
    pricePoint?: number;
}

export interface TagGroup {
    tagGroupId: string;
    tagGroupNme: string;
    constraintLevel: number;
    tags: { id: string, name: string }[]
}

export interface RankedTag {
    tagName: string;
    constraintLevel: number;
}