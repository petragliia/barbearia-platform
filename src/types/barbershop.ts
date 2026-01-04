import { Review } from '@/features/reviews/types';
import { LoyaltyConfig } from '@/features/loyalty/types';
import { NotificationSettings } from '@/features/notifications/types';

export interface Service {
  name: string;
  price: number;
  duration: string; // e.g., "30 min"
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BarbershopData {
  uid: string; // Add this
  id: string;
  slug: string;
  name: string; // Moved to root
  isPublished: boolean; // Required, default false
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  contact: {
    phone: string;
    address: string;
    instagram?: string; // Optional in schema but good to have
    whatsapp: string;
    email?: string;
  };
  products: Product[]; // Required array
  services: Service[];
  gallery: string[];
  reviews?: Review[];
  faq?: FAQItem[];
  loyalty?: LoyaltyConfig;
  notificationSettings?: NotificationSettings;
  subscription?: {
    plan: 'basic' | 'pro' | 'premium';
    status: 'active' | 'past_due' | 'canceled' | 'trialing';
    renewsAt: string;
  };
  template_id: 'classic' | 'modern' | 'urban';
  content: {
    // Legacy / Specific template fields
    description: string;
    hero_image: string;
    cta_text?: string;
    services_title?: string;
    services_subtitle?: string;
    services_description?: string;
    font?: string;
    gallery_title?: string;
    gallery_subtitle?: string;
    about_title?: string;
    about_description?: string;
    hero_title?: string;
    hero_subtitle?: string;
    about_title_top?: string;
    about_title_middle?: string;
    about_title_bottom?: string;
    features?: string[];
    showProductsSection?: boolean;
    sections?: string[]; // Order of sections: 'hero', 'services', 'products', 'reviews', 'contact'
    availability?: {
      days: number[];
      hours: {
        start: string;
        end: string;
      };
    };
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  active: boolean;
}


