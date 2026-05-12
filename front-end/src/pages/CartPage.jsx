import { 
  Container, 
  Grid, 
  Stack, 
  Title, 
  Text, 
  Box, 
  Group, 
  Button, 
  Image, 
  ActionIcon, 
  NumberInput, 
  Divider,
  Paper
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '../shared/api/CartContext';

export function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, itemCount } = useCart();
  const handleQuantityChange = async (itemId, val) => {
    try {
      await updateQuantity(itemId, Number(val) || 1);
    } catch {}
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch {}
  };

  if (items.length === 0) {
    return (
      <Container size="xl" py={100}>
        <Stack align="center" gap="lg">
          <Box p={40} bg="white" style={{ borderRadius: '50%', lineHeight: 0 }}>
            <ShoppingBag size={64} color="var(--color-beige)" strokeWidth={1} />
          </Box>
          <Stack gap={8} align="center">
            <Title order={2}>Ваша корзина пуста</Title>
            <Text c="dimmed">Самое время добавить в нее что-нибудь прекрасное</Text>
          </Stack>
          <Button 
            variant="filled" 
            color="dark" 
            size="lg" 
            mt="md"
            component={Link} 
            to="/catalog"
          >
            Перейти в каталог
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size="xl">
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={1}>Корзина</Title>
            <Text c="dimmed" fz="sm">{itemCount} товаров</Text>
          </Group>

          <Grid gutter={40}>
            {/* List of items */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="md">
                {items.map((item) => (
                  <Paper key={item.id} p="md" radius="lg" withBorder>
                    <Grid align="center">
                      <Grid.Col span={{ base: 4, sm: 2 }}>
                        <Link to={`/catalog/${item.productId || item.id}`}>
                          <Image 
                            src={item.image} 
                            radius="md" 
                            height={100} 
                            style={{ objectFit: 'cover' }}
                          />
                        </Link>
                      </Grid.Col>
                      
                      <Grid.Col span={{ base: 8, sm: 4 }}>
                        <Stack gap={4}>
                          <Link to={`/catalog/${item.productId || item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Text fw={500} fz="sm">{item.name}</Text>
                          </Link>
                          <Text fz="xs" c="dimmed">{item.category}</Text>
                        </Stack>
                      </Grid.Col>

                      <Grid.Col span={{ base: 6, sm: 3 }}>
                        <Group gap="xs">
                          <NumberInput
                            value={item.quantity}
                            onChange={(val) => handleQuantityChange(item.id, val)}
                            min={1}
                            max={99}
                            size="sm"
                            style={{ width: 80 }}
                          />
                          <ActionIcon 
                            variant="subtle" 
                            color="red" 
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 size={16} />
                          </ActionIcon>
                        </Group>
                      </Grid.Col>

                      <Grid.Col span={{ base: 6, sm: 3 }}>
                        <Text fw={600} fz="md" ta="right">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </Text>
                        <Text fz="xs" c="dimmed" ta="right">
                          {item.price.toLocaleString()} ₽ / шт.
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
              
              <Button 
                variant="subtle" 
                color="dark" 
                leftSection={<ChevronLeft size={16} />} 
                mt="xl"
                component={Link}
                to="/catalog"
              >
                Вернуться к покупкам
              </Button>
            </Grid.Col>

            {/* Summary */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="xl" radius="xl" withBorder pos="sticky" style={{ top: 100 }}>
                <Title order={3} mb="xl" fz="lg">Ваш заказ</Title>
                
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text fz="sm" c="dimmed">Товары ({itemCount})</Text>
                    <Text fz="sm" fw={500}>{totalPrice.toLocaleString()} ₽</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="dimmed">Доставка</Text>
                    <Text fz="sm" c="success" fw={500}>Бесплатно</Text>
                  </Group>
                  
                  <Divider my="sm" />
                  
                  <Group justify="space-between">
                    <Text fz="lg" fw={600}>Итого</Text>
                    <Text fz="lg" fw={700} c="gold">{totalPrice.toLocaleString()} ₽</Text>
                  </Group>

                  <Button 
                    size="lg" 
                    color="dark" 
                    mt="xl" 
                    fullWidth
                    rightSection={<ArrowRight size={18} />}
                    component={Link}
                    to="/checkout"
                  >
                    Оформить заказ
                  </Button>

                  <Text fz="xs" c="dimmed" ta="center" mt="sm">
                    Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности.
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
