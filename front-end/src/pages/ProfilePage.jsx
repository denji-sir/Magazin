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
  Divider,
  Modal,
  SimpleGrid,
  PasswordInput,
  Center,
  Loader,
  Tooltip,
} from '@mantine/core';
import { User, Package, Settings, LogOut, ExternalLink, ShieldCheck, CircleAlert } from 'lucide-react';
import { useAuth } from '../shared/api/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { api } from '../shared/api/api';

export function ProfilePage() {
  const DELIVERY_MIN_DAYS = 2;
  const DELIVERY_MAX_DAYS = 4;
  const { user, logout, isAdmin, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nowTs, setNowTs] = useState(Date.now());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpened, { open: openOrderModal, close: closeOrderModal }] = useDisclosure(false);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setPhone(user?.phone || '');
  }, [user]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const resp = await api.get('/orders/my/');
        setOrders(resp.data.results || resp.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNowTs(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
  };

  const buildStatusView = (order) => {
    if (!order) {
      return { label: '—', color: 'gray', hint: '' };
    }

    const status = String(order.status || '').toLowerCase();
    const isCanceled = status === 'canceled';
    const isExplicitDone = status === 'received';
    const etaTo = addDays(order.created_at, DELIVERY_MAX_DAYS).getTime();
    const completedByTime = nowTs >= etaTo && !isCanceled;

    if (isCanceled) {
      return { label: 'Отменён', color: 'red', hint: '' };
    }
    if (isExplicitDone || completedByTime) {
      return { label: 'Успешно выполнен', color: 'green', hint: 'Заказ забрали и получили' };
    }

    if (status === 'created' || status === 'pending_payment') {
      return { label: 'Подготовка', color: 'yellow', hint: 'Подготовка к оплате' };
    }

    if (status === 'processing') {
      return { label: 'В процессе', color: 'blue', hint: '' };
    }

    if (status === 'assembling') {
      return { label: 'Сборка заказа', color: 'indigo', hint: '' };
    }
    if (status === 'sent_to_pickup') {
      return { label: 'Передан в ПВЗ', color: 'cyan', hint: '' };
    }
    if (status === 'ready_for_pickup') {
      return { label: 'Готов к выдаче', color: 'teal', hint: '' };
    }

    return { label: status || '—', color: 'gray', hint: '' };
  };

  const buildDeliveryWindow = (order) => {
    const etaFrom = addDays(order.created_at, DELIVERY_MIN_DAYS);
    const etaTo = addDays(order.created_at, DELIVERY_MAX_DAYS);
    return `${etaFrom.toLocaleDateString('ru-RU')} — ${etaTo.toLocaleDateString('ru-RU')} (2–4 дня)`;
  };

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из системы');
    navigate('/');
  };

  const handleViewOrder = async (order) => {
    const resp = await api.get(`/orders/my/${order.id}/`);
    setSelectedOrder(resp.data);
    openOrderModal();
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ firstName, lastName, phone });
      toast.success('Профиль обновлён');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Новый пароль должен содержать минимум 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Подтверждение пароля не совпадает');
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Пароль успешно изменён');
    } finally {
      setPasswordSaving(false);
    }
  };

  const renderStatusBadge = (order) => {
    const statusView = buildStatusView(order);

    return (
      <Group gap={6} wrap="nowrap">
        <Badge color={statusView.color} variant="light" size="sm">
          {statusView.label}
        </Badge>
        {statusView.hint && (
          <Tooltip label={statusView.hint} withArrow>
            <ActionIcon variant="subtle" color="yellow" size="sm" aria-label={statusView.hint}>
              <CircleAlert size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    );
  };

  return (
    <Box py={{ base: 32, sm: 60 }} bg="var(--color-bg)" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <Container size="xl">
        <Grid gutter={40}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p={{ base: 'md', sm: 'xl' }} radius="xl" withBorder shadow="sm">
              <Stack align="center" gap="md">
                <Avatar size={100} radius={100} color="gold">{user?.firstName?.charAt(0) || 'U'}</Avatar>
                <Stack gap={4} align="center">
                  <Group gap="xs">
                    <Title order={3}>{user?.firstName || 'Пользователь'} {user?.lastName || ''}</Title>
                    {isAdmin && <ShieldCheck size={20} color="var(--color-gold)" />}
                  </Group>
                  <Text c="dimmed" fz="sm">{user?.email || 'user@example.com'}</Text>
                  {isAdmin && <Badge variant="light" color="gold" mt="xs">Администратор</Badge>}
                </Stack>

                <Divider w="100%" my="md" color="var(--color-border)" opacity={0.5} />

                <Stack w="100%" gap="xs">
                  {isAdmin && (
                    <Button variant="subtle" color="gold" justify="flex-start" leftSection={<ShieldCheck size={18} />} fullWidth onClick={() => navigate('/admin')}>
                      Панель управления
                    </Button>
                  )}
                  <Button variant="subtle" color="red" justify="flex-start" leftSection={<LogOut size={18} />} fullWidth mt="xl" onClick={handleLogout}>
                    Выйти
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Tabs defaultValue="orders" color="gold" variant="pills" radius="xl">
              <Tabs.List mb="xl">
                <Tabs.Tab value="orders" leftSection={<Package size={16} />}>Заказы</Tabs.Tab>
                <Tabs.Tab value="settings" leftSection={<Settings size={16} />}>Настройки</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="orders">
                <Stack gap="md">
                  <Title order={4} mb="sm">История заказов</Title>
                  {loading ? (
                    <Center py={40}><Loader color="gold" /></Center>
                  ) : orders.length > 0 ? (
                    <>
                      <Paper withBorder radius="lg" style={{ overflow: 'hidden' }} visibleFrom="sm">
                        <Table verticalSpacing="md" horizontalSpacing="xl">
                          <Table.Thead bg="var(--color-bg)">
                            <Table.Tr>
                              <Table.Th>№ Заказа</Table.Th>
                              <Table.Th>Дата</Table.Th>
                              <Table.Th>ПВЗ</Table.Th>
                              <Table.Th>Доставка</Table.Th>
                              <Table.Th>Сумма</Table.Th>
                              <Table.Th>Статус</Table.Th>
                              <Table.Th></Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {orders.map((order) => (
                              <Table.Tr key={order.id}>
                                <Table.Td><Text fw={500}>#{order.number || order.id}</Text></Table.Td>
                                <Table.Td><Text fz="sm" c="dimmed">{new Date(order.created_at).toLocaleDateString('ru-RU')}</Text></Table.Td>
                                <Table.Td><Text fz="sm">{order.pickup_point_data?.name || '—'}</Text></Table.Td>
                                <Table.Td><Text fz="xs" c="dimmed">{buildDeliveryWindow(order)}</Text></Table.Td>
                                <Table.Td><Text fz="sm" fw={600}>{Number(order.total).toLocaleString()} ₽</Text></Table.Td>
                                <Table.Td>{renderStatusBadge(order)}</Table.Td>
                                <Table.Td>
                                  <ActionIcon variant="subtle" color="dark" onClick={() => handleViewOrder(order)}><ExternalLink size={16} /></ActionIcon>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Paper>

                      <Stack gap="sm" hiddenFrom="sm">
                        {orders.map((order) => (
                          <Paper key={order.id} p="md" radius="lg" withBorder>
                            <Stack gap="sm">
                              <Group justify="space-between" align="flex-start" wrap="nowrap">
                                <Box>
                                  <Text fz="xs" c="dimmed">Заказ</Text>
                                  <Text fw={700} style={{ wordBreak: 'break-word' }}>#{order.number || order.id}</Text>
                                </Box>
                                <ActionIcon variant="subtle" color="dark" onClick={() => handleViewOrder(order)} aria-label="Открыть заказ">
                                  <ExternalLink size={16} />
                                </ActionIcon>
                              </Group>

                              <SimpleGrid cols={2} spacing="xs">
                                <Box>
                                  <Text fz="xs" c="dimmed">Дата</Text>
                                  <Text fz="sm">{new Date(order.created_at).toLocaleDateString('ru-RU')}</Text>
                                </Box>
                                <Box>
                                  <Text fz="xs" c="dimmed">Сумма</Text>
                                  <Text fz="sm" fw={700}>{Number(order.total).toLocaleString()} ₽</Text>
                                </Box>
                              </SimpleGrid>

                              <Box>
                                <Text fz="xs" c="dimmed">Пункт выдачи</Text>
                                <Text fz="sm" style={{ wordBreak: 'break-word' }}>{order.pickup_point_data?.name || '—'}</Text>
                              </Box>

                              <Box>
                                <Text fz="xs" c="dimmed">Доставка</Text>
                                <Text fz="sm">{buildDeliveryWindow(order)}</Text>
                              </Box>

                              <Group justify="space-between" align="center">
                                {renderStatusBadge(order)}
                              </Group>
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Paper p="xl" radius="lg" withBorder>
                      <Center py={40}><Text c="dimmed">У вас пока нет заказов</Text></Center>
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
                        <TextInput label="Имя" value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} />
                        <TextInput label="Фамилия" value={lastName} onChange={(e) => setLastName(e.currentTarget.value)} />
                        <TextInput label="Email" value={user?.email || ''} disabled />
                        <TextInput label="Телефон" value={phone} onChange={(e) => setPhone(e.currentTarget.value)} />
                      </SimpleGrid>
                    </Box>

                    <Divider color="var(--color-border)" opacity={0.5} />
                    <Box>
                      <Title order={4} mb="lg">Смена пароля</Title>
                      <Stack gap="md" maw={400}>
                        <PasswordInput
                          label="Текущий пароль"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.currentTarget.value)}
                        />
                        <PasswordInput
                          label="Новый пароль"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.currentTarget.value)}
                        />
                        <PasswordInput
                          label="Подтверждение нового пароля"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                        />
                        <Group justify="flex-end">
                          <Button variant="light" color="dark" loading={passwordSaving} onClick={savePassword}>
                            Обновить пароль
                          </Button>
                        </Group>
                      </Stack>
                    </Box>

                    <Group justify="flex-end" mt="xl">
                      <Button color="dark" loading={saving} onClick={saveProfile}>Сохранить изменения</Button>
                    </Group>
                  </Stack>
                </Paper>
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Container>

      <Modal opened={orderModalOpened} onClose={closeOrderModal} title={`Детали заказа #${selectedOrder?.number || selectedOrder?.id}`} radius="lg" size="lg">
        <Stack gap="md">
          {selectedOrder && (() => {
            const statusView = buildStatusView(selectedOrder);
            return (
              <Group justify="space-between">
                <Box>
                  <Text fz="xs" c="dimmed">Дата заказа</Text>
                  <Text fw={500}>{new Date(selectedOrder.created_at).toLocaleString('ru-RU')}</Text>
                </Box>
                <Box ta="right">
                  <Text fz="xs" c="dimmed">Статус</Text>
                  <Group gap={6} justify="flex-end">
                    <Badge color={statusView.color} variant="light">{statusView.label}</Badge>
                    {statusView.hint && (
                      <Tooltip label={statusView.hint} withArrow>
                        <ActionIcon variant="subtle" color="yellow" size="sm" aria-label={statusView.hint}>
                          <CircleAlert size={14} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Box>
              </Group>
            );
          })()}

          <Divider color="var(--color-border)" opacity={0.5} />
          <SimpleGrid cols={2} spacing="md">
            <Box>
              <Text fz="xs" c="dimmed">ПВЗ</Text>
              <Text fw={500}>{selectedOrder?.pickup_point_data?.name || '—'}</Text>
              <Text fz="xs" c="dimmed">{selectedOrder?.pickup_point_data?.address || ''}</Text>
            </Box>
            <Box>
              <Text fz="xs" c="dimmed">Срок поставки</Text>
              <Text fw={500}>{selectedOrder ? buildDeliveryWindow(selectedOrder) : '—'}</Text>
            </Box>
          </SimpleGrid>

          <Divider color="var(--color-border)" opacity={0.5} />
          <Text fw={600} fz="sm">Товары в заказе</Text>
          <Stack gap="xs">
            {(selectedOrder?.items || []).map((item) => (
              <Group key={item.id} justify="space-between" p="sm" bg="var(--color-bg)" style={{ borderRadius: 'var(--radius-md)' }}>
                <Box>
                  <Text fz="sm" fw={500}>{item.product_name}</Text>
                  <Text fz="xs" c="dimmed">{item.quantity} шт.</Text>
                </Box>
                <Text fz="sm" fw={600}>{Number(item.line_total).toLocaleString()} ₽</Text>
              </Group>
            ))}
          </Stack>

          <Divider color="var(--color-border)" opacity={0.5} />
          <Group justify="space-between"><Text fw={700}>Итого</Text><Text fw={700} c="gold" fz="lg">{selectedOrder?.total ? Number(selectedOrder.total).toLocaleString() : 0} ₽</Text></Group>
          <Button fullWidth mt="md" variant="light" color="dark" onClick={closeOrderModal}>Закрыть</Button>
        </Stack>
      </Modal>
    </Box>
  );
}
