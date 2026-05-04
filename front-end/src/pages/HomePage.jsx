import { Box } from '@mantine/core';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { BenefitsSection } from '../components/BenefitsSection/BenefitsSection';
import { CollectionSection } from '../components/CollectionSection/CollectionSection';
import { PopularSection } from '../components/PopularSection/PopularSection';

export function HomePage() {
  return (
    <Box>
      <HeroSection />
      <BenefitsSection />
      <CollectionSection />
      <PopularSection />
    </Box>
  );
}
