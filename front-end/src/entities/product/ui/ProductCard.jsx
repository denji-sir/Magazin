import { Card, Image, Text, Group, ActionIcon, Stack, Box, Badge } from '@mantine/core';
import { ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../../shared/api/CartContext';
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card padding="md" radius="lg" className={styles.card}>
        <Card.Section pos="relative" className={styles.imageSection}>
          <Link to={`/catalog/${product.id}`}>
            <Image
              src={product.image}
              height={280}
              alt={product.name}
              fallbackSrc="https://placehold.co/400x500?text=Product"
              className={styles.image}
            />
          </Link>
          
          <ActionIcon
            variant="white"
            color="dark"
            radius="xl"
            size="lg"
            className={styles.wishlistBtn}
            aria-label="В избранное"
          >
            <Heart size={18} strokeWidth={1.5} />
          </ActionIcon>

          {product.isNew && (
            <Badge variant="filled" color="gold" className={styles.badge} radius="xs">
              NEW
            </Badge>
          )}
        </Card.Section>

        <Stack mt="md" gap={4}>
          <Link to={`/catalog/${product.id}`} className={styles.titleLink}>
            <Text fw={500} fz="sm" className={styles.name}>
              {product.name}
            </Text>
          </Link>
          
          <Group justify="space-between" align="center" mt={4}>
            <Text fw={600} fz="md" c="var(--color-graphite)">
              {product.price.toLocaleString()} ₽
            </Text>
            
            <ActionIcon
              variant="light"
              color="dark"
              radius="md"
              size="lg"
              onClick={() => addItem(product)}
              aria-label="В корзину"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
            </ActionIcon>
          </Group>
        </Stack>
      </Card>
    </motion.div>
  );
}
