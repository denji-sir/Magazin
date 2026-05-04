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
  Image,
  Center,
  Loader
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function PaymentPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('input'); // input, processing, success, error

  const form = useForm({
    initialValues: {
      cardNumber: '',
      expiry: '',
      cvv: '',
      holder: '',
    },
    validate: {
      cardNumber: (value) => (value.replace(/\s/g, '').length === 16 ? null : 'Некорректный номер карты'),
      expiry: (value) => (/^\d{2}\/\d{2}$/.test(value) ? null : 'ММ/ГГ'),
      cvv: (value) => (value.length === 3 ? null : '3 цифры'),
      holder: (value) => (value.length > 2 ? null : 'Введите имя владельца'),
    },
  });

  const handlePayment = async (values) => {
    setStatus('processing');
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStatus('success');
      toast.success('Оплата прошла успешно!');
    } catch (error) {
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
            <Text c="dimmed" mt="md">Ваш заказ принят в обработку. Вы можете следить за его статусом в личном кабинете.</Text>
            <Button fullWidth mt="xl" color="dark" onClick={() => navigate('/profile')}>
              В личный кабинет
            </Button>
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
            <Text c="dimmed">Безопасная оплата через LUMINA Pay</Text>
          </Box>

          <Paper p="xl" radius="lg" withBorder shadow="sm">
            <form onSubmit={form.onSubmit(handlePayment)}>
              <Stack gap="md">
                <TextInput 
                  label="Номер карты" 
                  placeholder="0000 0000 0000 0000" 
                  required 
                  {...form.getInputProps('cardNumber')}
                  maxLength={19}
                />
                
                <SimpleGrid cols={2}>
                  <TextInput 
                    label="Срок действия" 
                    placeholder="ММ/ГГ" 
                    required 
                    {...form.getInputProps('expiry')}
                    maxLength={5}
                  />
                  <TextInput 
                    label="CVV" 
                    placeholder="123" 
                    type="password" 
                    required 
                    {...form.getInputProps('cvv')}
                    maxLength={3}
                  />
                </SimpleGrid>

                <TextInput 
                  label="Владелец карты" 
                  placeholder="IVAN IVANOV" 
                  required 
                  {...form.getInputProps('holder')}
                  style={{ textTransform: 'uppercase' }}
                />

                <Button fullWidth mt="xl" size="lg" color="gold" type="submit">
                  Оплатить
                </Button>

                <Group justify="center" gap="xs" mt="md">
                  <ShieldCheck size={16} color="var(--color-secondary)" />
                  <Text fz="xs" c="dimmed">Ваши данные защищены сертификатом PCI DSS</Text>
                </Group>
              </Stack>
            </form>
          </Paper>

          <Group justify="center" gap="xl" opacity={0.5}>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height={15} />
            <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height={25} />
            <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg" height={15} />
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
