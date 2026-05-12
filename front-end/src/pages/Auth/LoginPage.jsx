import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Anchor,
  Stack,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../shared/api/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  const form = useForm({
    initialValues: { email: '', password: '', remember: true },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Некорректный email'),
      password: (value) => (value.length < 6 ? 'Пароль должен быть не менее 6 символов' : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      toast.success('Вход выполнен');
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={100} bg="var(--color-bg)" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <Container size={420}>
        <Title ta="center" style={{ fontFamily: '"Playfair Display", serif' }}>С возвращением</Title>
        <Text c="dimmed" fz="sm" ta="center" mt={5}>
          Нет аккаунта? <Anchor size="sm" component={Link} to="/auth/register" color="gold">Зарегистрироваться</Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="lg">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput label="Email" placeholder="you@example.com" required {...form.getInputProps('email')} />
              <PasswordInput label="Пароль" placeholder="Ваш пароль" required {...form.getInputProps('password')} />
              <Group justify="space-between" mt="lg">
                <Checkbox label="Запомнить меня" color="dark" {...form.getInputProps('remember', { type: 'checkbox' })} />
                <Anchor component="button" size="sm" color="dimmed">Забыли пароль?</Anchor>
              </Group>
              <Button fullWidth mt="xl" type="submit" color="dark" loading={loading} size="md">Войти</Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
