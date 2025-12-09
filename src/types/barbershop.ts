import { Review } from '@/features/reviews/types';
import { LoyaltyConfig } from '@/features/loyalty/types';

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
  id: string;
  slug: string;
  template_id: 'classic' | 'modern' | 'urban';
  content: {
    name: string;
    description: string;
    hero_image: string;
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
      instagram?: string;
      whatsapp: string;
      email?: string;
    };
    availability?: {
      days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
      hours: {
        start: string; // "09:00"
        end: string;   // "18:00"
      };
    };
  };
  services: Service[];
  gallery: string[];
  reviews?: Review[];
  faq?: FAQItem[];
  loyalty?: LoyaltyConfig;
}

