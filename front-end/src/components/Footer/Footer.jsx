import { Box, Container, Grid, Stack, Text, Group, ActionIcon, Divider } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Camera, Globe, Play } from 'lucide-react';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'Покупателям',
    links: [
      { label: 'Каталог', path: '/catalog' },
      { label: 'Личный кабинет', path: '/profile' },
      { label: 'Доставка и оплата', path: '/delivery' },
      { label: 'Контакты', path: '/contacts' },
      { label: 'Оформление заказа', path: '/checkout' },
    ],
  },
  {
    title: 'Сервис',
    links: [
      { label: 'Панель администратора', path: '/admin' },
      { label: 'Вход', path: '/auth/login' },
      { label: 'Регистрация', path: '/auth/register' },
    ],
  },
];

export function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Container size="xl" py={60}>
        <Grid gutter={50}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Box>
                <Text fw={400} fz="1.5rem" style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.15em' }}>
                  LUMINA
                </Text>
                <Text fz="0.55rem" c="dimmed" style={{ letterSpacing: '0.25em' }}>
                  JEWELRY
                </Text>
              </Box>
              <Text fz="sm" c="dimmed" maw={300}>
                Украшения ручной работы из серебра 925 пробы и натуральных камней.
              </Text>
              <Group gap="xs">
                <ActionIcon variant="subtle" color="dark" size="lg" radius="xl"><Camera size={18} /></ActionIcon>
                <ActionIcon variant="subtle" color="dark" size="lg" radius="xl"><Globe size={18} /></ActionIcon>
                <ActionIcon variant="subtle" color="dark" size="lg" radius="xl"><Play size={18} /></ActionIcon>
              </Group>
            </Stack>
          </Grid.Col>

          {FOOTER_LINKS.map((section) => (
            <Grid.Col key={section.title} span={{ base: 6, sm: 4, md: 3 }}>
              <Text fw={500} fz="sm" mb="lg" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {section.title}
              </Text>
              <Stack gap="xs">
                {section.links.map((link) => (
                  <Link key={link.label} to={link.path} className={styles.link}>{link.label}</Link>
                ))}
              </Stack>
            </Grid.Col>
          ))}
        </Grid>

        <Divider my={40} color="var(--color-border)" opacity={0.5} />

        <Group justify="space-between" align="center">
          <Text fz="xs" c="dimmed">© {new Date().getFullYear()} LUMINA JEWELRY. Все права защищены.</Text>
          <Text fz="xs" c="dimmed">Клиент-серверная версия</Text>
        </Group>
      </Container>
    </Box>
  );
}
