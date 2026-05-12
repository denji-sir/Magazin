import { Box, Container, Grid, List, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { CalendarClock, CreditCard, MapPinHouse, ShieldCheck, Truck } from 'lucide-react';

const DELIVERY_STEPS = [
  'Добавьте товары в корзину и перейдите к оформлению заказа.',
  'Укажите контактные данные и выберите тестовый пункт выдачи (ПВЗ).',
  'Проверьте состав заказа и подтвердите оформление.',
  'Пройдите этап псевдооплаты и отслеживайте статус заказа в личном кабинете.',
];

const PAYMENT_RULES = [
  'Оплата в проекте учебная: реальный платежный шлюз не подключается.',
  'После успешной псевдооплаты заказ переводится в обработку.',
  'При ошибке оплаты заказ остается в статусе "ожидает оплаты", попытку можно повторить.',
  'Данные карты в БД не сохраняются; хранится только безопасная служебная метаинформация.',
];

const INFO_CARDS = [
  {
    icon: Truck,
    title: 'Выдача через ПВЗ',
    text: 'Вместо курьерской доставки используется тестовый сценарий выдачи через выбранный пункт.',
  },
  {
    icon: CalendarClock,
    title: 'Срок готовности',
    text: 'Для каждого ПВЗ показывается условное время готовности заказа, чтобы отработать полный бизнес-процесс.',
  },
  {
    icon: CreditCard,
    title: 'Псевдооплата',
    text: 'Этап оплаты имитирует реальный flow: ожидание, обработка, успех, ошибка или отмена.',
  },
  {
    icon: ShieldCheck,
    title: 'Безопасность',
    text: 'Система использует JWT-авторизацию, разграничение ролей и серверную валидацию данных.',
  },
];

export function DeliveryPage() {
  return (
    <Box py={60} bg="var(--color-bg)">
      <Container size="xl">
        <Stack gap={52}>
          <Stack gap="sm" maw={860}>
            <Text c="gold" fw={600} fz="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Сервис
            </Text>
            <Title order={1} style={{ fontFamily: '"Playfair Display", serif', lineHeight: 1.1 }}>
              Доставка и оплата
            </Title>
            <Text c="var(--color-secondary)" lh={1.8}>
              В проекте используется тестовый сценарий выдачи заказов через ПВЗ и псевдооплата. Это позволяет
              продемонстрировать полноценный цикл клиент-серверной системы без подключения внешней логистики и
              платежных провайдеров.
            </Text>
          </Stack>

          <Grid gutter={24} align="stretch">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper radius="xl" p="xl" bg="white" style={{ border: '1px solid var(--color-border)', height: '100%' }}>
                <Stack gap="md">
                  <Title order={3}>Как работает выдача заказа</Title>
                  <List spacing="sm" icon={<MapPinHouse size={16} color="var(--color-gold)" />}>
                    {DELIVERY_STEPS.map((step) => (
                      <List.Item key={step}>
                        <Text c="var(--color-secondary)" fz="sm" lh={1.7}>
                          {step}
                        </Text>
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper radius="xl" p="xl" bg="white" style={{ border: '1px solid var(--color-border)', height: '100%' }}>
                <Stack gap="md">
                  <Title order={3}>Условия псевдооплаты</Title>
                  <List spacing="sm" icon={<CreditCard size={16} color="var(--color-gold)" />}>
                    {PAYMENT_RULES.map((rule) => (
                      <List.Item key={rule}>
                        <Text c="var(--color-secondary)" fz="sm" lh={1.7}>
                          {rule}
                        </Text>
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          <Grid gutter={18}>
            {INFO_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Grid.Col key={card.title} span={{ base: 12, sm: 6, lg: 3 }}>
                  <Paper radius="lg" p="lg" bg="white" style={{ border: '1px solid var(--color-border)', height: '100%' }}>
                    <Stack gap="sm">
                      <ThemeIcon size={40} radius="md" color="gold" variant="light">
                        <Icon size={18} />
                      </ThemeIcon>
                      <Title order={4}>{card.title}</Title>
                      <Text c="var(--color-secondary)" fz="sm" lh={1.7}>
                        {card.text}
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
