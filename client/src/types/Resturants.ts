export interface Restaurant {
  id?: string;
  name: string;
  description?: string;
  imgUrl?: string;
  tags: string[];
  openingTimes?: {
    [day: string]: string[];
  },
  location?: {
    lat: number;
    lng: number;
  }
  address?: Address;
  contactInfo?: {
    phoneNumber?: string;
    email?: string;
  };
  url?: string;
  isVerified?: boolean;
}

export const dayMapping = {
  "1": "Sunday",
  "2": "Monday",
  "3": "Tuesday",
  "4": "Wednesday",
  "5": "Thursday",
  "6": "Friday",
  "7": "Saturday",
};

export interface Address {
  town?: string;
  city?: string;
  country: string;
  road?: string;
  house_number?: number;
  street?: string;
}

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