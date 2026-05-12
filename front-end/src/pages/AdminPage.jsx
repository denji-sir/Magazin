import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  Ban,
  LayoutDashboard,
  MapPin,
  Package,
  Pencil,
  Plus,
  Save,
  Search,
  Shield,
  ShoppingCart,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../shared/api/api';

const ORDER_STATUS_OPTIONS = [
  'created',
  'pending_payment',
  'paid',
  'processing',
  'assembling',
  'sent_to_pickup',
  'ready_for_pickup',
  'received',
  'canceled',
];

const PAYMENT_STATUS_OPTIONS = ['pending_payment', 'processing', 'paid', 'error', 'canceled'];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);

  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingPickupPoint, setEditingPickupPoint] = useState(null);

  const [productModalOpened, productModal] = useDisclosure(false);
  const [categoryModalOpened, categoryModal] = useDisclosure(false);
  const [pickupModalOpened, pickupModal] = useDisclosure(false);

  const productForm = useForm({
    initialValues: {
      name: '',
      price: 0,
      category: '',
      stock_quantity: 0,
      description: '',
      material: '',
      size: '',
      image_url: '',
      is_new: false,
      is_popular: false,
    },
  });

  const categoryForm = useForm({
    initialValues: {
      name: '',
      slug: '',
    },
  });

  const pickupForm = useForm({
    initialValues: {
      name: '',
      city: '',
      address: '',
      schedule: '',
      eta_text: '',
      is_active: true,
    },
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsResp, productsResp, ordersResp, usersResp, categoriesResp, pickupResp] = await Promise.all([
        api.get('/admin/stats/'),
        api.get('/catalog/admin/products/'),
        api.get('/orders/admin/'),
        api.get('/users/admin/'),
        api.get('/catalog/admin/categories/'),
        api.get('/pickup-points/admin/'),
      ]);

      setStats(statsResp.data);
      setProducts(productsResp.data.results || productsResp.data || []);
      setOrders(ordersResp.data.results || ordersResp.data || []);
      setUsers(usersResp.data.results || usersResp.data || []);
      setCategories(categoriesResp.data.results || categoriesResp.data || []);
      setPickupPoints(pickupResp.data.results || pickupResp.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    return products.filter((p) => String(p.name || '').toLowerCase().includes(productSearch.toLowerCase()));
  }, [products, productSearch]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const query = userSearch.toLowerCase();
    return users.filter((u) => {
      const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      return String(u.email || '').toLowerCase().includes(query) || fullName.includes(query);
    });
  }, [users, userSearch]);

  const openNewProductModal = () => {
    setEditingProduct(null);
    productForm.reset();
    productModal.open();
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    const categoryBySlug = categories.find((c) => c.slug === product.category);
    productForm.setValues({
      name: product.name || '',
      price: Number(product.price || 0),
      category: String(categoryBySlug?.id || ''),
      stock_quantity: Number(product.stock_quantity || 0),
      description: product.description || '',
      material: product.material || '',
      size: product.size || '',
      image_url: product.image_url || product.image || '',
      is_new: Boolean(product.isNew),
      is_popular: Boolean(product.is_popular),
    });
    productModal.open();
  };

  const saveProduct = async (values) => {
    const payload = {
      ...values,
      category: Number(values.category),
      price: Number(values.price),
      stock_quantity: Number(values.stock_quantity),
    };

    try {
      if (editingProduct) {
        await api.put(`/catalog/admin/products/${editingProduct.id}/`, payload);
        toast.success('Товар обновлен');
      } else {
        await api.post('/catalog/admin/products/', payload);
        toast.success('Товар создан');
      }
      productModal.close();
      await loadAll();
    } catch {
      toast.error('Не удалось сохранить товар');
    }
  };

  const removeProduct = async (id) => {
    try {
      await api.delete(`/catalog/admin/products/${id}/`);
      toast.success('Товар удален');
      await loadAll();
    } catch {
      toast.error('Не удалось удалить товар');
    }
  };

  const updateOrderStatus = async (orderId, statusValue) => {
    if (!statusValue) return;
    try {
      await api.patch(`/orders/admin/${orderId}/status/`, { status: statusValue });
      await loadAll();
    } catch {
      toast.error('Не удалось обновить статус заказа');
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    if (!paymentStatus) return;
    try {
      await api.patch(`/orders/admin/${orderId}/payment-status/`, { payment_status: paymentStatus });
      await loadAll();
    } catch {
      toast.error('Не удалось обновить статус оплаты');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.post(`/orders/admin/${orderId}/cancel/`, { reason: 'Отменено администратором' });
      toast.success('Заказ отменен');
      await loadAll();
    } catch {
      toast.error('Не удалось отменить заказ');
    }
  };

  const updateUserRole = async (userId, role) => {
    if (!role) return;
    try {
      await api.patch(`/users/admin/${userId}/`, { role });
      toast.success('Роль пользователя обновлена');
      await loadAll();
    } catch {
      toast.error('Не удалось изменить роль');
    }
  };

  const toggleUserBlock = async (userObj) => {
    try {
      await api.patch(`/users/admin/${userObj.id}/`, { isBlocked: !userObj.isBlocked });
      toast.success(userObj.isBlocked ? 'Пользователь разблокирован' : 'Пользователь заблокирован');
      await loadAll();
    } catch {
      toast.error('Не удалось изменить статус блокировки');
    }
  };

  const openNewCategoryModal = () => {
    setEditingCategory(null);
    categoryForm.reset();
    categoryModal.open();
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    categoryForm.setValues({ name: category.name || '', slug: category.slug || '' });
    categoryModal.open();
  };

  const saveCategory = async (values) => {
    try {
      if (editingCategory) {
        await api.put(`/catalog/admin/categories/${editingCategory.id}/`, values);
        toast.success('Категория обновлена');
      } else {
        await api.post('/catalog/admin/categories/', values);
        toast.success('Категория создана');
      }
      categoryModal.close();
      await loadAll();
    } catch {
      toast.error('Не удалось сохранить категорию');
    }
  };

  const removeCategory = async (id) => {
    try {
      await api.delete(`/catalog/admin/categories/${id}/`);
      toast.success('Категория удалена');
      await loadAll();
    } catch {
      toast.error('Не удалось удалить категорию');
    }
  };

  const openNewPickupModal = () => {
    setEditingPickupPoint(null);
    pickupForm.reset();
    pickupForm.setFieldValue('is_active', true);
    pickupModal.open();
  };

  const openEditPickupModal = (pickupPoint) => {
    setEditingPickupPoint(pickupPoint);
    pickupForm.setValues({
      name: pickupPoint.name || '',
      city: pickupPoint.city || '',
      address: pickupPoint.address || '',
      schedule: pickupPoint.schedule || '',
      eta_text: pickupPoint.eta_text || '',
      is_active: Boolean(pickupPoint.is_active),
    });
    pickupModal.open();
  };

  const savePickupPoint = async (values) => {
    try {
      if (editingPickupPoint) {
        await api.put(`/pickup-points/admin/${editingPickupPoint.id}/`, values);
        toast.success('ПВЗ обновлен');
      } else {
        await api.post('/pickup-points/admin/', values);
        toast.success('ПВЗ создан');
      }
      pickupModal.close();
      await loadAll();
    } catch {
      toast.error('Не удалось сохранить ПВЗ');
    }
  };

  const removePickupPoint = async (id) => {
    try {
      await api.delete(`/pickup-points/admin/${id}/`);
      toast.success('ПВЗ удален');
      await loadAll();
    } catch {
      toast.error('Не удалось удалить ПВЗ');
    }
  };

  if (loading) {
    return (
      <Center py={120}>
        <Loader color="gold" />
      </Center>
    );
  }

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size="xl">
        <Stack gap="xl">
          <Group justify="space-between">
            <Box>
              <Title order={1}>Панель управления</Title>
              <Text c="dimmed" fz="sm">
                Полный контроль каталога, заказов и пользователей
              </Text>
            </Box>
          </Group>

          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'products')} color="gold" variant="outline" radius="md">
            <Tabs.List bg="white" p={4} style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <Tabs.Tab value="products" leftSection={<Package size={16} />}>
                Товары
              </Tabs.Tab>
              <Tabs.Tab value="orders" leftSection={<ShoppingCart size={16} />}>
                Заказы
              </Tabs.Tab>
              <Tabs.Tab value="users" leftSection={<Users size={16} />}>
                Пользователи
              </Tabs.Tab>
              <Tabs.Tab value="categories" leftSection={<LayoutDashboard size={16} />}>
                Категории
              </Tabs.Tab>
              <Tabs.Tab value="pvz" leftSection={<MapPin size={16} />}>
                ПВЗ
              </Tabs.Tab>
              <Tabs.Tab value="stats" leftSection={<LayoutDashboard size={16} />}>
                Аналитика
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="products" pt="xl">
              <Paper withBorder radius="lg">
                <Group p="md" justify="space-between" bg="var(--color-bg)" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <TextInput
                    placeholder="Поиск товара..."
                    leftSection={<Search size={16} />}
                    maw={420}
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.currentTarget.value)}
                  />
                  <Button leftSection={<Plus size={16} />} color="dark" onClick={openNewProductModal}>
                    Добавить товар
                  </Button>
                </Group>

                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="xl">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Название</Table.Th>
                        <Table.Th>Категория</Table.Th>
                        <Table.Th>Цена</Table.Th>
                        <Table.Th>Остаток</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredProducts.map((product) => (
                        <Table.Tr key={product.id}>
                          <Table.Td c="dimmed">#{product.id}</Table.Td>
                          <Table.Td fw={500}>{product.name}</Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="gray">
                              {product.categoryName || product.category}
                            </Badge>
                          </Table.Td>
                          <Table.Td>{Number(product.price).toLocaleString()} ₽</Table.Td>
                          <Table.Td>{product.stock_quantity} шт.</Table.Td>
                          <Table.Td ta="right">
                            <Group justify="flex-end" gap={8}>
                              <ActionIcon variant="subtle" color="dark" onClick={() => openEditProductModal(product)}>
                                <Pencil size={16} />
                              </ActionIcon>
                              <ActionIcon variant="subtle" color="red" onClick={() => removeProduct(product.id)}>
                                <Trash2 size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="orders" pt="xl">
              <Paper withBorder radius="lg">
                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="md">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Заказ</Table.Th>
                        <Table.Th>Покупатель</Table.Th>
                        <Table.Th>Сумма</Table.Th>
                        <Table.Th>Статус заказа</Table.Th>
                        <Table.Th>Статус оплаты</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {orders.map((order) => (
                        <Table.Tr key={order.id}>
                          <Table.Td fw={500}>#{order.number || order.id}</Table.Td>
                          <Table.Td>
                            <Stack gap={0}>
                              <Text fz="sm">{order.first_name} {order.last_name}</Text>
                              <Text fz="xs" c="dimmed">{order.email}</Text>
                            </Stack>
                          </Table.Td>
                          <Table.Td fw={600}>{Number(order.total).toLocaleString()} ₽</Table.Td>
                          <Table.Td>
                            <Select
                              size="xs"
                              data={ORDER_STATUS_OPTIONS}
                              value={order.status}
                              onChange={(value) => updateOrderStatus(order.id, value)}
                              style={{ width: 170 }}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Select
                              size="xs"
                              data={PAYMENT_STATUS_OPTIONS}
                              value={order.payment_status}
                              onChange={(value) => updatePaymentStatus(order.id, value)}
                              style={{ width: 170 }}
                            />
                          </Table.Td>
                          <Table.Td ta="right">
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              leftSection={<Ban size={14} />}
                              onClick={() => cancelOrder(order.id)}
                            >
                              Отменить
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="users" pt="xl">
              <Paper withBorder radius="lg">
                <Group p="md" justify="space-between" bg="var(--color-bg)" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <TextInput
                    placeholder="Поиск по email или имени..."
                    leftSection={<Search size={16} />}
                    maw={420}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.currentTarget.value)}
                  />
                </Group>

                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="md">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Пользователь</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Роль</Table.Th>
                        <Table.Th>Статус</Table.Th>
                        <Table.Th ta="right">Управление</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredUsers.map((userRow) => (
                        <Table.Tr key={userRow.id}>
                          <Table.Td c="dimmed">#{userRow.id}</Table.Td>
                          <Table.Td>{`${userRow.firstName || ''} ${userRow.lastName || ''}`.trim() || '—'}</Table.Td>
                          <Table.Td>{userRow.email}</Table.Td>
                          <Table.Td>
                            <Select
                              size="xs"
                              data={[
                                { value: 'user', label: 'user' },
                                { value: 'admin', label: 'admin' },
                              ]}
                              value={userRow.role}
                              onChange={(value) => updateUserRole(userRow.id, value)}
                              style={{ width: 120 }}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Badge color={userRow.isBlocked ? 'red' : 'green'} variant="light">
                              {userRow.isBlocked ? 'Заблокирован' : 'Активен'}
                            </Badge>
                          </Table.Td>
                          <Table.Td ta="right">
                            <Button
                              size="xs"
                              variant="light"
                              color={userRow.isBlocked ? 'teal' : 'red'}
                              leftSection={<Shield size={14} />}
                              onClick={() => toggleUserBlock(userRow)}
                            >
                              {userRow.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="categories" pt="xl">
              <Paper withBorder radius="lg">
                <Group p="md" justify="space-between" bg="var(--color-bg)" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <Text fw={600}>Категории товаров</Text>
                  <Button leftSection={<Plus size={16} />} color="dark" onClick={openNewCategoryModal}>
                    Добавить категорию
                  </Button>
                </Group>

                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="xl">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Название</Table.Th>
                        <Table.Th>Slug</Table.Th>
                        <Table.Th>Товаров</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {categories.map((category) => (
                        <Table.Tr key={category.id}>
                          <Table.Td fw={500}>{category.name}</Table.Td>
                          <Table.Td>{category.slug}</Table.Td>
                          <Table.Td>{category.productCount || 0}</Table.Td>
                          <Table.Td ta="right">
                            <Group justify="flex-end" gap={8}>
                              <ActionIcon variant="subtle" color="dark" onClick={() => openEditCategoryModal(category)}>
                                <Pencil size={16} />
                              </ActionIcon>
                              <ActionIcon variant="subtle" color="red" onClick={() => removeCategory(category.id)}>
                                <Trash2 size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="pvz" pt="xl">
              <Paper withBorder radius="lg">
                <Group p="md" justify="space-between" bg="var(--color-bg)" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <Text fw={600}>Пункты выдачи</Text>
                  <Button leftSection={<Plus size={16} />} color="dark" onClick={openNewPickupModal}>
                    Добавить ПВЗ
                  </Button>
                </Group>

                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="xl">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Название</Table.Th>
                        <Table.Th>Город</Table.Th>
                        <Table.Th>Адрес</Table.Th>
                        <Table.Th>Доступность</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {pickupPoints.map((point) => (
                        <Table.Tr key={point.id}>
                          <Table.Td fw={500}>{point.name}</Table.Td>
                          <Table.Td>{point.city}</Table.Td>
                          <Table.Td>{point.address}</Table.Td>
                          <Table.Td>
                            <Badge color={point.is_active ? 'green' : 'red'} variant="light">
                              {point.is_active ? 'Активен' : 'Отключен'}
                            </Badge>
                          </Table.Td>
                          <Table.Td ta="right">
                            <Group justify="flex-end" gap={8}>
                              <ActionIcon variant="subtle" color="dark" onClick={() => openEditPickupModal(point)}>
                                <Pencil size={16} />
                              </ActionIcon>
                              <ActionIcon variant="subtle" color="red" onClick={() => removePickupPoint(point.id)}>
                                <Trash2 size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="stats" pt="xl">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                <Paper p="lg" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed">Товаров</Text>
                  <Title order={3}>{stats?.total_products || 0}</Title>
                </Paper>
                <Paper p="lg" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed">Пользователей</Text>
                  <Title order={3}>{stats?.total_users || 0}</Title>
                </Paper>
                <Paper p="lg" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed">Заказов</Text>
                  <Title order={3}>{stats?.total_orders || 0}</Title>
                </Paper>
                <Paper p="lg" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed">Оплаченная выручка</Text>
                  <Title order={3}>{Number(stats?.paid_revenue || 0).toLocaleString()} ₽</Title>
                </Paper>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="lg">
                <Paper p="lg" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed">Оплаченных заказов</Text>
                  <Title order={4}>{stats?.paid_orders || 0}</Title>
                </Paper>
                <Paper p="lg" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed">В обработке</Text>
                  <Title order={4}>{stats?.processing_orders || 0}</Title>
                </Paper>
                <Paper p="lg" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed">Готовы к выдаче</Text>
                  <Title order={4}>{stats?.ready_for_pickup_orders || 0}</Title>
                </Paper>
              </SimpleGrid>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>

      <Modal opened={productModalOpened} onClose={productModal.close} title={editingProduct ? 'Редактировать товар' : 'Новый товар'} size="lg" radius="lg">
        <form onSubmit={productForm.onSubmit(saveProduct)}>
          <Stack gap="md">
            <TextInput label="Название" required {...productForm.getInputProps('name')} />
            <SimpleGrid cols={2}>
              <NumberInput label="Цена" min={0} required {...productForm.getInputProps('price')} />
              <Select
                label="Категория"
                placeholder="Выберите категорию"
                data={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                required
                {...productForm.getInputProps('category')}
              />
            </SimpleGrid>
            <NumberInput label="Остаток" min={0} {...productForm.getInputProps('stock_quantity')} />
            <SimpleGrid cols={2}>
              <TextInput label="Материал" {...productForm.getInputProps('material')} />
              <TextInput label="Размер" {...productForm.getInputProps('size')} />
            </SimpleGrid>
            <TextInput label="URL изображения" {...productForm.getInputProps('image_url')} />
            <Textarea label="Описание" rows={4} {...productForm.getInputProps('description')} />
            <Group>
              <Switch label="Новинка" {...productForm.getInputProps('is_new', { type: 'checkbox' })} />
              <Switch label="Популярный" {...productForm.getInputProps('is_popular', { type: 'checkbox' })} />
            </Group>
            <Group justify="flex-end">
              <Button variant="subtle" color="dark" onClick={productModal.close}>
                Отмена
              </Button>
              <Button color="dark" type="submit" leftSection={<Save size={16} />}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={categoryModalOpened} onClose={categoryModal.close} title={editingCategory ? 'Редактировать категорию' : 'Новая категория'} size="md" radius="lg">
        <form onSubmit={categoryForm.onSubmit(saveCategory)}>
          <Stack gap="md">
            <TextInput label="Название" required {...categoryForm.getInputProps('name')} />
            <TextInput label="Slug" {...categoryForm.getInputProps('slug')} />
            <Group justify="flex-end">
              <Button variant="subtle" color="dark" onClick={categoryModal.close}>
                Отмена
              </Button>
              <Button color="dark" type="submit" leftSection={<Save size={16} />}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={pickupModalOpened} onClose={pickupModal.close} title={editingPickupPoint ? 'Редактировать ПВЗ' : 'Новый ПВЗ'} size="lg" radius="lg">
        <form onSubmit={pickupForm.onSubmit(savePickupPoint)}>
          <Stack gap="md">
            <TextInput label="Название" required {...pickupForm.getInputProps('name')} />
            <SimpleGrid cols={2}>
              <TextInput label="Город" required {...pickupForm.getInputProps('city')} />
              <TextInput label="Режим работы" {...pickupForm.getInputProps('schedule')} />
            </SimpleGrid>
            <TextInput label="Адрес" required {...pickupForm.getInputProps('address')} />
            <TextInput label="Условное время готовности" {...pickupForm.getInputProps('eta_text')} />
            <Switch label="ПВЗ активен" {...pickupForm.getInputProps('is_active', { type: 'checkbox' })} />
            <Group justify="flex-end">
              <Button variant="subtle" color="dark" onClick={pickupModal.close}>
                Отмена
              </Button>
              <Button color="dark" type="submit" leftSection={<Save size={16} />}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
