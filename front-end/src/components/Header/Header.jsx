import { Group, Text, ActionIcon, Badge, Box, Burger, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../shared/api/CartContext';
import { useAuth } from '../../shared/api/AuthContext';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: 'Каталог', path: '/catalog' },
  { label: 'Коллекции', path: '/collections' },
  { label: 'О нас', path: '/about' },
  { label: 'Доставка и оплата', path: '/delivery' },
  { label: 'Контакты', path: '/contacts' },
];

export function Header() {
  const location = useLocation();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          {/* Mobile burger */}
          <Burger
            opened={drawerOpened}
            onClick={openDrawer}
            className={styles.burger}
            size="sm"
            color="var(--color-graphite)"
          />

          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <Text
              component="span"
              fw={400}
              fz="1.5rem"
              style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.15em' }}
            >
              LUMINA
            </Text>
            <Text
              component="span"
              fz="0.55rem"
              c="var(--color-secondary)"
              style={{ letterSpacing: '0.25em', display: 'block', marginTop: '-2px' }}
            >
              JEWELRY
            </Text>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.navLink} ${location.pathname === link.path ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <Group gap="xs" className={styles.actions}>
            <ActionIcon variant="subtle" color="dark" size="lg" radius="xl" aria-label="Поиск">
              <Search size={20} strokeWidth={1.5} />
            </ActionIcon>
            
            {isAdmin && (
              <ActionIcon 
                variant="subtle" 
                color="gold.5" 
                size="lg" 
                radius="xl" 
                aria-label="Админка" 
                component={Link} 
                to="/admin"
                className={styles.hideOnMobile}
              >
                <ShieldCheck size={20} strokeWidth={1.5} />
              </ActionIcon>
            )}

            <ActionIcon variant="subtle" color="dark" size="lg" radius="xl" aria-label="Избранное" className={styles.hideOnMobile}>
              <Heart size={20} strokeWidth={1.5} />
            </ActionIcon>
            
            <ActionIcon
              variant="subtle"
              color="dark"
              size="lg"
              radius="xl"
              aria-label="Профиль"
              component={Link}
              to={isAuthenticated ? "/profile" : "/auth/login"}
              className={styles.hideOnMobile}
            >
              <User size={20} strokeWidth={1.5} />
            </ActionIcon>

            <Box pos="relative">
              <ActionIcon
                variant="subtle"
                color="dark"
                size="lg"
                radius="xl"
                aria-label="Корзина"
                component={Link}
                to="/cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
              </ActionIcon>
              {itemCount > 0 && (
                <Badge
                  size="xs"
                  circle
                  color="dark"
                  className={styles.cartBadge}
                >
                  {itemCount}
                </Badge>
              )}
            </Box>
          </Group>
        </div>
      </header>

      {/* Mobile drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="280px"
        padding="lg"
        title={
          <Text fw={400} fz="1.25rem" style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.12em' }}>
            LUMINA
          </Text>
        }
      >
        <Stack gap="lg" mt="md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={styles.mobileLink}
              onClick={closeDrawer}
            >
              {link.label}
            </Link>
          ))}
          
          <Box mt="md" pt="md" style={{ borderTop: '1px solid var(--color-border)' }}>
            {isAdmin && (
               <Link to="/admin" className={styles.mobileLink} style={{ color: 'var(--color-gold)' }} onClick={closeDrawer}>
                Панель управления
              </Link>
            )}
            <Link to={isAuthenticated ? "/profile" : "/auth/login"} className={styles.mobileLink} onClick={closeDrawer}>
              {isAuthenticated ? "Личный кабинет" : "Войти"}
            </Link>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
