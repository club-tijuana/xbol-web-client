import { Box } from "@mui/material";
import Image from "next/image";
import { AdvertisementProps } from "./Advertisement.types";

export default function Advertisement({ image }: AdvertisementProps) {
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: 300,
            }}
            >
            <Image
                src={image}
                alt="Advertisement"
                fill
                style={{ objectFit: "cover", borderRadius: 10 }}
            />
        </Box>
    );
}