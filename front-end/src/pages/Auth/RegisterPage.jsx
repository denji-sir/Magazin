import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Text, 
  Container, 
  Anchor,
  Stack,
  Box,
  SimpleGrid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'Имя слишком короткое' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Некорректный email'),
      phone: (value) => (value.length < 10 ? 'Введите корректный номер' : null),
      password: (value) => (value.length < 6 ? 'Пароль должен быть не менее 6 символов' : null),
      confirmPassword: (value, values) => (value !== values.password ? 'Пароли не совпадают' : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Registration attempt:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Регистрация прошла успешно! Теперь вы можете войти.');
      navigate('/auth/login');
    } catch (error) {
      // Handled by axios
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={80} bg="var(--color-bg)" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <Container size={500}>
        <Title ta="center" style={{ fontFamily: '"Playfair Display", serif' }}>
          Создать аккаунт
        </Title>
        <Text c="dimmed" fz="sm" ta="center" mt={5}>
          Уже есть аккаунт?{' '}
          <Anchor size="sm" component={Link} to="/auth/login" color="gold">
            Войти
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="lg">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <SimpleGrid cols={2}>
                <TextInput 
                  label="Имя" 
                  placeholder="Иван" 
                  required 
                  {...form.getInputProps('firstName')} 
                />
                <TextInput 
                  label="Фамилия" 
                  placeholder="Иванов" 
                  {...form.getInputProps('lastName')} 
                />
              </SimpleGrid>

              <TextInput 
                label="Email" 
                placeholder="you@example.com" 
                required 
                {...form.getInputProps('email')} 
              />

              <TextInput 
                label="Телефон" 
                placeholder="+7 (999) 000-00-00" 
                required 
                {...form.getInputProps('phone')} 
              />

              <PasswordInput 
                label="Пароль" 
                placeholder="Минимум 6 символов" 
                required 
                {...form.getInputProps('password')} 
              />

              <PasswordInput 
                label="Подтверждение пароля" 
                placeholder="Повторите пароль" 
                required 
                {...form.getInputProps('confirmPassword')} 
              />

              <Button fullWidth mt="xl" type="submit" color="dark" loading={loading} size="md">
                Зарегистрироваться
              </Button>
              
              <Text fz="xs" c="dimmed" ta="center" mt="sm">
                Регистрируясь, вы принимаете условия Пользовательского соглашения.
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
