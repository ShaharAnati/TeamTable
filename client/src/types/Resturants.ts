export interface Restaurant {
  id?: string;
  name: string;
  description?: string;
  imgUrl?: string;
  tags: string[];
  openingTimes?: {
    [day: string]: string[];
  };
  location?: {
    lat: number;
    lng: number;
  };
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

export const PLACEHOLDER_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/team-table-6eccc.appspot.com/o/images%2FimagePlaceHolder.png?alt=media&token=63217773-b569-4803-b287-cd7b7e48111c";
