import { useEffect, useMemo, useState } from 'react';
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
  Loader,
  Center,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../entities/product/ui/ProductCard';
import { api } from '../shared/api/api';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryFromUrl = searchParams.get('search') || '';
    if (queryFromUrl !== search) {
      setSearch(queryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [productsResp, categoriesResp] = await Promise.all([
          api.get('/catalog/products/', {
            params: {
              ordering: '-created_at',
              ...(search.trim() ? { search: search.trim() } : {}),
            },
          }),
          api.get('/catalog/categories/'),
        ]);

        const productRows = (productsResp.data.results || productsResp.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          category: p.category,
          image: p.image || p.image_url,
          isNew: Boolean(p.isNew),
          inStock: Number(p.stock_quantity || 0),
          material: p.material || '',
        }));
        const categoryRows = (categoriesResp.data.results || categoriesResp.data || []).map((c) => ({
          value: c.slug,
          label: c.name,
        }));

        setProducts(productRows);
        setCategories(categoryRows);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(load, 250);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.category))
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return Number(b.isNew) - Number(a.isNew);
      });
  }, [products, search, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (value) => {
    setSelectedCategories((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const clearFilters = () => {
    setSearch('');
    setSearchParams({}, { replace: true });
    setSortBy('newest');
    setSelectedCategories([]);
    setPriceRange([0, 20000]);
  };

  const FiltersContent = (
    <Stack gap="xl">
      <Box>
        <Text fw={600} fz="sm" mb="md" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Категории</Text>
        <Stack gap="xs">
          {categories.map((cat) => (
            <Checkbox key={cat.value} label={cat.label} checked={selectedCategories.includes(cat.value)} onChange={() => toggleCategory(cat.value)} color="dark" />
          ))}
        </Stack>
      </Box>

      <Box>
        <Text fw={600} fz="sm" mb="md" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Цена (₽)</Text>
        <Box px="xs">
          <RangeSlider min={0} max={20000} step={500} value={priceRange} onChange={setPriceRange} color="gold" label={(value) => `${value} ₽`} />
          <Group justify="space-between" mt="xs">
            <Text fz="xs" c="dimmed">{priceRange[0]} ₽</Text>
            <Text fz="xs" c="dimmed">{priceRange[1]} ₽</Text>
          </Group>
        </Box>
      </Box>

      <Button variant="subtle" color="dimmed" size="xs" onClick={clearFilters} leftSection={<X size={14} />}>Сбросить фильтры</Button>
    </Stack>
  );

  if (loading) {
    return <Center py={120}><Loader color="gold" /></Center>;
  }

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size="xl">
        <Stack gap={40}>
          <Box>
            <Title order={1} mb="xs">Каталог</Title>
            <Text c="dimmed" fz="sm">Всего украшений: {filteredProducts.length}</Text>
          </Box>

          <Group justify="space-between">
            <Group gap="md" style={{ flex: 1, maxWidth: 600 }}>
              <TextInput
                placeholder="Поиск по названию..."
                leftSection={<Search size={16} />}
                value={search}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setSearch(value);
                  if (value.trim()) {
                    setSearchParams({ search: value.trim() }, { replace: true });
                  } else {
                    setSearchParams({}, { replace: true });
                  }
                }}
                style={{ flex: 1 }}
              />
              <Button variant="light" color="dark" leftSection={<SlidersHorizontal size={16} />} onClick={open} visibleFrom="md">Фильтры</Button>
              <ActionIcon variant="light" color="dark" size="lg" onClick={open} hiddenFrom="md"><SlidersHorizontal size={18} /></ActionIcon>
            </Group>

            <Select
              placeholder="Сортировка"
              value={sortBy}
              onChange={(v) => setSortBy(v || 'newest')}
              data={[
                { value: 'newest', label: 'Сначала новые' },
                { value: 'price-asc', label: 'Дешевле' },
                { value: 'price-desc', label: 'Дороже' },
                { value: 'name', label: 'По названию' },
              ]}
              style={{ width: 220 }}
              allowDeselect={false}
            />
          </Group>

          <Grid gutter={40}>
            <Grid.Col span={3} visibleFrom="md">
              <Box p="xl" bg="white" style={{ borderRadius: 'var(--radius-lg)', position: 'sticky', top: 100 }}>{FiltersContent}</Box>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 9 }}>
              {filteredProducts.length > 0 ? (
                <Grid gutter="xl">
                  {filteredProducts.map((product) => (
                    <Grid.Col key={product.id} span={{ base: 6, sm: 4 }}>
                      <ProductCard product={product} />
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <Stack align="center" py={100}>
                  <Text fz="lg" fw={500}>Ничего не найдено</Text>
                  <Text c="dimmed" fz="sm">Попробуйте изменить параметры фильтрации или поиска</Text>
                  <Button variant="subtle" color="gold" mt="md" onClick={clearFilters}>Сбросить всё</Button>
                </Stack>
              )}
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>

      <Drawer opened={opened} onClose={close} title="Фильтры" padding="xl" size="md" position="right">
        {FiltersContent}
        <Button fullWidth mt={40} color="dark" onClick={close}>Применить</Button>
      </Drawer>
    </Box>
  );
}
