import { Container, SimpleGrid, Stack, Text, ThemeIcon, Group, Box } from '@mantine/core';
import { Sparkles, Leaf, Gift, ShieldCheck } from 'lucide-react';
import styles from './BenefitsSection.module.css';

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'Ручная работа',
    description: 'Каждое украшение создано вручную с любовью',
  },
  {
    icon: Leaf,
    title: 'Натуральные материалы',
    description: 'Используем только серебро 925 пробы и камни',
  },
  {
    icon: Gift,
    title: 'Премиальная упаковка',
    description: 'Каждое изделие приходит в фирменной коробке',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантия качества',
    description: 'Мы уверены в качестве наших украшений',
  },
];

export function BenefitsSection() {
  return (
    <Box className={styles.wrapper}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={40}>
          {BENEFITS.map((benefit) => (
            <Group key={benefit.title} align="start" wrap="nowrap" gap="md">
              <ThemeIcon variant="subtle" color="gold" size={40}>
                <benefit.icon size={24} strokeWidth={1.5} />
              </ThemeIcon>
              <Stack gap={4}>
                <Text fw={500} fz="sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {benefit.title}
                </Text>
                <Text fz="xs" c="dimmed" lh={1.4}>
                  {benefit.description}
                </Text>
              </Stack>
            </Group>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
