import { Box, Container, Grid, Stack, Text, Group, ActionIcon, Divider } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'Покупателям',
    links: [
      { label: 'Каталог', path: '/catalog' },
      { label: 'Доставка и оплата', path: '/delivery' },
      { label: 'Возврат', path: '/returns' },
      { label: 'Вопросы и ответы', path: '/faq' },
    ],
  },
  {
    title: 'О бренде',
    links: [
      { label: 'Наша история', path: '/about' },
      { label: 'Мастерская', path: '/workshop' },
      { label: 'Контакты', path: '/contacts' },
      { label: 'Адреса магазинов', path: '/stores' },
    ],
  },
  {
    title: 'Юридическая информация',
    links: [
      { label: 'Публичная оферта', path: '/terms' },
      { label: 'Политика конфиденциальности', path: '/privacy' },
      { label: 'Использование куки', path: '/cookies' },
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
                Украшения ручной работы из серебра 925 пробы и натуральных камней, созданные с любовью и вниманием к деталям.
              </Text>
              <Group gap="xs">
                <ActionIcon variant="subtle" color="dark" size="lg" radius="xl">
                  <Instagram size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="dark" size="lg" radius="xl">
                  <Facebook size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="dark" size="lg" radius="xl">
                  <Youtube size={18} />
                </ActionIcon>
              </Group>
            </Stack>
          </Grid.Col>

          {FOOTER_LINKS.map((section) => (
            <Grid.Col key={section.title} span={{ base: 6, sm: 4, md: 2.6 }}>
              <Text fw={500} fz="sm" mb="lg" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {section.title}
              </Text>
              <Stack gap="xs">
                {section.links.map((link) => (
                  <Link key={link.label} to={link.path} className={styles.link}>
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid.Col>
          ))}
        </Grid>

        <Divider my={40} color="var(--color-border)" opacity={0.5} />

        <Group justify="space-between" align="center">
          <Text fz="xs" c="dimmed">
            © {new Date().getFullYear()} LUMINA JEWELRY. Все права защищены.
          </Text>
          <Group gap="xs">
             <Text fz="xs" c="dimmed">Разработано с душой</Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
