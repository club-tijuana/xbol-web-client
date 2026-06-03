import { Box } from "@mui/material";

import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { colors } from "@/theme/colors";

import BundleClientWrapper from "./components/BundleClientWrapper";

interface BundlePageProps {
  params: Promise<{ id: string }>;
}

export default async function BundlePage({ params }: BundlePageProps) {
  const { id } = await params;

  return (
    <Box>
      <FullWidthSection
        variant="color"
        backgroundColor={colors.ui.surface}
        bottomRounded={true}
      >
        <BundleClientWrapper bundleId={Number(id)} />
      </FullWidthSection>
    </Box>
  );
}
