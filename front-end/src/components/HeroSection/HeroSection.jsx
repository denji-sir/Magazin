import { Box, Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      
      {/* Background Image - Using a high quality placeholder since generation is unavailable */}
      <img 
        src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop" 
        alt="LUMINA Jewelry" 
        className={styles.bgImage}
      />

      <Container size="xl" className={styles.container}>
        <Stack gap="xl" maw={600} pos="relative" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Text 
              fz="sm" 
              fw={500} 
              className={styles.subTitle}
              style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              Коллекция Весна 2026
            </Text>
            <Title order={1} className={styles.title}>
              Искусство <br /> в каждой детали
            </Title>
            <Text fz="lg" c="var(--color-secondary)" mt="lg" className={styles.description}>
              Украшения ручной работы из серебра, созданные с любовью и вниманием к каждой детали. Найдите свое идеальное дополнение.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Group gap="md">
              <Button 
                size="lg" 
                variant="filled" 
                color="dark" 
                rightSection={<ArrowRight size={18} />}
                className={styles.cta}
              >
                Смотреть коллекцию
              </Button>
            </Group>
          </motion.div>
        </Stack>

        <Box className={styles.pagination}>
          <Text fz="xs" fw={600} className={styles.pageItemActive}>01</Text>
          <Box className={styles.pageDivider} />
          <Text fz="xs" fw={400} className={styles.pageItem}>02</Text>
          <Box className={styles.pageDivider} />
          <Text fz="xs" fw={400} className={styles.pageItem}>03</Text>
        </Box>
      </Container>
    </section>
  );
}
