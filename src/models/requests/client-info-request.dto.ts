import { ClientGender } from "../enums/client-gender.enum";

export interface ClientInfoRequest {
    id?: number;
    phoneRegionCodeId?: number;
    phoneNumber: string;
    phoneIsoCode?: string;
    phoneCode?: string;
    fullPhone?: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    city?: string;
    neighborhood?: string;
    gender?: ClientGender;
    birthday?: string;
}
