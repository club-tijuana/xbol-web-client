"use client";

import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Loader from "@/components/Loader/Loader";
import { EventCatalogItemType } from "@/models/enums/event-catalog-item-type.enum";
import { EventCatalogItemDTO, getEventCatalogBannerImageUrl } from "@/models/event-catalog-item.dto";
import { getEventCatalogItem } from "@/services/eventCatalogService";

interface BundleClientWrapperProps {
  bundleId: number;
}

export default function BundleClientWrapper({ bundleId }: BundleClientWrapperProps) {
  const router = useRouter();
  const [bundle, setBundle] = useState<EventCatalogItemDTO>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBundle = async () => {
      setIsLoading(true);

      try {
        const response = await getEventCatalogItem(bundleId, {
          itemType: EventCatalogItemType.Bundle,
        });

        setBundle(response);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBundle();
  }, [bundleId]);

  if (!bundle) {
    return <Loader isLoading={isLoading} />;
  }

  const imageUrl = getEventCatalogBannerImageUrl(bundle);

  return (
    <Box sx={{ px: { xs: 3, sm: 6, md: 10 }, py: { xs: 5, md: 8 } }}>
      <Grid container columns={{ xs: 1, md: 2 }} spacing={4} alignItems="center">
        <Grid size={1}>
          {imageUrl && (
            <Box sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              borderRadius: 2,
            }}>
              <Image
                src={imageUrl}
                alt={bundle.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          )}
        </Grid>
        <Grid size={1}>
          <Typography variant="h2" color="primary" mb={2}>
            {bundle.name}
          </Typography>
          {bundle.venueName && (
            <Typography variant="h4" color="text.secondary" mb={2}>
              {bundle.venueName}
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary" mb={3}>
            {bundle.availableSeats} boletos disponibles
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(`/booking/season/${bundle.id}`)}
          >
            Ver boletos
          </Button>
        </Grid>
      </Grid>
      <Loader isLoading={isLoading} />
    </Box>
  );
}
