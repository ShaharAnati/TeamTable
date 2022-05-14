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
  "1": "Sunday",
  "2": "Monday",
  "3": "Thirsday",
  "4": "Wednesday",
  "5": "Thursday",
  "6": "Firday",
  "7": "Saturday",
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