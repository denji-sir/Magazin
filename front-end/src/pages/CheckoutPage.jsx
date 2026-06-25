import {
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Box,
  Paper,
  TextInput,
  SimpleGrid,
  Button,
  Group,
  Divider,
  Select,
  Textarea,
  Loader,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, MapPin } from 'lucide-react';
import { useCart } from '../shared/api/CartContext';
import { useAuth } from '../shared/api/AuthContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../shared/api/api';

export function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pvzLoading, setPvzLoading] = useState(true);
  const [pvzList, setPvzList] = useState([]);

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: '',
      pvzId: '',
      comment: '',
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'Введите имя' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Некорректный email'),
      phone: (value) => (value.length < 10 ? 'Введите номер телефона' : null),
      pvzId: (value) => (!value ? 'Выберите пункт выдачи' : null),
    },
  });

  useEffect(() => {
    const loadPvz = async () => {
      setPvzLoading(true);
      try {
        const resp = await api.get('/pickup-points/active/');
        const rows = (resp.data.results || resp.data || []).map((p) => ({
          value: String(p.id),
          label: `${p.name} (${p.city}, ${p.address})`,
          address: p.address,
          schedule: p.schedule,
        }));
        setPvzList(rows);
      } finally {
        setPvzLoading(false);
      }
    };
    loadPvz();
  }, []);

  const selectedPvz = pvzList.find((p) => p.value === form.values.pvzId);

  const handleSubmit = async (values) => {
    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    setLoading(true);
    try {
      const resp = await api.post('/orders/checkout/', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        city: values.city,
        pvzId: Number(values.pvzId),
        comment: values.comment,
      });

      toast.success('Заказ успешно создан! Переходим к оплате...');
      navigate('/payment', { state: { orderId: resp.data.id, orderNumber: resp.data.number, total: resp.data.total } });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container size="xl" py={100}>
        <Stack align="center">
          <Title order={2}>Для оформления заказа нужно добавить товары</Title>
          <Button variant="subtle" color="gold" component={Link} to="/catalog">В каталог</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size="xl">
        <Stack gap="xl">
          <Group>
            <Button variant="subtle" color="dark" leftSection={<ArrowLeft size={16} />} component={Link} to="/cart" size="xs">Вернуться в корзину</Button>
          </Group>
          <Title order={1}>Оформление заказа</Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid gutter={40}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="xl">
                  <Paper p={{ base: 'md', sm: 'xl' }} radius="lg" withBorder>
                    <Group mb="xl" gap="sm"><Box p={8} bg="var(--color-bg)" style={{ borderRadius: '8px' }}><Truck size={20} color="var(--color-gold)" /></Box><Title order={3} fz="lg">Контактные данные</Title></Group>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <TextInput label="Имя" placeholder="Иван" required {...form.getInputProps('firstName')} />
                      <TextInput label="Фамилия" placeholder="Иванов" {...form.getInputProps('lastName')} />
                      <TextInput label="Email" placeholder="you@example.com" required {...form.getInputProps('email')} />
                      <TextInput label="Телефон" placeholder="+7 (999) 000-00-00" required {...form.getInputProps('phone')} />
                      <TextInput label="Город" placeholder="Москва" {...form.getInputProps('city')} />
                    </SimpleGrid>
                  </Paper>

                  <Paper p={{ base: 'md', sm: 'xl' }} radius="lg" withBorder>
                    <Group mb="xl" gap="sm"><Box p={8} bg="var(--color-bg)" style={{ borderRadius: '8px' }}><MapPin size={20} color="var(--color-gold)" /></Box><Title order={3} fz="lg">Пункт выдачи</Title></Group>
                    {pvzLoading ? (
                      <Center py={30}><Loader color="gold" /></Center>
                    ) : (
                      <>
                        <Select
                          label="Выберите пункт выдачи"
                          placeholder="Адрес или название ПВЗ"
                          data={pvzList}
                          searchable
                          required
                          {...form.getInputProps('pvzId')}
                          mb="md"
                          comboboxProps={{ withinPortal: true }}
                          styles={{
                            input: {
                              minHeight: 48,
                              fontSize: 16,
                              paddingRight: 44,
                            },
                            option: {
                              whiteSpace: 'normal',
                              lineHeight: 1.35,
                            },
                          }}
                        />

                        {selectedPvz && (
                          <Box p="md" bg="var(--color-bg)" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            <Text fw={600} fz="sm" style={{ wordBreak: 'break-word' }}>{selectedPvz.label}</Text>
                            <Text fz="xs" c="dimmed" mt={4}>{selectedPvz.address}</Text>
                            <Text fz="xs" c="dimmed" mt={2}>Часы работы: {selectedPvz.schedule || '—'}</Text>
                          </Box>
                        )}
                      </>
                    )}

                    <Textarea label="Комментарий к заказу" placeholder="Например: Позвоните за час..." mt="xl" rows={3} {...form.getInputProps('comment')} />
                  </Paper>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper p="xl" radius="xl" withBorder pos="sticky" style={{ top: 100 }}>
                  <Title order={3} mb="xl" fz="lg">Итого</Title>
                  <Stack gap="md">
                    <Box style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {items.map((item) => (
                        <Group key={item.id} justify="space-between" mb="xs" wrap="nowrap">
                          <Text fz="xs" c="dimmed" truncate style={{ maxWidth: '70%' }}>{item.name} x {item.quantity}</Text>
                          <Text fz="xs" fw={500}>{(item.price * item.quantity).toLocaleString()} ₽</Text>
                        </Group>
                      ))}
                    </Box>

                    <Divider my="sm" />
                    <Group justify="space-between"><Text fz="sm" c="dimmed">Товары</Text><Text fz="sm" fw={500}>{totalPrice.toLocaleString()} ₽</Text></Group>
                    <Group justify="space-between"><Text fz="sm" c="dimmed">Доставка</Text><Text fz="sm" c="success" fw={500}>Бесплатно</Text></Group>
                    <Divider my="sm" />
                    <Group justify="space-between"><Text fz="lg" fw={600}>К оплате</Text><Text fz="lg" fw={700} c="gold">{totalPrice.toLocaleString()} ₽</Text></Group>
                    <Button size="lg" color="dark" mt="xl" fullWidth type="submit" loading={loading} leftSection={<CreditCard size={18} />}>Оплатить заказ</Button>
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </form>
        </Stack>
      </Container>
    </Box>
  );
}
