export enum AgeRestriction {
    AllAges,
    AdultsOnly,
    None
}

export const AgeRestrictionLabels: Record<AgeRestriction, string> = {
    [AgeRestriction.AllAges]: "Todas las edades",
    [AgeRestriction.AdultsOnly]: "Solo adultos",
    [AgeRestriction.None]: "Ninguno"
};