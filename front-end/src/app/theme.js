/**
 * Mantine Theme — LUMINA Jewelry Store
 * Based on DESIGN.md: soft luxury editorial e-commerce
 */

import { createTheme } from '@mantine/core';

/* ─── Color tokens from DESIGN.md ─── */
export const colors = {
  background: '#F7F3ED',
  white: '#FFFFFF',
  graphite: '#151515',
  darkGraphite: '#0F0F0F',
  secondaryText: '#6F6A63',
  gold: '#C6A15B',
  champagne: '#E6D6B8',
  warmBeige: '#DDD0BF',
  border: '#E7E0D6',
  success: '#2F7D57',
  warning: '#B9822B',
  error: '#B84A4A',
  info: '#4F6F8F',
};

/* ─── Shadow tokens ─── */
export const shadows = {
  card: '0 10px 30px rgba(15, 15, 15, 0.06)',
  cardHover: '0 18px 45px rgba(15, 15, 15, 0.10)',
  modal: '0 24px 70px rgba(15, 15, 15, 0.18)',
};

/* ─── Mantine theme ─── */
export const theme = createTheme({
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: '500',
    sizes: {
      h1: { fontSize: '3.25rem', lineHeight: '1.1' },
      h2: { fontSize: '2.5rem', lineHeight: '1.2' },
      h3: { fontSize: '1.75rem', lineHeight: '1.25' },
      h4: { fontSize: '1.25rem', lineHeight: '1.3' },
      h5: { fontSize: '1rem', lineHeight: '1.4' },
    },
  },
  primaryColor: 'dark',
  colors: {
    // Custom gold shade scale for Mantine
    gold: [
      '#FFF9F0',
      '#F5ECD8',
      '#E6D6B8',
      '#DDD0BF',
      '#D4C4A6',
      '#C6A15B',
      '#B08D45',
      '#9A7A3A',
      '#846830',
      '#6E5626',
    ],
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '10px',
    lg: '18px',
    xl: '24px',
  },
  shadows: {
    xs: '0 1px 3px rgba(15, 15, 15, 0.03)',
    sm: '0 4px 12px rgba(15, 15, 15, 0.04)',
    md: shadows.card,
    lg: shadows.cardHover,
    xl: shadows.modal,
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          fontSize: '0.9375rem',
          height: '48px',
          paddingLeft: '28px',
          paddingRight: '28px',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          height: '48px',
          borderColor: colors.border,
          '&:focus': {
            borderColor: colors.gold,
          },
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          height: '48px',
          borderColor: colors.border,
        },
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'xl',
        shadow: 'xl',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'sm',
        variant: 'light',
      },
    },
  },
});
