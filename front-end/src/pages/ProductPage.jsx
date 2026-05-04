import { useState, useMemo } from 'react';
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
  Tabs
} from '@mantine/core';
import { ShoppingBag, Heart, Share2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../shared/api/CartContext';
import toast from 'react-hot-toast';

// MOCK DATA (same as catalog for consistency)
const ALL_PRODUCTS = [
  { id: 1, name: 'Кольцо «Luna»', price: 5990, category: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop', isNew: true, description: 'Изящное кольцо из серебра 925 пробы с натуральным лунным камнем. Минималистичный дизайн подчеркивает природную красоту камня.', material: 'Серебро 925, Лунный камень', weight: '2.4 г', inStock: 5 },
  { id: 2, name: 'Серьги «Aurora»', price: 6490, category: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop', isNew: false, description: 'Серьги-капли с перламутром. Элегантный выбор для вечернего образа или повседневной роскоши.', material: 'Серебро 925, Перламутр', weight: '3.1 г', inStock: 3 },
  { id: 3, name: 'Колье «Sol»', price: 7990, category: 'pendants', image: 'https://images.unsplash.com/photo-1599643478123-558f4a2114de?q=80&w=1000&auto=format&fit=crop', isNew: true, description: 'Массивное колье с солнечным камнем. Символ тепла и жизненной энергии.', material: 'Серебро 925, Солнечный камень', weight: '5.2 г', inStock: 2 },
  { id: 4, name: 'Браслет «Natura»', price: 4990, category: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop', isNew: false, description: 'Плетеный серебряный браслет. Классика, которая никогда не выйдет из моды.', material: 'Серебро 925', weight: '4.5 г', inStock: 0 },
];

export function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => 
    ALL_PRODUCTS.find(p => p.id === parseInt(id)), 
  [id]);

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

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} добавлен в корзину`);
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
          {/* Gallery Placeholder */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Box pos="relative" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <Image 
                src={product.image} 
                alt={product.name} 
                radius="xl"
                style={{ aspectRatio: '4/5', objectFit: 'cover' }}
              />
              {product.isNew && (
                <Badge 
                  pos="absolute" 
                  top={24} 
                  left={24} 
                  size="lg" 
                  variant="filled" 
                  color="gold"
                >
                  NEW COLLECTION
                </Badge>
              )}
            </Box>
          </Grid.Col>

          {/* Info */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="xl">
              <Box>
                <Text c="gold" fw={500} fz="xs" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }} mb={8}>
                  {product.category === 'rings' ? 'Кольца' : product.category === 'earrings' ? 'Серьги' : 'Украшения'}
                </Text>
                <Title order={1} fz="2.5rem" mb="md">{product.name}</Title>
                <Text fz="1.5rem" fw={600} c="var(--color-graphite)">{product.price.toLocaleString()} ₽</Text>
              </Box>

              <Divider color="var(--color-border)" opacity={0.5} />

              <Stack gap="md">
                <Text fz="sm" c="var(--color-secondary)" lh={1.7}>
                  {product.description}
                </Text>

                <Group gap="xl" mt="sm">
                  <Box>
                    <Text fz="xs" c="dimmed" mb={4}>Материал</Text>
                    <Text fz="sm" fw={500}>{product.material}</Text>
                  </Box>
                  <Box>
                    <Text fz="xs" c="dimmed" mb={4}>Вес</Text>
                    <Text fz="sm" fw={500}>{product.weight}</Text>
                  </Box>
                </Group>
              </Stack>

              <Box>
                <Group gap="md" align="flex-end">
                  <Box style={{ width: 120 }}>
                    <Text fz="xs" fw={500} mb={8}>Количество</Text>
                    <NumberInput
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={product.inStock || 1}
                      disabled={product.inStock === 0}
                    />
                  </Box>
                  <Button
                    size="lg"
                    style={{ flex: 1 }}
                    color="dark"
                    leftSection={<ShoppingBag size={20} />}
                    disabled={product.inStock === 0}
                    onClick={handleAddToCart}
                  >
                    {product.inStock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                  </Button>
                  <ActionIcon variant="outline" color="dark" size={48} radius="md">
                    <Heart size={20} />
                  </ActionIcon>
                </Group>
                {product.inStock > 0 && (
                  <Text fz="xs" c="success" mt="xs">В наличии: {product.inStock} шт.</Text>
                )}
              </Box>

              <Stack gap="sm" mt="xl">
                <Group gap="md">
                  <Truck size={18} color="var(--color-secondary)" />
                  <Text fz="xs" c="dimmed">Бесплатная доставка при заказе от 5 000 ₽</Text>
                </Group>
                <Group gap="md">
                  <RotateCcw size={18} color="var(--color-secondary)" />
                  <Text fz="xs" c="dimmed">14 дней на возврат товара</Text>
                </Group>
                <Group gap="md">
                  <ShieldCheck size={18} color="var(--color-secondary)" />
                  <Text fz="xs" c="dimmed">Гарантия на изделие 6 месяцев</Text>
                </Group>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Tabs for more info */}
        <Box mt={100}>
          <Tabs defaultValue="details" color="gold">
            <Tabs.List>
              <Tabs.Tab value="details">Особенности</Tabs.Tab>
              <Tabs.Tab value="care">Уход за изделием</Tabs.Tab>
              <Tabs.Tab value="shipping">Доставка</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="details" pt="xl">
              <Text fz="sm" lh={1.8} maw={800}>
                Наши мастера уделяют особое внимание каждой детали. Мы используем традиционные методы литья и ручную полировку, чтобы достичь идеального блеска. Каждое изделие проходит строгий контроль качества перед тем, как попасть к вам.
              </Text>
            </Tabs.Panel>
            
            <Tabs.Panel value="care" pt="xl">
              <Text fz="sm" lh={1.8} maw={800}>
                Чтобы ваше украшение LUMINA сохраняло свой первозданный вид, мы рекомендуем избегать контакта с водой, парфюмерией и косметикой. Храните изделия в фирменной упаковке или в мягком мешочке. Чистите украшения только специальной салфеткой для серебра.
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="shipping" pt="xl">
              <Text fz="sm" lh={1.8} maw={800}>
                Доставка осуществляется курьерской службой СДЭК до двери или до пункта выдачи заказов. Срок доставки составляет от 2 до 7 рабочих дней в зависимости от вашего региона.
              </Text>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}
