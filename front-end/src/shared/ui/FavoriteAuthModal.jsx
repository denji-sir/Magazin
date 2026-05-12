import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function FavoriteAuthModal({ opened, onClose }) {
  const navigate = useNavigate();

  const goToLogin = () => {
    onClose();
    navigate('/auth/login');
  };

  const goToRegister = () => {
    onClose();
    navigate('/auth/register');
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Избранное доступно после входа" centered radius="lg">
      <Stack gap="md">
        <Text fz="sm" c="dimmed">
          Чтобы сохранять украшения в избранное, войдите в аккаунт или зарегистрируйтесь.
        </Text>
        <Group grow>
          <Button variant="outline" color="dark" onClick={goToLogin}>
            Войти
          </Button>
          <Button color="dark" onClick={goToRegister}>
            Регистрация
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
