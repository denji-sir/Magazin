import { Anchor, Box, Container, Grid, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: 'Телефон',
    value: '+7 (900) 123-45-67',
    hint: 'Ежедневно с 10:00 до 20:00',
    href: 'tel:+79001234567',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@lumina-jewelry.ru',
    hint: 'Ответ в течение 1 рабочего дня',
    href: 'mailto:hello@lumina-jewelry.ru',
  },
  {
    icon: MapPin,
    title: 'Шоу-рум',
    value: 'Москва, ул. Пятницкая, 18',
    hint: 'По предварительной записи',
  },
  {
    icon: Clock3,
    title: 'Режим работы',
    value: 'Пн–Вс: 10:00–20:00',
    hint: 'Поддержка онлайн-заказов 24/7',
  },
];

export function ContactsPage() {
  return (
    <Box py={60} bg="var(--color-bg)">
      <Container size="xl">
        <Stack gap={44}>
          <Stack gap="sm" maw={860}>
            <Text c="gold" fw={600} fz="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Контакты
            </Text>
            <Title order={1} style={{ fontFamily: '"Playfair Display", serif', lineHeight: 1.1 }}>
              Свяжитесь с нами
            </Title>
            <Text c="var(--color-secondary)" lh={1.8}>
              Если вам нужна консультация по выбору украшения, помощь с оформлением заказа или проверка статуса,
              используйте удобный канал связи ниже. Мы сохранили ту же спокойную эстетику и структуру, что и на
              остальных страницах магазина.
            </Text>
          </Stack>

          <Grid gutter={20} align="stretch">
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Grid.Col key={item.title} span={{ base: 12, sm: 6, lg: 3 }}>
                  <Paper radius="lg" p="lg" bg="white" style={{ border: '1px solid var(--color-border)', height: '100%' }}>
                    <Stack gap="sm">
                      <ThemeIcon size={40} radius="md" color="gold" variant="light">
                        <Icon size={18} />
                      </ThemeIcon>
                      <Text fw={600}>{item.title}</Text>
                      {item.href ? (
                        <Anchor href={item.href} fz="sm" fw={500} c="dark" underline="never">
                          {item.value}
                        </Anchor>
                      ) : (
                        <Text fz="sm" fw={500} c="dark">
                          {item.value}
                        </Text>
                      )}
                      <Text fz="xs" c="var(--color-secondary)">
                        {item.hint}
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>

          <Paper radius="xl" p={{ base: 'xl', md: 40 }} bg="white" style={{ border: '1px solid var(--color-border)' }}>
            <Grid gutter={28}>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Title order={3}>Поддержка по заказам</Title>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Text c="var(--color-secondary)" lh={1.8}>
                  Для ускорения обработки обращения укажите номер заказа и email, использованный при оформлении.
                  По вопросам ПВЗ, статусов оплаты и этапов сборки заказа мы отвечаем в порядке поступления обращений.
                </Text>
              </Grid.Col>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
