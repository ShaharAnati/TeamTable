export interface User {
    _id?: string;
    email: string;
    password: string;
    phoneNumber: string;
    fullName: string;
    isAdmin: boolean;
    likedRestaurants: string[];
}
