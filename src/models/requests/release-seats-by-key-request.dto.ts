export interface ReleaseSeatsByKeyRequest {
    eventKey: string;
    seats: Array<string>;
    holdToken?: string;
    keepExtraData?: boolean;
    ignoreChannels?: boolean;
    channelKeys?: Array<string>;
}