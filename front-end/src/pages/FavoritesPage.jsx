import { Box, Button, Card, Container, Grid, Group, Image, Loader, Stack, Text, Title, Center, ActionIcon } from '@mantine/core';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../shared/api/FavoritesContext';
import { useAuth } from '../shared/api/AuthContext';
import { useCart } from '../shared/api/CartContext';
import toast from 'react-hot-toast';

export function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { items, loading, toggleFavorite } = useFavorites();
  const { addItem } = useCart();

  const removeFromFavorites = async (productId) => {
    await toggleFavorite(productId);
    toast.success('Товар удален из избранного');
  };

  const addToCart = async (item) => {
    await addItem({
      id: item.product_id,
      name: item.product_name,
      price: Number(item.product_price),
      image: item.product_image,
      inStock: true,
    });
    toast.success('Товар добавлен в корзину');
  };

  if (!isAuthenticated) {
    return (
      <Container py={100}>
        <Stack align="center" gap="md">
          <Heart size={48} />
          <Title order={2}>Войдите, чтобы увидеть избранное</Title>
          <Button component={Link} to="/auth/login" color="dark">Перейти ко входу</Button>
        </Stack>
      </Container>
    );
  }

  if (loading) {
    return <Center py={120}><Loader color="gold" /></Center>;
  }

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size="xl">
        <Stack gap="xl">
          <Title order={1}>Избранное</Title>

          {items.length === 0 ? (
            <Card withBorder p="xl" radius="lg">
              <Text c="dimmed">Пока нет сохраненных товаров.</Text>
            </Card>
          ) : (
            <Grid gutter="xl">
              {items.map((item) => (
                <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card withBorder radius="lg" p="md">
                    <Card.Section component={Link} to={`/catalog/${item.product_id}`}>
                      <Image src={item.product_image} height={280} fit="cover" fallbackSrc="https://placehold.co/400x500?text=Product" />
                    </Card.Section>

                    <Stack mt="md" gap={6}>
                      <Text fw={600}>{item.product_name}</Text>
                      <Text c="dimmed" fz="sm">{item.category}</Text>
                      <Text fw={700}>{Number(item.product_price).toLocaleString()} ₽</Text>
                    </Stack>

                    <Group mt="md" grow>
                      <Button variant="light" color="dark" leftSection={<ShoppingBag size={16} />} onClick={() => addToCart(item)}>
                        В корзину
                      </Button>
                      <ActionIcon variant="light" color="red" size="lg" onClick={() => removeFromFavorites(item.product_id)}>
                        <Trash2 size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
