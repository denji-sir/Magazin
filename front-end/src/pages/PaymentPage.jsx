import {
  Container,
  Stack,
  Title,
  Text,
  Box,
  Paper,
  TextInput,
  SimpleGrid,
  Button,
  Group,
  Center,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../shared/api/api';
import { useCart } from '../shared/api/CartContext';

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('input');

  const orderId = location.state?.orderId;
  const orderNumber = location.state?.orderNumber;
  const total = location.state?.total;

  const form = useForm({
    initialValues: { cardNumber: '', expiry: '', cvv: '', holder: '' },
    validate: {
      cardNumber: (value) => (value.replace(/\s/g, '').length >= 12 ? null : 'Некорректный номер карты'),
      expiry: (value) => (/^\d{2}\/\d{2}$/.test(value) ? null : 'ММ/ГГ'),
      cvv: (value) => (value.length >= 3 ? null : 'Минимум 3 цифры'),
      holder: (value) => (value.length > 2 ? null : 'Введите имя владельца'),
    },
  });

  const handlePayment = async (values) => {
    if (!orderId) {
      toast.error('Не найден заказ для оплаты');
      return;
    }
    setStatus('processing');
    try {
      await api.post('/payments/simulate/', {
        order_id: orderId,
        card_number: values.cardNumber,
        expiry: values.expiry,
        cvv: values.cvv,
        holder: values.holder,
        outcome: 'success',
      });
      await clearCart();
      setStatus('success');
      toast.success('Оплата прошла успешно!');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'processing') {
    return (
      <Center h="100vh" bg="var(--color-bg)">
        <Stack align="center" gap="xl">
          <Loader color="gold" size="xl" type="dots" />
          <Title order={3}>Обработка платежа...</Title>
          <Text c="dimmed">Пожалуйста, не закрывайте страницу</Text>
        </Stack>
      </Center>
    );
  }

  if (status === 'success') {
    return (
      <Center h="100vh" bg="var(--color-bg)">
        <Container size="xs">
          <Paper p={40} radius="xl" withBorder shadow="xl" ta="center">
            <CheckCircle2 size={64} color="var(--color-success)" strokeWidth={1.5} style={{ margin: '0 auto' }} />
            <Title order={2} mt="xl">Оплачено успешно!</Title>
            <Text c="dimmed" mt="md">Заказ {orderNumber ? `#${orderNumber}` : ''} принят в обработку.</Text>
            <Button fullWidth mt="xl" color="dark" onClick={() => navigate('/profile')}>В личный кабинет</Button>
          </Paper>
        </Container>
      </Center>
    );
  }

  return (
    <Box py={60} bg="var(--color-bg)" style={{ minHeight: '100vh' }}>
      <Container size={480}>
        <Stack gap="xl">
          <Box ta="center">
            <Title order={1} mb="xs">Оплата заказа</Title>
            <Text c="dimmed">{orderNumber ? `Заказ #${orderNumber}` : 'Безопасная оплата через LUMINA Pay'}</Text>
            {total && <Text c="gold" fw={600} mt={6}>Сумма: {Number(total).toLocaleString()} ₽</Text>}
          </Box>

          <Paper p="xl" radius="lg" withBorder shadow="sm">
            <form onSubmit={form.onSubmit(handlePayment)}>
              <Stack gap="md">
                <TextInput label="Номер карты" placeholder="0000 0000 0000 0000" required {...form.getInputProps('cardNumber')} maxLength={19} />
                <SimpleGrid cols={2}>
                  <TextInput label="Срок действия" placeholder="ММ/ГГ" required {...form.getInputProps('expiry')} maxLength={5} />
                  <TextInput label="CVV" placeholder="123" type="password" required {...form.getInputProps('cvv')} maxLength={4} />
                </SimpleGrid>
                <TextInput label="Владелец карты" placeholder="IVAN IVANOV" required {...form.getInputProps('holder')} style={{ textTransform: 'uppercase' }} />
                <Button fullWidth mt="xl" size="lg" color="gold" type="submit">Оплатить</Button>
                <Group justify="center" gap="xs" mt="md">
                  <ShieldCheck size={16} color="var(--color-secondary)" />
                  <Text fz="xs" c="dimmed">Тестовый платеж в рамках проекта</Text>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
