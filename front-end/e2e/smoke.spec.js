import { expect, test } from '@playwright/test';

test('smoke: регистрация, заказ, оплата и admin-flow', async ({ page, request }) => {
  const email = `e2e.user.${Date.now()}@example.com`;

  await page.goto('/auth/register');
  await page.getByLabel('Имя').fill('E2E');
  await page.getByLabel('Фамилия').fill('User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Телефон').fill('+79990001122');
  await page.getByLabel('Пароль').fill('Strong12345');
  await page.getByLabel('Подтверждение пароля').fill('Strong12345');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

  await expect(page).toHaveURL(/\/auth\/login/);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Пароль').fill('Strong12345');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page).toHaveURL(/\/profile/);

  const token = await page.evaluate(() => localStorage.getItem('access_token'));
  expect(token).toBeTruthy();
  const productsResp = await request.get('http://127.0.0.1:8000/api/catalog/products/');
  const productsPayload = await productsResp.json();
  const productId = productsPayload.results[0].id;
  const addCartResp = await request.post('http://127.0.0.1:8000/api/cart/items/', {
    data: { product_id: productId, quantity: 1 },
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(addCartResp.ok()).toBeTruthy();

  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Корзина' })).toBeVisible();
  await page.getByRole('link', { name: 'Оформить заказ' }).click();

  await expect(page).toHaveURL(/\/checkout/);
  await page.getByRole('combobox', { name: 'Выберите пункт выдачи' }).click();
  await page.getByRole('option', { name: /E2E PVZ/ }).click();
  await page.getByRole('button', { name: 'Оплатить заказ' }).click();

  await expect(page).toHaveURL(/\/payment/);
  await page.getByLabel('Номер карты').fill('4111 1111 1111 1111');
  await page.getByLabel('Срок действия').fill('12/30');
  await page.getByLabel('CVV').fill('123');
  await page.getByLabel('Владелец карты').fill('E2E USER');
  await page.getByRole('button', { name: 'Оплатить' }).click();

  await expect(page.getByText('Оплачено успешно!')).toBeVisible();
  await page.getByRole('button', { name: 'В личный кабинет' }).click();
  await expect(page).toHaveURL(/\/profile/);

  await page.getByRole('button', { name: 'Выйти' }).click();
  await expect(page).toHaveURL(/(\/|\/auth\/login)$/);

  await page.goto('/auth/login');
  await page.getByLabel('Email').fill('admin-e2e@example.com');
  await page.getByLabel('Пароль').fill('Admin123456');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page).toHaveURL(/\/profile/);

  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Панель управления' })).toBeVisible();

  await page.getByRole('tab', { name: 'Пользователи' }).click();
  await page.getByPlaceholder('Поиск по email или имени...').fill(email);
  const userRow = page.getByRole('row', { name: new RegExp(email) });
  await expect(userRow.getByRole('cell', { name: email })).toBeVisible();
  await userRow.getByRole('button', { name: /Заблокировать|Разблокировать/ }).click();
  await expect(userRow.getByText('Заблокирован')).toBeVisible();

  await page.getByRole('tab', { name: 'ПВЗ' }).click();
  await page.getByRole('button', { name: 'Добавить ПВЗ' }).click();
  await page.getByLabel('Название').fill('E2E TEMP PVZ');
  await page.getByLabel('Город').fill('Moscow');
  await page.getByLabel('Адрес').fill('Temp 42');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByText('E2E TEMP PVZ')).toBeVisible();
});
