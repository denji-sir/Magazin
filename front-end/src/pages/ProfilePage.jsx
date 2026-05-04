import { 
  Container, 
  Grid, 
  Stack, 
  Title, 
  Text, 
  Box, 
  Tabs, 
  Paper, 
  Avatar, 
  Group, 
  Button, 
  TextInput, 
  Badge,
  Table,
  ActionIcon,
  Divider
} from '@mantine/core';
import { User, Package, Settings, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../shared/api/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// MOCK ORDERS
const MOCK_ORDERS = [
  { id: '10254', date: '12.04.2026', total: 6490, status: 'Оплачен', items: 1 },
  { id: '10212', date: '05.03.2026', total: 12990, status: 'Получен', items: 2 },
];

export function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpened, { open: openOrderModal, close: closeOrderModal }] = useDisclosure(false);

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из системы');
    navigate('/');
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    openOrderModal();
  };

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <Container size="xl">
        <Grid gutter={40}>
          {/* ... Sidebar remains the same ... */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="xl" radius="xl" withBorder shadow="sm">
              <Stack align="center" gap="md">
                <Avatar size={100} radius={100} color="gold" src={null}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Stack gap={4} align="center">
                  <Group gap="xs">
                    <Title order={3}>{user?.firstName || 'Пользователь'} {user?.lastName || ''}</Title>
                    {isAdmin && <ShieldCheck size={20} color="var(--color-gold)" />}
                  </Group>
                  <Text c="dimmed" fz="sm">{user?.email || 'user@example.com'}</Text>
                  {isAdmin && (
                    <Badge variant="light" color="gold" mt="xs">Администратор</Badge>
                  )}
                </Stack>
                
                <Divider w="100%" my="md" color="var(--color-border)" opacity={0.5} />
                
                <Stack w="100%" gap="xs">
                  <Button 
                    variant="subtle" 
                    color="dark" 
                    justify="flex-start" 
                    leftSection={<Package size={18} />}
                    fullWidth
                  >
                    Мои заказы
                  </Button>
                  <Button 
                    variant="subtle" 
                    color="dark" 
                    justify="flex-start" 
                    leftSection={<User size={18} />}
                    fullWidth
                  >
                    Данные профиля
                  </Button>
                  {isAdmin && (
                    <Button 
                      variant="subtle" 
                      color="gold" 
                      justify="flex-start" 
                      leftSection={<ShieldCheck size={18} />}
                      fullWidth
                      onClick={() => navigate('/admin')}
                    >
                      Панель управления
                    </Button>
                  )}
                  <Button 
                    variant="subtle" 
                    color="red" 
                    justify="flex-start" 
                    leftSection={<LogOut size={18} />}
                    fullWidth
                    mt="xl"
                    onClick={handleLogout}
                  >
                    Выйти
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Main Content */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Tabs defaultValue="orders" color="gold" variant="pills" radius="xl">
              <Tabs.List mb="xl">
                <Tabs.Tab value="orders" leftSection={<Package size={16} />}>Заказы</Tabs.Tab>
                <Tabs.Tab value="settings" leftSection={<Settings size={16} />}>Настройки</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="orders">
                <Stack gap="md">
                  <Title order={4} mb="sm">История заказов</Title>
                  {MOCK_ORDERS.length > 0 ? (
                    <Paper withBorder radius="lg" style={{ overflow: 'hidden' }}>
                      <Table verticalSpacing="md" horizontalSpacing="xl">
                        <Table.Thead bg="var(--color-bg)">
                          <Table.Tr>
                            <Table.Th>№ Заказа</Table.Th>
                            <Table.Th>Дата</Table.Th>
                            <Table.Th>Сумма</Table.Th>
                            <Table.Th>Статус</Table.Th>
                            <Table.Th></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {MOCK_ORDERS.map((order) => (
                            <Table.Tr key={order.id}>
                              <Table.Td>
                                <Text fw={500}>#{order.id}</Text>
                              </Table.Td>
                              <Table.Td>
                                <Text fz="sm" c="dimmed">{order.date}</Text>
                              </Table.Td>
                              <Table.Td>
                                <Text fz="sm" fw={600}>{order.total.toLocaleString()} ₽</Text>
                              </Table.Td>
                              <Table.Td>
                                <Stack gap={2}>
                                  <Badge 
                                    color={order.status === 'Получен' ? 'green' : 'gold'} 
                                    variant="light"
                                    size="sm"
                                  >
                                    {order.status}
                                  </Badge>
                                  {order.status === 'Оплачен' && (
                                    <Text fz={9} c="dimmed">Код: 42-12</Text>
                                  )}
                                </Stack>
                              </Table.Td>
                              <Table.Td>
                                <ActionIcon variant="subtle" color="dark" onClick={() => handleViewOrder(order)}>
                                  <ExternalLink size={16} />
                                </ActionIcon>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Paper>
                  ) : (
                    <Paper p="xl" radius="lg" withBorder>
                      <Center py={40}>
                        <Stack align="center" gap="sm">
                          <Text c="dimmed">У вас пока нет заказов</Text>
                          <Button variant="outline" color="dark" size="xs">Перейти к покупкам</Button>
                        </Stack>
                      </Center>
                    </Paper>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="settings">
                <Paper p="xl" radius="lg" withBorder>
                  <Stack gap="xl">
                    <Box>
                      <Title order={4} mb="lg">Личные данные</Title>
                      <SimpleGrid cols={2} spacing="md">
                        <TextInput label="Имя" defaultValue={user?.firstName || 'Иван'} />
                        <TextInput label="Фамилия" defaultValue={user?.lastName || 'Иванов'} />
                        <TextInput label="Email" defaultValue={user?.email || 'user@example.com'} disabled />
                        <TextInput label="Телефон" defaultValue={user?.phone || '+7 (999) 000-00-00'} />
                      </SimpleGrid>
                    </Box>

                    <Divider color="var(--color-border)" opacity={0.5} />

                    <Box>
                      <Title order={4} mb="lg">Смена пароля</Title>
                      <Stack gap="md" maw={400}>
                        <PasswordInput label="Текущий пароль" />
                        <PasswordInput label="Новый пароль" />
                        <PasswordInput label="Подтверждение нового пароля" />
                      </Stack>
                    </Box>

                    <Group justify="flex-end" mt="xl">
                      <Button color="dark">Сохранить изменения</Button>
                    </Group>
                  </Stack>
                </Paper>
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Order Details Modal */}
      <Modal 
        opened={orderModalOpened} 
        onClose={closeOrderModal} 
        title={`Детали заказа #${selectedOrder?.id}`}
        radius="lg"
        size="lg"
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Box>
              <Text fz="xs" c="dimmed">Дата заказа</Text>
              <Text fw={500}>{selectedOrder?.date}</Text>
            </Box>
            <Box ta="right">
              <Text fz="xs" c="dimmed">Статус</Text>
              <Badge color={selectedOrder?.status === 'Получен' ? 'green' : 'gold'} variant="light">
                {selectedOrder?.status}
              </Badge>
            </Box>
          </Group>

          <Divider color="var(--color-border)" opacity={0.5} />

          <Text fw={600} fz="sm">Товары в заказе</Text>
          <Stack gap="xs">
            {/* Mocking items in order */}
            <Group justify="space-between" p="sm" bg="var(--color-bg)" style={{ borderRadius: 'var(--radius-md)' }}>
              <Group gap="md">
                <Image src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=100&auto=format&fit=crop" width={40} height={40} radius="sm" />
                <Box>
                  <Text fz="sm" fw={500}>Кольцо «Luna»</Text>
                  <Text fz="xs" c="dimmed">1 шт.</Text>
                </Box>
              </Group>
              <Text fz="sm" fw={600}>{selectedOrder?.total.toLocaleString()} ₽</Text>
            </Group>
          </Stack>

          <Divider color="var(--color-border)" opacity={0.5} />

          <Group justify="space-between">
            <Text fw={700}>Итого</Text>
            <Text fw={700} c="gold" fz="lg">{selectedOrder?.total.toLocaleString()} ₽</Text>
          </Group>

          <Button fullWidth mt="md" variant="light" color="dark" onClick={closeOrderModal}>
            Закрыть
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}

import { Modal } from '@mantine/core';

import { SimpleGrid, PasswordInput, Center } from '@mantine/core';
