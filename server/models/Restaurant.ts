export interface Restaurant {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    tags: string[];
    openingTimes: {
        [day: string]: string[];

    },
    location:  string;
    contactIndo: {
      phoneNumber:  string;
      email: string;
    }  
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