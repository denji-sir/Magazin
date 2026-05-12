import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Box,
  Group,
  Button,
  NumberInput,
  Badge,
  Image,
  Divider,
  Breadcrumbs,
  Anchor,
  Tabs,
  Loader,
  ActionIcon,
} from '@mantine/core';
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../shared/api/CartContext';
import { api } from '../shared/api/api';
import toast from 'react-hot-toast';
import { useFavorites } from '../shared/api/FavoritesContext';
import { FavoriteAuthModal } from '../shared/ui/FavoriteAuthModal';

export function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [authModalOpened, setAuthModalOpened] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`/catalog/products/${id}/`);
        const p = resp.data;
        setProduct({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          category: p.category,
          image: p.image || p.image_url,
          isNew: Boolean(p.isNew),
          description: p.description || '',
          material: p.material || '—',
          size: p.size || '—',
          inStock: Number(p.stock_quantity || 0),
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <Container py={120}><Loader color="gold" /></Container>;
  }

  if (!product) {
    return (
      <Container size="xl" py={100}>
        <Stack align="center">
          <Title order={2}>Товар не найден</Title>
          <Button variant="subtle" color="gold" component={Link} to="/catalog">Вернуться в каталог</Button>
        </Stack>
      </Container>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity);
      toast.success(`${product.name} добавлен в корзину`);
    } catch {
      toast.error('Не удалось добавить товар в корзину');
    }
  };

  const handleFavorite = async () => {
    const result = await toggleFavorite(product.id);
    if (result.unauthorized) {
      setAuthModalOpened(true);
      return;
    }
    toast.success(result.isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного');
  };

  const breadcrumbs = [
    { title: 'Главная', href: '/' },
    { title: 'Каталог', href: '/catalog' },
    { title: product.name, href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} fz="xs" c={index === 2 ? 'dark' : 'dimmed'}>
      {item.title}
    </Anchor>
  ));

  return (
    <Box py={40} bg="var(--color-bg)">
      <Container size="xl">
        <Breadcrumbs mb="xl">{breadcrumbs}</Breadcrumbs>

        <Grid gutter={60}>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Box pos="relative" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <Image src={product.image} alt={product.name} radius="xl" style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
              {product.isNew && (
                <Badge pos="absolute" top={24} left={24} size="lg" variant="filled" color="gold">NEW COLLECTION</Badge>
              )}
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="xl">
              <Box>
                <Text c="gold" fw={500} fz="xs" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }} mb={8}>{product.category || 'Украшения'}</Text>
                <Title order={1} fz="2.5rem" mb="md">{product.name}</Title>
                <Text fz="1.5rem" fw={600} c="var(--color-graphite)">{product.price.toLocaleString()} ₽</Text>
              </Box>

              <Divider color="var(--color-border)" opacity={0.5} />

              <Stack gap="md">
                <Text fz="sm" c="var(--color-secondary)" lh={1.7}>{product.description || 'Описание скоро будет добавлено.'}</Text>
                <Group gap="xl" mt="sm">
                  <Box>
                    <Text fz="xs" c="dimmed" mb={4}>Материал</Text>
                    <Text fz="sm" fw={500}>{product.material}</Text>
                  </Box>
                  <Box>
                    <Text fz="xs" c="dimmed" mb={4}>Размер</Text>
                    <Text fz="sm" fw={500}>{product.size}</Text>
                  </Box>
                </Group>
              </Stack>

              <Box>
                <Group gap="md" align="flex-end">
                  <Box style={{ width: 120 }}>
                    <Text fz="xs" fw={500} mb={8}>Количество</Text>
                    <NumberInput value={quantity} onChange={(v) => setQuantity(Number(v) || 1)} min={1} max={product.inStock || 1} disabled={product.inStock === 0} />
                  </Box>
                  <Button size="lg" style={{ flex: 1 }} color="dark" leftSection={<ShoppingBag size={20} />} disabled={product.inStock === 0} onClick={handleAddToCart}>
                    {product.inStock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                  </Button>
                  <ActionIcon variant="outline" color={isFavorite(product.id) ? 'red' : 'dark'} size={48} radius="md" onClick={handleFavorite}>
                    <Heart size={20} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                  </ActionIcon>
                </Group>
                {product.inStock > 0 && <Text fz="xs" c="success" mt="xs">В наличии: {product.inStock} шт.</Text>}
              </Box>

              <Stack gap="sm" mt="xl">
                <Group gap="md"><Truck size={18} color="var(--color-secondary)" /><Text fz="xs" c="dimmed">Бесплатная доставка при заказе от 5 000 ₽</Text></Group>
                <Group gap="md"><RotateCcw size={18} color="var(--color-secondary)" /><Text fz="xs" c="dimmed">14 дней на возврат товара</Text></Group>
                <Group gap="md"><ShieldCheck size={18} color="var(--color-secondary)" /><Text fz="xs" c="dimmed">Гарантия на изделие 6 месяцев</Text></Group>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        <Box mt={100}>
          <Tabs defaultValue="details" color="gold">
            <Tabs.List>
              <Tabs.Tab value="details">Особенности</Tabs.Tab>
              <Tabs.Tab value="care">Уход за изделием</Tabs.Tab>
              <Tabs.Tab value="shipping">Доставка</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="details" pt="xl"><Text fz="sm" lh={1.8} maw={800}>Каждое изделие проходит контроль качества перед продажей.</Text></Tabs.Panel>
            <Tabs.Panel value="care" pt="xl"><Text fz="sm" lh={1.8} maw={800}>Храните украшения в сухом месте, избегайте контакта с химией и водой.</Text></Tabs.Panel>
            <Tabs.Panel value="shipping" pt="xl"><Text fz="sm" lh={1.8} maw={800}>Доставка осуществляется через тестовый механизм ПВЗ в рамках проекта.</Text></Tabs.Panel>
          </Tabs>
        </Box>
      </Container>
      <FavoriteAuthModal opened={authModalOpened} onClose={() => setAuthModalOpened(false)} />
    </Box>
  );
}
