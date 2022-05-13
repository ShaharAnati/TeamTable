interface Restaurant {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    tags: string[];
    openingTimes: {
        [day: string]: string[];
    //   "1": string,
    //   "2": [{ type: String }],
    //   "3": [{ type: String }],
    //   "4": [{ type: String }],
    //   "5": [{ type: String }],
    },
    location:  string;
    contactIndo: {
      phoneNumber:  string;
      email: string;
    }  
}