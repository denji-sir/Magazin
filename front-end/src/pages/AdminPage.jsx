import { 
  Container, 
  Tabs, 
  Title, 
  Group, 
  Button, 
  Box, 
  Paper, 
  Stack, 
  Text, 
  Badge,
  ActionIcon,
  Table,
  TextInput,
  NumberInput,
  Select,
  Modal,
  Image,
  ScrollArea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

// MOCK DATA FOR ADMIN
const MOCK_PRODUCTS = [
  { id: 1, name: 'Кольцо «Luna»', price: 5990, category: 'rings', stock: 12, sales: 45 },
  { id: 2, name: 'Серьги «Aurora»', price: 6490, category: 'earrings', stock: 8, sales: 32 },
  { id: 3, name: 'Колье «Sol»', price: 7990, category: 'pendants', stock: 5, sales: 18 },
];

const MOCK_ORDERS = [
  { id: '10254', customer: 'Иван Иванов', date: '12.04.2026', total: 6490, status: 'Новый' },
  { id: '10212', customer: 'Анна Петрова', date: '05.03.2026', total: 12990, status: 'Оплачен' },
  { id: '10198', customer: 'Сергей Сидоров', date: '01.03.2026', total: 4990, status: 'Доставлен' },
];

const MOCK_USERS = [
  { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user', orders: 5 },
  { id: 2, name: 'Админ Админов', email: 'admin@lumina.ru', role: 'admin', orders: 0 },
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'Кольца', slug: 'rings', count: 12 },
  { id: 2, name: 'Серьги', slug: 'earrings', count: 8 },
];

const MOCK_PVZ = [
  { id: 1, name: 'ПВЗ Центр', address: 'ул. Мира, 10', active: true },
];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [opened, { open, close }] = useDisclosure(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const form = useForm({
    initialValues: {
      name: '',
      price: 0,
      category: '',
      stock: 0,
      description: '',
    },
  });

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    form.setValues(product);
    open();
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.reset();
    open();
  };

  const handleSave = (values) => {
    console.log('Saving product:', values);
    toast.success(editingProduct ? 'Товар обновлен' : 'Товар создан');
    close();
  };

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size="xl">
        <Stack gap="xl">
          <Group justify="space-between">
            <Box>
              <Title order={1}>Панель управления</Title>
              <Text c="dimmed" fz="sm">Управление магазином LUMINA</Text>
            </Box>
            <Button 
              variant="filled" 
              color="gold" 
              leftSection={<Plus size={18} />}
              onClick={handleAddProduct}
            >
              Добавить товар
            </Button>
          </Group>

          <Tabs value={activeTab} onChange={setActiveTab} color="gold" variant="outline" radius="md">
            <Tabs.List bg="white" p={4} style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <Tabs.Tab value="products" leftSection={<Package size={16} />}>Товары</Tabs.Tab>
              <Tabs.Tab value="orders" leftSection={<ShoppingCart size={16} />}>Заказы</Tabs.Tab>
              <Tabs.Tab value="users" leftSection={<Users size={16} />}>Пользователи</Tabs.Tab>
              <Tabs.Tab value="categories" leftSection={<LayoutDashboard size={16} />}>Категории</Tabs.Tab>
              <Tabs.Tab value="pvz" leftSection={<MapPin size={16} />}>ПВЗ</Tabs.Tab>
              <Tabs.Tab value="stats" leftSection={<LayoutDashboard size={16} />}>Аналитика</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="products" pt="xl">
              <Paper withBorder radius="lg">
                <Box p="md" bg="var(--color-bg)" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <TextInput 
                    placeholder="Поиск по названию или ID..." 
                    leftSection={<Search size={16} />}
                    maw={400}
                  />
                </Box>
                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="xl">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Наименование</Table.Th>
                        <Table.Th>Категория</Table.Th>
                        <Table.Th>Цена</Table.Th>
                        <Table.Th>Остаток</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {MOCK_PRODUCTS.map((p) => (
                        <Table.Tr key={p.id}>
                          <Table.Td fz="xs" c="dimmed">#{p.id}</Table.Td>
                          <Table.Td fw={500}>{p.name}</Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="gray" size="sm">{p.category}</Badge>
                          </Table.Td>
                          <Table.Td>{p.price.toLocaleString()} ₽</Table.Td>
                          <Table.Td>{p.stock} шт.</Table.Td>
                          <Table.Td ta="right">
                            <Group gap={8} justify="flex-end">
                              <ActionIcon variant="subtle" color="dark" onClick={() => handleEditProduct(p)}><Pencil size={16} /></ActionIcon>
                              <ActionIcon variant="subtle" color="red"><Trash2 size={16} /></ActionIcon>
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
                  <Table verticalSpacing="md" horizontalSpacing="xl">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>№ Заказа</Table.Th>
                        <Table.Th>Клиент</Table.Th>
                        <Table.Th>Сумма</Table.Th>
                        <Table.Th>Статус</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {MOCK_ORDERS.map((o) => (
                        <Table.Tr key={o.id}>
                          <Table.Td fw={500}>#{o.id}</Table.Td>
                          <Table.Td>{o.customer}</Table.Td>
                          <Table.Td fw={600}>{o.total.toLocaleString()} ₽</Table.Td>
                          <Table.Td>
                            <Select size="xs" defaultValue={o.status} data={['Новый', 'Оплачен', 'Доставлен']} style={{ width: 130 }} />
                          </Table.Td>
                          <Table.Td ta="right">
                            <ActionIcon variant="subtle" color="gold"><ExternalLink size={16} /></ActionIcon>
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
                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="xl">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Имя</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Роль</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {MOCK_USERS.map((u) => (
                        <Table.Tr key={u.id}>
                          <Table.Td c="dimmed">#{u.id}</Table.Td>
                          <Table.Td fw={500}>{u.name}</Table.Td>
                          <Table.Td>{u.email}</Table.Td>
                          <Table.Td>
                            <Badge color={u.role === 'admin' ? 'red' : 'blue'} variant="light">{u.role}</Badge>
                          </Table.Td>
                          <Table.Td ta="right">
                            <ActionIcon variant="subtle" color="dark"><Pencil size={16} /></ActionIcon>
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
                      {MOCK_CATEGORIES.map((c) => (
                        <Table.Tr key={c.id}>
                          <Table.Td fw={500}>{c.name}</Table.Td>
                          <Table.Td>{c.slug}</Table.Td>
                          <Table.Td>{c.count}</Table.Td>
                          <Table.Td ta="right">
                            <ActionIcon variant="subtle" color="dark"><Pencil size={16} /></ActionIcon>
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
                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="xl">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Название</Table.Th>
                        <Table.Th>Адрес</Table.Th>
                        <Table.Th>Статус</Table.Th>
                        <Table.Th ta="right">Действия</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {MOCK_PVZ.map((p) => (
                        <Table.Tr key={p.id}>
                          <Table.Td fw={500}>{p.name}</Table.Td>
                          <Table.Td>{p.address}</Table.Td>
                          <Table.Td>
                            <Badge color={p.active ? 'green' : 'red'}>{p.active ? 'Активен' : 'Отключен'}</Badge>
                          </Table.Td>
                          <Table.Td ta="right">
                            <ActionIcon variant="subtle" color="dark"><Pencil size={16} /></ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="stats" pt="xl">
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                <Paper p="xl" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>Выручка за месяц</Text>
                  <Group align="flex-end" gap="xs" mt={8}>
                    <Text fz="xl" fw={700}>245,600 ₽</Text>
                    <Badge color="green" variant="light" size="sm">+12%</Badge>
                  </Group>
                </Paper>
                <Paper p="xl" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>Новых заказов</Text>
                  <Group align="flex-end" gap="xs" mt={8}>
                    <Text fz="xl" fw={700}>42</Text>
                    <Badge color="green" variant="light" size="sm">+5%</Badge>
                  </Group>
                </Paper>
                <Paper p="xl" radius="lg" withBorder>
                  <Text fz="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>Средний чек</Text>
                  <Group align="flex-end" gap="xs" mt={8}>
                    <Text fz="xl" fw={700}>5,840 ₽</Text>
                    <Badge color="red" variant="light" size="sm">-2%</Badge>
                  </Group>
                </Paper>
              </SimpleGrid>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>

      {/* Product Edit/Create Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={editingProduct ? 'Редактировать товар' : 'Новый товар'}
        size="lg"
        radius="lg"
      >
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack gap="md">
            <TextInput label="Название товара" placeholder="Введите название..." required {...form.getInputProps('name')} />
            <SimpleGrid cols={2}>
              <NumberInput label="Цена (₽)" min={0} step={100} required {...form.getInputProps('price')} />
              <Select 
                label="Категория" 
                placeholder="Выберите..." 
                data={['rings', 'earrings', 'pendants', 'bracelets']} 
                required 
                {...form.getInputProps('category')} 
              />
            </SimpleGrid>
            <NumberInput label="Остаток на складе" min={0} {...form.getInputProps('stock')} />
            <Textarea label="Описание" placeholder="Подробное описание товара..." rows={4} {...form.getInputProps('description')} />
            
            <Group justify="flex-end" mt="xl">
              <Button variant="subtle" color="dark" onClick={close}>Отмена</Button>
              <Button color="dark" type="submit" leftSection={<Save size={18} />}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

import { Textarea } from '@mantine/core';
