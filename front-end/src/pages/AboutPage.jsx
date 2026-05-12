import { Box, Container, Grid, Image, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Gem, Hand, Sparkles, Truck } from 'lucide-react';

const VALUES = [
  {
    icon: Hand,
    title: 'Ручная работа',
    text: 'Каждое украшение создается мастером вручную и проходит контроль качества перед публикацией в каталоге.',
  },
  {
    icon: Gem,
    title: 'Материалы 925',
    text: 'Мы используем серебро 925 пробы, натуральные камни и бережную полировку для повседневного комфорта.',
  },
  {
    icon: Sparkles,
    title: 'Современный дизайн',
    text: 'Коллекции собираются в спокойной эстетике: мягкие формы, чистые линии и акцент на фактуру металла.',
  },
  {
    icon: Truck,
    title: 'Прозрачный сервис',
    text: 'Для проекта реализован тестовый сценарий оформления, оплаты и выдачи через ПВЗ с понятными статусами.',
  },
];

export function AboutPage() {
  return (
    <Box py={60} bg="var(--color-bg)">
      <Container size="xl">
        <Stack gap={56}>
          <Grid gutter={36} align="stretch">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg" justify="center" h="100%">
                <Text c="gold" fw={600} fz="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  О бренде
                </Text>
                <Title order={1} style={{ fontFamily: '"Playfair Display", serif', lineHeight: 1.1 }}>
                  LUMINA — украшения,
                  <br />
                  созданные вручную
                </Title>
                <Text c="var(--color-secondary)" fz="md" lh={1.75}>
                  Мы создаем украшения, которые можно носить каждый день: минималистичные, выразительные и тактильно приятные.
                  В проекте интернет-магазина мы сохранили эту философию и перенесли ее в интерфейс: аккуратные карточки,
                  спокойная типографика и понятные сценарии оформления заказа.
                </Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop"
                alt="Мастерская LUMINA"
                radius="xl"
                h={500}
                fit="cover"
                fallbackSrc="https://placehold.co/900x1100?text=LUMINA"
              />
            </Grid.Col>
          </Grid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <Paper key={value.title} withBorder radius="lg" p="xl" bg="white" style={{ borderColor: 'var(--color-border)' }}>
                  <Stack gap="sm">
                    <ThemeIcon size={42} radius="md" color="gold" variant="light">
                      <Icon size={20} />
                    </ThemeIcon>
                    <Title order={3} fz="1.25rem">{value.title}</Title>
                    <Text c="var(--color-secondary)" fz="sm" lh={1.7}>{value.text}</Text>
                  </Stack>
                </Paper>
              );
            })}
          </SimpleGrid>

          <Paper radius="xl" p={{ base: 'xl', md: 44 }} bg="white" style={{ border: '1px solid var(--color-border)' }}>
            <Grid gutter={28}>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Title order={3}>Почему эта страница важна</Title>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Text c="var(--color-secondary)" lh={1.8}>
                  Страница «О нас» показывает идею проекта ВКР: это не просто витрина товаров, а полноценная
                  клиент-серверная система с ролями, каталогом, корзиной, заказами, псевдооплатой и административным
                  управлением. Мы намеренно сохранили единый визуальный язык между пользовательской частью и админкой,
                  чтобы интерфейс ощущался цельным и современным.
                </Text>
              </Grid.Col>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
