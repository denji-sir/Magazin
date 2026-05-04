import { Container, Title, SimpleGrid, Text, Box, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../../entities/product/ui/ProductCard';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Кольцо «Luna»',
    price: 5990,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 2,
    name: 'Серьги «Aurora»',
    price: 6490,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    isNew: false,
  },
  {
    id: 3,
    name: 'Колье «Sol»',
    price: 7990,
    image: 'https://images.unsplash.com/photo-1599643478123-558f4a2114de?q=80&w=600&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 4,
    name: 'Браслет «Natura»',
    price: 4990,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    isNew: false,
  },
];

export function PopularSection() {
  return (
    <Box component="section" py={96}>
      <Container size="xl">
        <Group justify="space-between" align="flex-end" mb={48}>
          <Box>
            <Text fw={500} fz="sm" c="gold" style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }} mb="xs">
              Бестселлеры
            </Text>
            <Title order={2} style={{ maxWidth: 400 }}>
              Популярное
            </Title>
          </Box>
          <Button 
            variant="subtle" 
            color="dark" 
            component={Link} 
            to="/catalog"
            rightSection={<ArrowRight size={16} />}
            visibleFrom="sm"
          >
            Смотреть все
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="xl">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>

        <Button 
          variant="outline" 
          color="dark" 
          fullWidth 
          mt="xl" 
          component={Link} 
          to="/catalog"
          hiddenFrom="sm"
        >
          Смотреть все товары
        </Button>
      </Container>
    </Box>
  );
}
