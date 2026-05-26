import { Product, Testimonial } from './types';

export const productsData: Product[] = [
  {
    id: 'prod-01',
    name: 'Serum Glow Booster',
    price: 36.00,
    description: 'Un elixir híbrido que combina el poder hidratante de un sérum de ácido hialurónico con partículas de oro micronizadas para un acabado ultra-radiante y jugoso.',
    category: 'rostro',
    rating: 4.9,
    ratingCount: 124,
    image: '/src/assets/images/glow_booster_serum_1779829774489.png',
    shades: [
      { name: 'Universal Pearlescent', value: '#FAF6EE' },
      { name: 'Sunkissed Bronze', value: '#E3C1A1' }
    ],
    volume: '30 ml',
    benefits: [
      'Hidratación profunda por 24 horas',
      'Efecto difuminador de imperfecciones',
      'Acabado jugoso y radiante sin sensación grasa o pesada'
    ]
  },
  {
    id: 'prod-02',
    name: 'Labial Silk Rose',
    price: 24.50,
    description: 'Un labial cremoso de acabado satinado ultra confortable. Enriquecido con manteca de karité y aceite de jojoba que nutre tus labios mientras aporta un color rosa profundo y duradero.',
    category: 'labios',
    rating: 4.8,
    ratingCount: 98,
    image: '/src/assets/images/lipstick_satin_1779829743844.png',
    shades: [
      { name: 'Rose Silk', value: '#C68285' },
      { name: 'Nude Velour', value: '#B27F70' },
      { name: 'Sunset Amber', value: '#D2604B' },
      { name: 'Rouge Glamour', value: '#A32938' }
    ],
    volume: '4.2 g',
    benefits: [
      'Fórmula cremosa no resecante',
      'Textura sedosa de alta pigmentación',
      'Enriquecido con vitaminas C y E protectoras'
    ]
  },
  {
    id: 'prod-03',
    name: 'Polvo Iluminador Celestial',
    price: 32.00,
    description: 'Iluminador compacto prensado formulado con perlas ultrafinas que reflejan la luz tridimensionalmente. Ofrece un brillo personalizable que se funde como seda sobre la piel.',
    category: 'brillo',
    rating: 4.95,
    ratingCount: 182,
    image: '/src/assets/images/highlighter_compact_1779829758414.png',
    shades: [
      { name: 'Champagne Sparkle', value: '#F2DFD2' },
      { name: 'Rose Quartz Shimmer', value: '#ECD5D9' },
      { name: 'Golden Hour Dusk', value: '#D8B897' }
    ],
    volume: '8 g',
    benefits: [
      'Reflejo de luz 3D ultra elegante',
      'Fórmula suave y modulable que no marca texturas',
      'Apto para rostro, ojos y cuerpo'
    ]
  },
  {
    id: 'prod-04',
    name: 'Paleta Dreamy Nudes',
    price: 48.00,
    description: 'Una cuidada selección de 10 sombras de ojos altamente pigmentadas. Combina mates aterciopelados y metalizados cremosos en una armonía de colores tierra cálidos, bronces y champaña.',
    category: 'ojos',
    rating: 4.7,
    ratingCount: 86,
    image: '/src/assets/images/eyeshadow_palette_1779829790519.png',
    shades: [
      { name: 'Warm Palette Harmony', value: '#966E53' }
    ],
    volume: '12 g',
    benefits: [
      'Mates ultra difuminables de alta adherencia',
      'Metálicos de brillo húmedo de larga duración',
      'Incluye un espejo de alta definición'
    ]
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Valeria S.',
    role: 'Cliente VIP',
    comment: '¡El Serum Glow Booster cambió las reglas del juego para mí! Deja un brillo natural exquisito, como si viniera de adentro. Literalmente mi piel se siente revitalizada e increíblemente sedosa.',
    rating: 5,
    date: 'Hace 3 semanas',
    avatarSeed: 'VS'
  },
  {
    id: 'test-2',
    name: 'Camila R.',
    role: 'Maquilladora Profesional',
    comment: 'Los iluminadores compactos de J&M Glow Cosmetics son imbatibles en mi set de bodas. No marcan la textura de la piel y bajo los reflectores de la cámara dan un efecto húmedo, sofisticado y celestial.',
    rating: 5,
    date: 'Hace 1 mes',
    avatarSeed: 'CR'
  },
  {
    id: 'test-3',
    name: 'Sofía M.',
    role: 'Cliente Verificado',
    comment: 'Compré la paleta Dreamy Nudes y el labial Silk Rose en tono Rose Silk. Qué calidad de pigmento. Se difumina de maravilla y dura todo el día sin resecar. ¡Además, el empaque es todo un lujo!',
    rating: 5,
    date: 'Hace 2 semanas',
    avatarSeed: 'SM'
  }
];
