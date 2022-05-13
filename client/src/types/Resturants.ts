export interface Restaurant {
    id?: string;
    name: string;
    description?: string;
    imgUrl?: string;
    tags: string[];
    openingTimes?: {
        [day: string]: string[];
    }
    location?:  string;
    contactInfo?: {
      phoneNumber?:  string;
      email?: string;
    },
    url?: string;
    isVerified?: boolean;
}

export const dayMapping = {
  "1": "א",
  "2": "ב",
  "3": "ג",
  "4": "ד",
  "5": "ה",
  "6": "ו",
  "7": "ש",
};


export const RESTAURANT_TAGS = [
  "meat",
  "vegan",
  "good",
  "dsfsd",
  "gdfsf",
  "dfhfgfdgdf",
  "sdfgsdg",
  "fsdfdsfs",
  "dsfdsf",
];