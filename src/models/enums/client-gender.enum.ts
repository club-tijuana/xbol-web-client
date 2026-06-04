export enum ClientGender {
    Female,
    Male
}

export const ClientGenderLabels: Record<ClientGender, string> = {
    [ClientGender.Female]: "Femenino",
    [ClientGender.Male]: "Masculino"
};