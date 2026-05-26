export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'rostro' | 'labios' | 'ojos' | 'brillo';
  rating: number;
  ratingCount: number;
  image: string;
  shades: { name: string; value: string }[];
  volume: string;
  benefits: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShade: string; // The shade value (e.g. #FFC0CB) or name
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
  avatarSeed: string; // seed for picsum or avatar initials
}

export interface SkinQuizAnswers {
  skinType: string;
  undertone: string;
  finishPreference: string;
}
