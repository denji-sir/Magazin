import { useState, useMemo } from 'react';
import { 
  Container, 
  Grid, 
  Stack, 
  Title, 
  Text, 
  Box, 
  TextInput, 
  Select, 
  Group, 
  Checkbox, 
  RangeSlider, 
  Button, 
  Drawer,
  ActionIcon,
  Collapse
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../entities/product/ui/ProductCard';

// MOCK DATA
const ALL_PRODUCTS = [
  { id: 1, name: 'Кольцо «Luna»', price: 5990, category: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', isNew: true },
  { id: 2, name: 'Серьги «Aurora»', price: 6490, category: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', isNew: false },
  { id: 3, name: 'Колье «Sol»', price: 7990, category: 'pendants', image: 'https://images.unsplash.com/photo-1599643478123-558f4a2114de?q=80&w=600&auto=format&fit=crop', isNew: true },
  { id: 4, name: 'Браслет «Natura»', price: 4990, category: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', isNew: false },
  { id: 5, name: 'Кольцо «Eclipse»', price: 6290, category: 'rings', image: 'https://images.unsplash.com/photo-1603561591411-0e7320b97d33?q=80&w=600&auto=format&fit=crop', isNew: false },
  { id: 6, name: 'Серьги «Minimal»', price: 3990, category: 'earrings', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop', isNew: false },
  { id: 7, name: 'Колье «Pearl»', price: 12990, category: 'pendants', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop', isNew: false },
  { id: 8, name: 'Браслет «Silver Line»', price: 5490, category: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', isNew: true },
];

const CATEGORIES = [
  { value: 'rings', label: 'Кольца' },
  { value: 'earrings', label: 'Серьги' },
  { value: 'pendants', label: 'Подвески и колье' },
  { value: 'bracelets', label: 'Браслеты' },
];

export function CatalogPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category))
      .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.isNew - a.isNew; // newest
      });
  }, [search, sortBy, selectedCategories, priceRange]);

  const toggleCategory = (value) => {
    setSelectedCategories(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSortBy('newest');
    setSelectedCategories([]);
    setPriceRange([0, 20000]);
  };

  const FiltersContent = (
    <Stack gap="xl">
      <Box>
        <Text fw={600} fz="sm" mb="md" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Категории
        </Text>
        <Stack gap="xs">
          {CATEGORIES.map(cat => (
            <Checkbox
              key={cat.value}
              label={cat.label}
              checked={selectedCategories.includes(cat.value)}
              onChange={() => toggleCategory(cat.value)}
              color="dark"
            />
          ))}
        </Stack>
      </Box>

      <Box>
        <Text fw={600} fz="sm" mb="md" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Цена (₽)
        </Text>
        <Box px="xs">
          <RangeSlider
            min={0}
            max={20000}
            step={500}
            value={priceRange}
            onChange={setPriceRange}
            color="gold"
            label={value => `${value} ₽`}
          />
          <Group justify="space-between" mt="xs">
            <Text fz="xs" c="dimmed">{priceRange[0]} ₽</Text>
            <Text fz="xs" c="dimmed">{priceRange[1]} ₽</Text>
          </Group>
        </Box>
      </Box>

      <Button variant="subtle" color="dimmed" size="xs" onClick={clearFilters} leftSection={<X size={14} />}>
        Сбросить фильтры
      </Button>
    </Stack>
  );

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size="xl">
        <Stack gap={40}>
          {/* Header */}
          <Box>
            <Title order={1} mb="xs">Каталог</Title>
            <Text c="dimmed" fz="sm">Всего украшений: {filteredProducts.length}</Text>
          </Box>

          {/* Controls */}
          <Group justify="space-between">
            <Group gap="md" style={{ flex: 1, maxWidth: 600 }}>
              <TextInput
                placeholder="Поиск по названию..."
                leftSection={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Button 
                variant="light" 
                color="dark" 
                leftSection={<SlidersHorizontal size={16} />}
                onClick={open}
                visibleFrom="md"
              >
                Фильтры
              </Button>
              <ActionIcon 
                variant="light" 
                color="dark" 
                size="lg" 
                onClick={open} 
                hiddenFrom="md"
              >
                <SlidersHorizontal size={18} />
              </ActionIcon>
            </Group>

            <Select
              placeholder="Сортировка"
              value={sortBy}
              onChange={setSortBy}
              data={[
                { value: 'newest', label: 'Сначала новые' },
                { value: 'price-asc', label: 'Дешевле' },
                { value: 'price-desc', label: 'Дороже' },
                { value: 'name', label: 'По названию' },
              ]}
              style={{ width: 200 }}
              allowDeselect={false}
            />
          </Group>

          {/* Layout */}
          <Grid gutter={40}>
            {/* Sidebar Desktop */}
            <Grid.Col span={3} visibleFrom="md">
              <Box p="xl" bg="white" style={{ borderRadius: 'var(--radius-lg)', position: 'sticky', top: 100 }}>
                {FiltersContent}
              </Box>
            </Grid.Col>

            {/* Grid */}
            <Grid.Col span={{ base: 12, md: 9 }}>
              {filteredProducts.length > 0 ? (
                <Grid gutter="xl">
                  {filteredProducts.map(product => (
                    <Grid.Col key={product.id} span={{ base: 6, sm: 4 }}>
                      <ProductCard product={product} />
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <Stack align="center" py={100}>
                  <Text fz="lg" fw={500}>Ничего не найдено</Text>
                  <Text c="dimmed" fz="sm">Попробуйте изменить параметры фильтрации или поиска</Text>
                  <Button variant="subtle" color="gold" mt="md" onClick={clearFilters}>
                    Сбросить всё
                  </Button>
                </Stack>
              )}
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Фильтры"
        padding="xl"
        size="md"
        position="right"
      >
        {FiltersContent}
        <Button fullWidth mt={40} color="dark" onClick={close}>
          Применить
        </Button>
      </Drawer>
    </Box>
  );
}
