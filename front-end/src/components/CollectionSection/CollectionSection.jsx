import { Container, Title, SimpleGrid, Card, Image, Text, Box, ActionIcon } from '@mantine/core';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './CollectionSection.module.css';

const COLLECTIONS = [
  {
    title: 'Кольца',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    link: '/catalog?category=rings',
  },
  {
    title: 'Подвески',
    image: 'https://images.unsplash.com/photo-1599643478123-558f4a2114de?q=80&w=1000&auto=format&fit=crop',
    link: '/catalog?category=pendants',
  },
  {
    title: 'Серьги',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    link: '/catalog?category=earrings',
  },
];

export function CollectionSection() {
  return (
    <Box component="section" py={96} bg="var(--color-bg)">
      <Container size="xl">
        <Box mb={48}>
          <Text fw={500} fz="sm" c="gold" style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }} mb="xs">
            Новая коллекция
          </Text>
          <Title order={2} className={styles.title}>
            Весна 2026
          </Title>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          {COLLECTIONS.map((col) => (
            <Card 
              key={col.title} 
              padding={0} 
              radius="lg" 
              className={styles.card}
              component={Link}
              to={col.link}
            >
              <Box pos="relative" h={450} className={styles.imageWrapper}>
                <Image 
                  src={col.image} 
                  alt={col.title} 
                  h="100%" 
                  fallbackSrc="https://placehold.co/600x800?text=Collection"
                />
                <Box className={styles.overlay} />
                <Box className={styles.content}>
                  <Stack gap={4}>
                    <Title order={3} fz="lg" c="white" fw={400} style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.05em' }}>
                      {col.title.toUpperCase()}
                    </Title>
                    <Group gap={4} className={styles.linkGroup}>
                      <Text fz="xs" c="white" opacity={0.8}>Перейти</Text>
                      <ArrowUpRight size={14} color="white" />
                    </Group>
                  </Stack>
                </Box>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
import { Stack } from '@mantine/core';
