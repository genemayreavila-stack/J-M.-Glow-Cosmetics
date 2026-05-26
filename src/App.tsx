import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  Smartphone, 
  Mail, 
  Instagram, 
  MapPin, 
  ArrowRight,
  Droplet,
  Shuffle,
  Smile,
  Heart,
  Sliders,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Testimonial, SkinQuizAnswers } from './types';
import { productsData, testimonialsData } from './data';

const ProductCard = ({ 
  product, 
  handleAddToCart 
}: { 
  product: Product; 
  handleAddToCart: (product: Product, shadeValue: string, customQty?: number) => void; 
  key?: string | number;
}) => {
  const [cardShadeIdx, setCardShadeIdx] = useState<number>(0);
  const activeShade = product.shades[cardShadeIdx] || product.shades[0];

  return (
    <motion.div 
      layout
      className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#D48C70]/10 overflow-hidden flex flex-col justify-between hover:shadow-glow-md transition-all group duration-300"
    >
      {/* Visual Media Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF7F2] cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Rating bubble absolute badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#2D2422] px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm border border-[#D48C70]/10">
          <Star className="w-3 h-3 text-[#D48C70] fill-[#D48C70]" />
          {product.rating}
        </span>
        {product.price > 35 && (
          <span className="absolute top-3 right-3 bg-[#F4B9B8] text-[#2D2422] px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold rounded-full shadow">
            Luxury Icon
          </span>
        )}
      </div>

      {/* Card Information Body */}
      <div className="p-5 flex-grow flex flex-col justify-between text-left">
        <div>
          {/* Upper taxonomy row */}
          <div className="flex items-center justify-between gap-1 text-[9px] font-mono uppercase tracking-widest text-[#D48C70] mb-2 font-bold">
            <span>{product.category}</span>
            <span>{product.volume}</span>
          </div>

          {/* Title & brief desc */}
          <h3 className="font-serif italic font-semibold text-base text-[#2D2422] tracking-wide mb-2 group-hover:text-[#D48C70] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#2D2422]/60 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Shade Selection dot selector row */}
        {product.shades.length > 1 && (
          <div className="mb-4">
            <span className="text-[10px] text-[#2D2422]/60 block mb-2 font-bold uppercase tracking-wider">
              Tono: {activeShade.name}
            </span>
            <div className="flex gap-2">
              {product.shades.map((shade, idx) => (
                <button
                  key={shade.value}
                  onClick={() => setCardShadeIdx(idx)}
                  className={`w-5 h-5 rounded-full border border-[#D48C70]/20 relative transition-all ${
                    cardShadeIdx === idx ? 'scale-115 ring-2 ring-[#D48C70] ring-offset-1' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: shade.value }}
                  title={shade.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Buy Action segment */}
        <div className="border-t border-[#D48C70]/10 pt-4 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[9px] text-[#2D2422]/40 block font-mono uppercase tracking-wider font-bold">Precio</span>
            <span className="font-serif italic font-bold text-[#2D2422] text-lg">${product.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => handleAddToCart(product, activeShade.value, 1)}
            className="bg-[#2D2422] hover:bg-[#D48C70] hover:text-white text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-full transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default function App() {
  // Category & Shopper Search
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  // Success Notification banner
  const [addedNote, setAddedNote] = useState<string | null>(null);

  // Before & After Interactive Slider (0 - 100%)
  const [beforeAfterRatio, setBeforeAfterRatio] = useState<number>(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isSliding, setIsSliding] = useState<boolean>(false);

  // Glow Virtual Shade Lab Settings
  const [selectedLabProdId, setSelectedLabProdId] = useState<string>('prod-02'); // Rose lipstick by default
  const [glowIntensity, setGlowIntensity] = useState<number>(75);
  const [glowShineOpacity, setGlowShineOpacity] = useState<number>(80);
  // Default selected color for the lab
  const labProduct = productsData.find(p => p.id === selectedLabProdId) || productsData[1];
  const [labSelectedShade, setLabSelectedShade] = useState(labProduct.shades[0]);

  // Sync Lab Shade selection when transitioning products
  useEffect(() => {
    const freshProd = productsData.find(p => p.id === selectedLabProdId);
    if (freshProd) {
      setLabSelectedShade(freshProd.shades[0]);
    }
  }, [selectedLabProdId]);

  // Skin Quiz State
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = not started, 1..3 = questions, 4 = results
  const [quizAnswers, setQuizAnswers] = useState<SkinQuizAnswers>({
    skinType: 'normal',
    undertone: 'neutral',
    finishPreference: 'satinado'
  });

  // Highlight Routine Builder steps
  const [activeRoutineSteps, setActiveRoutineSteps] = useState<string[]>([
    'prod-01', // serum
    'prod-03'  // highlighter compact
  ]);

  // Dynamic reviews submitted by the user
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialsData);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    category: 'rostro'
  });
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Newsletter Sign up
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterOk, setNewsletterOk] = useState<boolean>(false);

  // Contact form
  const [contactFormSubmitted, setContactFormSubmitted] = useState<boolean>(false);
  const [contactMessage, setContactMessage] = useState({
    name: '',
    email: '',
    subject: '',
    text: ''
  });

  // Helper: Find product by id
  const getProductById = (id: string): Product | undefined => {
    return productsData.find(p => p.id === id);
  };

  // Add item to cart with custom shade selection
  const handleAddToCart = (product: Product, selectedShadeValue: string, customQty = 1) => {
    const shadeName = product.shades.find(s => s.value === selectedShadeValue)?.name || 'Estándar';
    
    // Check if matching item is already in the cart
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.selectedShade === shadeName
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += customQty;
      setCart(updated);
    } else {
      setCart([...cart, {
        product,
        quantity: customQty,
        selectedShade: shadeName
      }]);
    }

    setAddedNote(`¡${product.name} (${shadeName}) agregado al carrito!`);
    setTimeout(() => setAddedNote(null), 3000);
  };

  // Quick Action to add multiple items from Quiz recomended pack or routine
  const handleAddMultipleToCart = (productsList: { product: Product; shadeValue: string }[], discountMultiplier = 1) => {
    let updatedCart = [...cart];

    productsList.forEach(({ product, shadeValue }) => {
      const shadeName = product.shades.find(s => s.value === shadeValue)?.name || product.shades[0].name;
      
      const existingIdx = updatedCart.findIndex(
        item => item.product.id === product.id && item.selectedShade === shadeName
      );

      // We apply a custom modified price inside product object for display, if any
      const discountedProduct = discountMultiplier < 1 ? {
        ...product,
        price: Math.round(product.price * discountMultiplier * 100) / 100
      } : product;

      if (existingIdx > -1) {
        updatedCart[existingIdx].quantity += 1;
      } else {
        updatedCart.push({
          product: discountedProduct,
          quantity: 1,
          selectedShade: shadeName
        });
      }
    });

    setCart(updatedCart);
    setAddedNote("¡Kit personalizado de Maquillaje Glow agregado al carrito!");
    setTimeout(() => setAddedNote(null), 3000);
  };

  // Update Item Quantity in Cart
  const updateCartQty = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const removeCartItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // Calculates subtotal, shipping, and total
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const baseShippingCost = subtotal > 60 ? 0 : 5.90;
  const estimatedTax = subtotal * 0.16; // 16% IVA
  const orderTotal = subtotal + baseShippingCost + estimatedTax;

  // Render before-and-after drag helper
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setBeforeAfterRatio(Math.max(0, Math.min(100, pos)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSliding || e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  // Compute recommendation based on Skin Quiz Answers
  const getQuizRecommendation = () => {
    const list: Product[] = [];
    
    // Choose serum or compact based on skin type & finish preference
    if (quizAnswers.skinType === 'normal' || quizAnswers.skinType === 'sensitive') {
      list.push(productsData[0]); // Glow Booster Serum
    } else {
      list.push(productsData[2]); // Pressed highlighter compact
    }

    // Add lips or eyes based on preferences or undertones
    if (quizAnswers.undertone === 'cool' || quizAnswers.undertone === 'neutral') {
      list.push(productsData[1]); // Labial Silk Rose (ideal undertone blending)
    } else {
      list.push(productsData[3]); // Paleta Dreamy Nudes
    }

    // Ensure we always suggest at least 2 coordinate products
    if (list.length < 2) {
      list.push(productsData[1]);
    }
    
    return list;
  };

  const handleQuizSubmit = () => {
    setQuizStep(4);
  };

  const recommendedBundle = getQuizRecommendation();
  const rawBundlePrice = recommendedBundle.reduce((sum, p) => sum + p.price, 0);
  const dynamicBundlePrice = Math.round(rawBundlePrice * 0.85 * 100) / 100; // 15% off bundle code

  // Filter products by category & search query
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    
    const submittedReview: Testimonial = {
      id: `review-${Date.now()}`,
      name: newReview.name,
      role: 'Cliente Verificado',
      comment: newReview.comment,
      rating: newReview.rating,
      date: 'Recientemente',
      avatarSeed: newReview.name.substring(0, 2).toUpperCase()
    };

    setTestimonials([submittedReview, ...testimonials]);
    setNewReview({ name: '', rating: 5, comment: '', category: 'rostro' });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div id="glow-page-root" className="min-h-screen bg-[#FDFBF7] text-[#2B231D] selection:bg-[#EBC1BC] selection:text-[#2B231D]">
      
      {/* Decorative Orbs - Ambient Glow */}
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#EEC1BC] to-[#FCE4EC] opacity-10 blur-[120px] rounded-full pointer-events-none glow-ambient-orb-1" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#E6C29E] to-[#FCE4EC] opacity-15 blur-[130px] rounded-full pointer-events-none glow-ambient-orb-2" />
      
      {/* Success Notification Banner */}
      <AnimatePresence>
        {addedNote && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-[#2B231D] text-white px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-glow-lg flex items-center gap-3 border border-rgba(255,255,255,0.15)"
          >
            <Sparkles className="w-4 h-4 text-[#E6C29E] animate-pulse" />
            <span>{addedNote}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkly Cart Counter Action */}
      <button 
        id="floating-cart-toggle" 
        onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
        className="fixed bottom-6 right-6 z-[100] md:hidden bg-[#2B231D] text-white p-4 rounded-full shadow-glow-lg flex items-center justify-center border border-[#c58a7f]"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#c58a7f] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>
      </button>

      {/* 1. Header Navigation */}
      <header id="main-navigation-header" className="sticky top-0 z-[100] glass-panel bg-white/70 border-b border-[#F5ECE5] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-display text-2xl tracking-widest font-bold text-[#2B231D]">
              J & M <span className="text-[#c58a7f] italic font-normal tracking-normal font-sans">Glow</span>
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium">
            <a href="#productos" className="hover:text-[#c58a7f] transition-colors duration-200 py-1">Colección</a>
            <a href="#probador" className="hover:text-[#c58a7f] transition-colors duration-200 py-1 flex items-center gap-1">
              Virtual Lab <span className="text-[10px] bg-[#EBC1BC] text-[#8C463F] px-1.5 py-0.2 rounded font-sans shrink-0 uppercase tracking-tight">Probador</span>
            </a>
            <a href="#diagnostico" className="hover:text-[#c58a7f] transition-colors duration-200 py-1">Glow Quiz</a>
            <a href="#rutinas" className="hover:text-[#c58a7f] transition-colors duration-200 py-1">Rutinas</a>
            <a href="#testimonios" className="hover:text-[#c58a7f] transition-colors duration-200 py-1 font-mono text-[11px]">Reseñas</a>
            <a href="#contacto" className="hover:text-[#c58a7f] transition-colors duration-200 py-1">Contacto</a>
          </nav>

          {/* Right Icon Actions */}
          <div className="flex items-center gap-5">
            <button 
              id="desktop-cart-toggle" 
              onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
              className="relative p-2 text-[#2B231D] hover:text-[#c58a7f] transition-colors cursor-pointer"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#c58a7f] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
            <a 
              href="#productos" 
              className="hidden lg:inline-block bg-[#2B231D] text-white text-xs uppercase tracking-widest font-semibold px-5  py-2.5 rounded hover:bg-[#c58a7f] transition-all duration-300 shadow-glow-sm"
            >
              Comprar Ahora
            </a>
          </div>
        </div>
      </header>

      {/* 2. Brand Hero Section */}
      <section id="hero" className="relative bg-[#FAF7F2] overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Decorative generated Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/glow_hero_banner_1779829724625.png" 
            alt="Fondo Cosméticos J & M Glow" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 scale-102"
          />
          {/* Delicate shadow gradient overlays to guarantee perfect text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-[1px] bg-[#D48C70]"></div>
              <span className="text-[11px] uppercase tracking-[0.4em] text-[#D48C70] font-bold">Nueva Colección de Lujo</span>
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] italic mb-6 text-[#2D2422]">
              Siente el <br />
              <span className="text-[#D48C70] not-italic">Glow</span> en <br />
              tu piel
            </h1>
            
            <p className="text-[#2D2422]/70 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
              Nacida del deseo de resaltar la luz interior. J & M Glow combina ciencia botánica con pigmentos de lujo para un acabado etéreo, sutil, elegante y duradero.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#productos" 
                className="inline-flex justify-center items-center gap-2 bg-[#D48C70] text-white text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300"
              >
                Ver Colección
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#probador" 
                className="inline-flex justify-center items-center gap-2 bg-white/40 backdrop-blur-md border border-[#D48C70]/30 text-[#2D2422] text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/80 hover:border-[#D48C70] transition-all duration-300"
              >
                Probador Virtual
                <Droplet className="w-4 h-4 text-[#D48C70]" />
              </a>
            </div>

            {/* Micro Badges of Trust */}
            <div className="mt-12 flex flex-wrap gap-6 items-center border-t border-[#D48C70]/10 pt-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2D2422]/60">
                <span className="w-2 h-2 rounded-full bg-[#D48C70]" /> 100% Vegano
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2D2422]/60">
                <span className="w-2 h-2 rounded-full bg-[#D48C70]" /> Cruelty-Free Certificado
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2D2422]/60">
                <span className="w-2 h-2 rounded-full bg-[#D48C70]" /> Envío Global Premium
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Before & After Makeup Reveal Container */}
      <section id="interactive-reveal-section" className="py-20 bg-[#FAF7F2]/60 border-y border-[#D48C70]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Text explanation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#D48C70] font-bold uppercase tracking-widest">
                <Shuffle className="w-4 h-4" />
                <span>Interactivo: Deslizar el Revelador</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-[#2D2422]">
                El efecto luminoso instantáneo directo en tu rostro
              </h2>
              <p className="text-[#2D2422]/70 text-sm leading-relaxed">
                Nuestra tecnología de formulación reflectante aporta un brillo natural tridimensional que se adapta a cada expresión. Usa este panel táctil interactivo para contrastar el cutis antes y después de aplicar el **Polvo Celestial J&M Glow**:
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#FAF7F2] flex items-center justify-center shrink-0 border border-[#D48C70]/30 shadow-sm mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#D48C70]" />
                  </div>
                  <p className="text-xs text-[#2D2422]/80 leading-relaxed"><strong>Antes:</strong> Rostro limpio de aspecto tradicional, piel apagada sin partículas de luz orgánica.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#FAF7F2] flex items-center justify-center shrink-0 border border-[#D48C70]/30 shadow-sm mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#D48C70]" />
                  </div>
                  <p className="text-xs text-[#2D2422]/80 leading-relaxed"><strong>Después:</strong> Velvet touch con microperlas refractivas, realce sublime e hidratación prismática.</p>
                </div>
              </div>
              <div className="pt-4">
                <a href="#diagnostico" className="text-xs tracking-widest uppercase font-bold text-[#D48C70] hover:text-[#2D2422] flex items-center gap-1.5 transition-colors">
                  Iniciar Diagnóstico Personalizado <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Slider Widget Screen */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div 
                ref={sliderRef}
                className="relative w-full aspect-square max-w-[500px] rounded-3xl overflow-hidden shadow-glow-lg border border-[#D48C70]/10 select-none cursor-ew-resize"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseDown={() => setIsSliding(true)}
                onMouseUp={() => setIsSliding(false)}
                onMouseLeave={() => setIsSliding(false)}
              >
                {/* Before Image (Left side base) with cool flat filter style */}
                <div className="absolute inset-0 w-full h-full bg-[#ECE7E3]">
                  <img 
                    src="/src/assets/images/glow_model_portrait_1779829844369.png" 
                    alt="Modelo antes del maquillaje" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter saturate-[0.6] brightness-[0.92]" 
                  />
                  {/* Before Overlay Text Badge */}
                  <span className="absolute bottom-4 left-4 bg-[#2D2422]/80 backdrop-blur-sm text-[#FAF7F2] px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold rounded-lg shadow">
                    Piel Común (Matte)
                  </span>
                </div>

                {/* After Image (Right side absolute reveal layer) clipped by slider ratio */}
                <div 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ clipPath: `polygon(0 0, ${beforeAfterRatio}% 0, ${beforeAfterRatio}% 100%, 0 100%)` }}
                >
                  <img 
                    src="/src/assets/images/glow_model_portrait_1779829844369.png" 
                    alt="Modelo acabado Glow" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter saturate-[1.2] brightness-[1.08] contrast-[1.03]"
                  />
                  {/* Subtle warm magic overlay strictly matched to coordinates */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#D48C70]/20 via-transparent to-[#F4B9B8]/20 mix-blend-color-burn" />
                  
                  {/* After Overlay Text Badge */}
                  <span className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-[#2D2422] px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow border border-[#D48C70]/30 animate-pulse">
                    Brillo J&M Glow ✨
                  </span>
                </div>

                {/* Interactive Drag Handle line and controls */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-white text-[#2D2422] z-20 shadow-lg pointer-events-none"
                  style={{ left: `${beforeAfterRatio}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-[#2D2422] hover:bg-[#D48C70] hover:text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-[#D48C70]/40 pointer-events-none transition-colors">
                    <Shuffle className="w-4 h-4 shrink-0 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Manual Assistant Bar Slider underneath */}
              <div className="w-full max-w-[500px] mt-6 flex items-center justify-between px-2 text-xs font-semibold text-[#2D2422]/60">
                <span>100% Piel Natural</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={beforeAfterRatio} 
                  onChange={(e) => setBeforeAfterRatio(Number(e.target.value))}
                  className="w-1/2 h-1 bg-[#EEDCD0] rounded-lg appearance-none cursor-pointer accent-[#D48C70]" 
                />
                <span>100% Brillo Divino</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. Glow Virtual Shade Lab (Probador de Tonos) */}
      <section id="probador" className="py-20 bg-[#FAF7F2] border-b border-[#D48C70]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#D48C70] text-xs font-bold uppercase tracking-widest inline-block mb-2">
              Experiencia J&M Swatch Lab
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#2D2422]">
              Probador de Texturas y Tonos Virtual
            </h2>
            <p className="text-[#2D2422]/70 mt-3 text-sm leading-relaxed">
              Combina digitalmente la opacidad e intensidad de brillo de los cosméticos J&M en tiempo real para visualizar cómo actúan las texturas sedosas según las variaciones de luz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Lab control panel */}
            <div className="lg:col-span-5 bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-glow-sm border border-[#D48C70]/10 flex flex-col justify-between">
              <div>
                <h3 className="font-serif italic font-semibold text-xl mb-6 flex items-center gap-2 text-[#2D2422]">
                  <Sliders className="w-5 h-5 text-[#D48C70]" />
                  Configuración de la Muestra
                </h3>

                {/* Step A: Select makeup type */}
                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2D2422]/60 mb-3">
                    1. Elegir Cosmético J&M
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {productsData.filter(p => p.shades.length > 0).map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => setSelectedLabProdId(prod.id)}
                        className={`p-3 rounded-xl text-left border text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedLabProdId === prod.id
                            ? 'border-[#D48C70] bg-[#FAF7F2] text-[#D48C70]'
                            : 'border-[#D48C70]/10 bg-white/60 text-[#2D2422]/70 hover:border-[#D48C70]/40'
                        }`}
                      >
                        {prod.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step B: Select available tones / shades */}
                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2D2422]/60 mb-3">
                    2. Seleccionar Tono ({labSelectedShade?.name || 'Por defecto'})
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {labProduct.shades.map((shade) => (
                      <button
                        key={shade.value}
                        onClick={() => setLabSelectedShade(shade)}
                        className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-transform ${
                          labSelectedShade.value === shade.value 
                            ? 'scale-115 ring-2 ring-[#D48C70] ring-offset-2' 
                            : 'hover:scale-105'
                        }`}
                        title={shade.name}
                        style={{ backgroundColor: shade.value }}
                      >
                        {labSelectedShade.value === shade.value && (
                           <Check className="w-4 h-4 text-white drop-shadow-md mix-blend-difference" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step C: Intensity adjustment slider */}
                <div className="mb-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-[#2D2422]/60 uppercase tracking-widest mb-1.5">
                      <span>Reflejo de Brillo</span>
                      <span>{glowIntensity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="100" 
                      value={glowIntensity}
                      onChange={(e) => setGlowIntensity(Number(e.target.value))}
                      className="w-full h-1 bg-[#EEDCD0] rounded accent-[#D48C70] cursor-pointer" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-[#2D2422]/60 uppercase tracking-widest mb-1.5">
                      <span>Concentración (Opacidad)</span>
                      <span>{glowShineOpacity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      value={glowShineOpacity}
                      onChange={(e) => setGlowShineOpacity(Number(e.target.value))}
                      className="w-full h-1 bg-[#EEDCD0] rounded accent-[#D48C70] cursor-pointer" 
                    />
                  </div>
                </div>
              </div>

              {/* Add Custom Selection from Lab to Cart */}
              <div className="border-t border-[#D48C70]/10 pt-6 mt-6">
                <p className="text-xs text-[#2D2422]/70 mb-4 font-semibold">
                  Configurado: <strong className="text-[#2D2422]">{labProduct.name}</strong> en tono <strong className="text-[#D48C70]">{labSelectedShade.name}</strong>.
                </p>
                <button
                  onClick={() => handleAddToCart(labProduct, labSelectedShade.value, 1)}
                  className="w-full bg-[#2D2422] text-[#FAF7F2] py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D48C70] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Agregar Configuración a Carrito — ${labProduct.price.toFixed(2)}
                </button>
              </div>

            </div>

             {/* Simulated Live Texture Smear Swatch View */}
            <div className="lg:col-span-7 bg-white/60 backdrop-blur-md rounded-3xl border border-[#D48C70]/10 overflow-hidden flex flex-col justify-between p-6 sm:p-8 relative">
              
              {/* Product Reference */}
              <div className="flex items-center justify-between border-b border-[#D48C70]/10 pb-4 z-10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D48C70]">
                    J&M Swatch Lab #{(labProduct.id)}
                  </span>
                  <h4 className="font-serif italic font-semibold text-[#2D2422] text-lg">
                    {labProduct.name} - Textura Digital Live
                  </h4>
                </div>
                <span className="text-[10px] font-bold font-mono bg-[#FAF7F2] border border-[#D48C70]/20 px-3 py-1.5 text-[#D48C70] rounded-full">
                  {labProduct.volume}
                </span>
              </div>

              {/* Texture Swatch Board */}
              <div className="my-8 min-h-[220px] rounded-2xl relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF7F2] to-[#EEDCD0]/30">
                
                {/* Background decorative shadows to simulate 3D cosmetics depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7),transparent)]" />

                {/* Swatch fluid smear simulated via beautiful absolute reactive element */}
                <div 
                  className="w-3/4 h-36 rounded-full blur-[0.5px] relative animate-pulse"
                  style={{
                    background: `linear-gradient(135deg, ${labSelectedShade.value} 0%, #FFFFFF ${100 + (100 - glowIntensity) * 0.8}%)`,
                    opacity: glowShineOpacity / 100,
                    transform: `scale(${1 + (glowIntensity / 250)}) rotate(-8deg)`,
                    boxShadow: `
                      0 10px 40px rgba(0,0,0,0.06), 
                      inset 0 -5px 25px rgba(0,0,0,0.15),
                      0 0 ${glowIntensity / 2}px ${labSelectedShade.value}60
                    `,
                    borderRadius: labProduct.category === 'labios' 
                      ? '50px 30px 40px 10px' // Creamy lip smear style
                      : '80px 20px 80px 40px'  // Face serum fluid smear style
                  }}
                >
                  {/* Subtle 3D glossy highlight line reacting to opacity/glow */}
                  <div 
                    className="absolute top-2 left-6 right-6 h-5 bg-white/70 rounded-full blur-[1px] pointer-events-none"
                    style={{
                      opacity: (glowIntensity / 100) * 0.9,
                      transform: `scaleY(${glowShineOpacity / 100})`
                    }}
                  />
                  {/* Particle shimmer stars reacting to intensity */}
                  {glowIntensity > 50 && (
                    <>
                      <Sparkles className="absolute top-4 left-1/4 w-3.5 h-3.5 text-white/90 drop-shadow animate-ping" />
                      <Sparkles className="absolute bottom-4 right-1/4 w-3 h-3 text-white/85 drop-shadow animate-bounce" />
                    </>
                  )}
                </div>

                <div className="absolute bottom-3 text-center pointer-events-none z-10 w-full">
                  <div className="text-[10px] tracking-wider text-[#2D2422]/60 font-sans">
                    Reflejo: <span className="font-bold text-[#D48C70]">{glowIntensity}% Luminosidad</span> • Acabado: <span className="font-bold text-[#2D2422]">{glowIntensity > 75 ? 'Radiante Sublime' : glowIntensity > 40 ? 'Satinado Natural' : 'Aterciopelado'}</span>
                  </div>
                </div>

              </div>

              {/* Swatch detail specs */}
              <div className="border-t border-[#D48C70]/10 pt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h5 className="font-bold text-[#2D2422] uppercase tracking-wider text-[10px] mb-1">
                    Beneficio Destacado
                  </h5>
                  <p className="text-[#2D2422]/70">
                    {labProduct.benefits[0]}
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-[#2D2422] uppercase tracking-wider text-[10px] mb-1">
                    Efecto Sensorial
                  </h5>
                  <p className="text-[#2D2422]/70 italic">
                    Acabado segunda piel ultraligero sin sobrecargar poros orgánicos.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Store / Searchable Grid Catalog */}
      <section id="productos" className="py-20 bg-[#FAF7F2]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title & subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[#D48C70] text-xs font-bold uppercase tracking-widest block mb-2">
                Exclusividad J&M Glow
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#2D2422]">
                La Colección de Alta Cosmética J & M
              </h2>
            </div>
            
            {/* Quick search input overlay */}
            <div className="w-full md:max-w-xs relative">
              <input 
                type="text"
                placeholder="Buscar lápiz labial, sérum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D48C70]/20 text-[#2D2422] placeholder:text-[#2D2422]/40 rounded-full px-5 py-3 text-xs focus:outline-none focus:border-[#D48C70] focus:ring-1 focus:ring-[#D48C70] text-left transition-all" 
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D2422]/60 hover:text-[#D48C70] text-base font-bold"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2.5 border-b border-[#D48C70]/10 pb-5 mb-10">
            {[
              { id: 'todos', label: 'Todos los Cosméticos' },
              { id: 'rostro', label: 'Rostro (Bases)' },
              { id: 'labios', label: 'Labios (Nudes)' },
              { id: 'ojos', label: 'Ojos (Sombras)' },
              { id: 'brillo', label: 'Brillos (Destacados)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#D48C70] text-white shadow-md'
                    : 'bg-[#FAF7F2] text-[#2D2422]/60 hover:bg-[#EEDCD0]/30 hover:text-[#2D2422]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Store Catalog Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <Smartphone className="w-12 h-12 text-[#D48C70]/40 mx-auto mb-4" />
              <p className="font-semibold text-[#2D2422]">No encontramos cosméticos con ese filtro.</p>
              <p className="text-xs text-[#2D2422]/60 mt-2">Prueba eliminando tu búsqueda o filtrando otra sección.</p>
              <button 
                onClick={() => { setSelectedCategory('todos'); setSearchQuery(''); }}
                className="bg-[#2D2422] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider px-6 py-3 mt-5 rounded-full hover:bg-[#D48C70] hover:text-white transition-all shadow"
              >
                Restaurar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  handleAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Skin Diagnostics Glow Quiz (Interactive Diagnostic Diagnostic) */}
      <section id="diagnostico" className="py-20 bg-[#FAF7F2] border-y border-[#D48C70]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/65 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-glow-lg border border-[#D48C70]/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D48C70]/20 to-transparent pointer-events-none rounded-bl-full" />
            
            {/* Header Quiz details */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#D48C70] uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 animate-spin text-[#D48C70]" />
              <span>Glow Diagnostics Matcher</span>
            </div>

            {/* Quiz Flow control */}
            {quizStep === 0 && (
              <div className="text-left space-y-6 animate-fade-in">
                <h3 className="font-serif text-3xl font-semibold tracking-tight text-[#2D2422]">
                  ¿No sabes qué cosmético J&M va con tu tipo de piel?
                </h3>
                <p className="text-sm text-[#2D2422]/70 leading-relaxed">
                  Responde un breve test interactivo de 3 preguntas de diagnóstico. Nuestro sistema calculará la combinación y la textura ideal para tu rostro, empaquetándola en un kit especial con un **15% de descuento directo en tu carrito**.
                </p>
                <div className="border-t border-[#D48C70]/10 pt-6 flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    onClick={() => setQuizStep(1)}
                    className="w-full sm:w-auto bg-[#D48C70] text-white text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#2D2422] transition-all shadow-md cursor-pointer"
                  >
                    Comenzar Test de Brillo
                  </button>
                  <span className="text-xs text-[#2D2422]/40 italic font-medium">Duración estimada: menos de 1 minuto</span>
                </div>
              </div>
            )}

            {quizStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#2D2422]/50 uppercase tracking-widest mb-4">
                  <span>Pregunta 1 de 3</span>
                  <span>33% Completado</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#2D2422]">
                  ¿Cómo describirías el comportamiento de tu piel durante el día?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'normal', title: 'Normal a Seca', desc: 'Se siente tirante, se descama o necesita hidratación constante.' },
                    { id: 'grasa', title: 'Mixta a Grasa', desc: 'Suele tener brillos indeseados en la zona T y poros dilatados.' },
                    { id: 'sensible', title: 'Sensible / Reactiva', desc: 'Se enrojece con facilidad, picor o reacción a perfumes.' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setQuizAnswers({ ...quizAnswers, skinType: option.id });
                        setQuizStep(2);
                      }}
                      className="p-5 rounded-2xl border text-left bg-white/70 border-[#D48C70]/10 hover:border-[#D48C70] hover:bg-[#FAF7F2] transition-all group flex flex-col justify-between"
                    >
                      <span className="font-bold text-sm text-[#2D2422] mb-1 group-hover:text-[#D48C70] transition-colors">{option.title}</span>
                      <span className="text-xs text-[#2D2422]/60 leading-relaxed font-semibold">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#2D2422]/50 uppercase tracking-widest mb-4">
                  <span>Pregunta 2 de 3</span>
                  <span>66% Completado</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#2D2422]">
                  Mírate las venas de tu muñeca bajo la luz natural ¿Qué color predomina?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'warm', title: 'Subtono Cálido', desc: 'Venas verdes/olivas. Te favorecen las joyas doradas y ropa beige.', sample: 'bg-gradient-to-r from-[#DFD0BC] to-[#C9B9A3]' },
                    { id: 'cool', title: 'Subtono Frío', desc: 'Venas azules/violeta. Te favorecen las joyas plateadas y tonos rosas.', sample: 'bg-gradient-to-r from-[#ECDCD0] to-[#E9CAD1]' },
                    { id: 'neutral', title: 'Subtono Neutro', desc: 'Dificultad para distinguir, venas mixtas. Te queda bien todo.', sample: 'bg-gradient-to-r from-[#EACBB4] to-[#ECD5CC]' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setQuizAnswers({ ...quizAnswers, undertone: option.id });
                        setQuizStep(3);
                      }}
                      className="p-5 rounded-2xl border text-left bg-white/70 border-[#D48C70]/10 hover:border-[#D48C70] hover:bg-[#FAF7F2] transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-[#2D2422] group-hover:text-[#D48C70] transition-colors">{option.title}</span>
                          <span className={`w-4 h-4 rounded-full border border-gray-100/50 ${option.sample}`} />
                        </div>
                        <span className="text-xs text-[#2D2422]/60 leading-relaxed font-semibold">{option.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setQuizStep(1)} className="text-xs text-[#D48C70] hover:text-[#2D2422] font-semibold underline mt-2 block">Volver al paso anterior</button>
              </div>
            )}

            {quizStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#2D2422]/50 uppercase tracking-widest mb-4">
                  <span>Pregunta 3 de 3</span>
                  <span>99% Completado</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#2D2422]">
                  ¿Qué acabado de maquillaje o efecto primario te gustaría lograr hoy?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'satinado', title: 'Satinado Clásico', desc: 'Un glow sutil y sofisticado ideal para el día a día en oficina.' },
                    { id: 'luminoso', title: 'Luminoso Jugoso', desc: 'Brillo efecto húmedo de alta gama, juvenil y jugoso.' },
                    { id: 'celestial', title: 'Bronceado/Dorado', desc: 'Efecto de calidez soleada, ideal para tardes doradas o eventos de noche.' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setQuizAnswers({ ...quizAnswers, finishPreference: option.id });
                        handleQuizSubmit();
                      }}
                      className="p-5 rounded-2xl border text-left bg-white/70 border-[#D48C70]/10 hover:border-[#D48C70] hover:bg-[#FAF7F2] transition-all group flex flex-col justify-between hover:scale-101 duration-200"
                    >
                      <span className="font-bold text-sm text-[#2D2422] mb-1 group-hover:text-[#D48C70] transition-colors">{option.title}</span>
                      <span className="text-xs text-[#2D2422]/60 leading-relaxed font-semibold">{option.desc}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setQuizStep(2)} className="text-xs text-[#D48C70] hover:text-[#2D2422] font-semibold underline mt-2 block">Volver al paso anterior</button>
              </div>
            )}

            {quizStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#D48C70]/20 flex flex-col sm:flex-row gap-5 items-center">
                  <div className="p-3 bg-white rounded-full text-[#D48C70] shrink-0 shadow-sm border border-[#D48C70]/10">
                    <Sparkles className="w-8 h-8 animate-bounce text-[#D48C70]" />
                  </div>
                  <div>
                    <h4 className="font-serif italic font-bold text-[#2D2422] text-lg">¡Diagnóstico Completado!</h4>
                    <p className="text-xs text-[#2D2422]/70 mt-1 leading-relaxed">
                      Según tu piel de tipo <span className="font-bold text-[#2D2422]">{quizAnswers.skinType === 'grasa' ? 'Mixta/Grasa' : quizAnswers.skinType === 'sensible' ? 'Sensible' : 'Normal/Seca'}</span>, con subtono <span className="font-bold text-[#2D2422]">{quizAnswers.undertone === 'cool' ? 'Frío' : quizAnswers.undertone === 'warm' ? 'Cálido' : 'Neutro'}</span> y tu preferencia por el efecto <span className="font-bold text-[#2D2422]">{quizAnswers.finishPreference}</span>, hemos formulado este kit idóneo con alta compatibilidad cosmética y un <strong className="text-[#D48C70]">15% de descuento especial</strong>:
                    </p>
                  </div>
                </div>

                {/* Bundle list visualizers */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase text-[#2D2422]/60 block tracking-widest">
                    Productos del Kit Sugerido:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedBundle.map((prod) => (
                      <div key={prod.id} className="flex gap-3 bg-white/70 p-3.5 rounded-2xl border border-[#D48C70]/10 items-center">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-xl bg-[#FAF7F2]" 
                        />
                        <div>
                          <h5 className="font-serif italic font-bold text-xs text-[#2D2422]">{prod.name}</h5>
                          <span className="text-[11px] text-[#2D2422]/60 font-semibold">{prod.volume} • Tono recomendado {prod.shades[0].name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-bold text-[#2D2422]">${prod.price.toFixed(2)}</span>
                            <span className="text-[10px] text-gray-400 line-through">${(prod.price * 1.15).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price summary & checkout click */}
                <div className="bg-[#FAF7F2]/40 border-t border-[#D48C70]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[11px] text-[#2D2422]/60 block font-semibold">Precio Kit Completo (15% Desc. Aplicado)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold font-serif text-[#2D2422]">${dynamicBundlePrice.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">${rawBundlePrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setQuizStep(0);
                        setQuizAnswers({ skinType: 'normal', undertone: 'neutral', finishPreference: 'satinado' });
                      }}
                      className="px-5 py-3 border border-[#D48C70]/20 text-xs font-bold text-[#2D2422]/70 hover:bg-[#FAF7F2] rounded-full transition-all shrink-0 cursor-pointer"
                    >
                      Repetir Test
                    </button>
                    <button
                      onClick={() => {
                        // Prepare the bundle to add with discount
                        const itemsToAdd = recommendedBundle.map(p => ({
                          product: p,
                          shadeValue: p.shades[0].value
                        }));
                        handleAddMultipleToCart(itemsToAdd, 0.85); // 15% discount applied
                        setQuizStep(0); // reset quiz
                      }}
                      className="w-full sm:w-auto bg-[#D48C70] hover:bg-[#2D2422] text-[#FAF7F2] hover:text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Agregar Kit al Carrito
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 7. Routine Builder Checklist (Sleeve Ritual) */}
      <section id="rutinas" className="py-20 bg-[#FAF7F2]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Display Visual Box of active steps */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[#D48C70] text-xs font-bold uppercase tracking-widest block">
                Crea tu Ritual Glow Diario
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#2D2422]">
                Diseña tu combinación de brillo ideal
              </h2>
              <p className="text-sm text-[#2D2422]/70 leading-relaxed">
                El secreto de un cutis radiante radica en la armoniosa combinación de capas. Selecciona o desmarca los pasos que deseas incorporar de J&M Glow Cosmetics hoy y mira el costo total calculado abajo de forma transparente:
              </p>

              {/* Routine checklist cards */}
              <div className="space-y-3.5">
                {[
                  {
                    id: 'prod-01',
                    stepNum: '01',
                    actionLabel: 'Preparar la Piel',
                    title: 'Serum Glow Booster',
                    text: 'Aporta hidratación activa y una base satinada suave antes del color.',
                    price: 36.00
                  },
                  {
                    id: 'prod-03',
                    stepNum: '02',
                    actionLabel: 'Iluminar Zonas Clave',
                    title: 'Polvo Celestial Shimmer',
                    text: 'Resalta pómulos, arco de cupido y lagrimales con luz tridimensional.',
                    price: 32.00
                  },
                  {
                    id: 'prod-04',
                    stepNum: '03',
                    actionLabel: 'Profundizar Mirada',
                    title: 'Paleta Dreamy Nudes',
                    text: 'Definición elegante para tus ojos con mates y champaña mate.',
                    price: 48.00
                  },
                  {
                    id: 'prod-02',
                    stepNum: '04',
                    actionLabel: 'Nutrir y Enmarcar',
                    title: 'Labial Silk Rose',
                    text: 'Cierre de oro sedoso con hidratación para tus labios.',
                    price: 24.50
                  }
                ].map((step) => {
                  const isChecked = activeRoutineSteps.includes(step.id);
                  return (
                    <div 
                      key={step.id}
                      onClick={() => {
                        if (isChecked) {
                          setActiveRoutineSteps(activeRoutineSteps.filter(id => id !== step.id));
                        } else {
                          setActiveRoutineSteps([...activeRoutineSteps, step.id]);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-4 duration-200 ${
                        isChecked 
                          ? 'border-[#D48C70] bg-[#FAF7F2] shadow-glow-sm' 
                          : 'border-[#D48C70]/10 bg-white/50 hover:border-[#D48C70]/40'
                      }`}
                    >
                      <div className="pt-0.5">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-[#D48C70] border-[#D48C70] text-[#FAF7F2]' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-[#D48C70] uppercase font-bold tracking-wider">
                            Paso {step.stepNum} • {step.actionLabel}
                          </span>
                          <span className="text-xs font-bold font-mono text-[#2D2422]">${step.price.toFixed(2)}</span>
                        </div>
                        <h4 className="font-serif italic font-bold text-sm text-[#2D2422] mt-0.5">{step.title}</h4>
                        <p className="text-[11px] text-[#2D2422]/60 leading-relaxed mt-1 font-semibold">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calculations & quick actions card */}
            <div className="lg:col-span-6 bg-white/70 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-[#D48C70]/10 flex flex-col justify-between shadow-glow-sm">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D48C70] block mb-2">
                  Ritual de Belleza J&M
                </span>
                <h3 className="font-serif italic font-semibold text-xl text-[#2D2422] mb-4">
                  Resumen de tu Rutina Personalizada
                </h3>
                <p className="text-xs text-[#2D2422]/70 leading-relaxed mb-6 font-semibold">
                  Hemos resumido los productos que has integrado para tu ritual de mañana o tarde. Obtén excelentes resultados usando este orden recomendado de aplicación.
                </p>

                {/* List selected products on routine summary */}
                <div className="space-y-3 bg-white/80 p-4 rounded-2xl border border-[#D48C70]/10 mb-6">
                  {activeRoutineSteps.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#2D2422]/50 font-semibold">
                      Selecciona al menos un paso de la izquierda para comenzar a modelar.
                    </div>
                  ) : (
                    activeRoutineSteps.map((id) => {
                      const prod = getProductById(id);
                      if (!prod) return null;
                      return (
                        <div key={id} className="flex justify-between items-center text-xs border-b border-[#FAF7F2] pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D48C70]" />
                            <span className="text-[#2D2422] font-semibold">{prod.name}</span>
                          </div>
                          <span className="font-mono text-[#2D2422]/60 font-semibold">${prod.price.toFixed(2)}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Subtotal row */}
                <div className="border-t border-[#D48C70]/10 pt-4 mb-8">
                  <div className="flex justify-between items-center text-xs uppercase font-bold tracking-wider mb-2">
                    <span className="text-[#2D2422]/40">Productos en Rutina</span>
                    <span className="text-[#2D2422]">{activeRoutineSteps.length} items</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-[#2D2422]/60 font-semibold">Inversión Estimada:</span>
                    <span className="text-3xl font-serif italic font-bold text-[#2D2422] tracking-tight">
                      ${activeRoutineSteps.reduce((sum, id) => sum + (getProductById(id)?.price || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add routine action button */}
              <button
                onClick={() => {
                  if (activeRoutineSteps.length === 0) return;
                  const itemSpecs = activeRoutineSteps.map((id) => {
                    const p = getProductById(id)!;
                    return { product: p, shadeValue: p.shades[0].value };
                  });
                  handleAddMultipleToCart(itemSpecs, 1.0); // Full price matching
                }}
                disabled={activeRoutineSteps.length === 0}
                className="w-full bg-[#2D2422] hover:bg-[#D48C70] disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar los {activeRoutineSteps.length} Pasos al Carrito
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section id="testimonios" className="py-20 bg-[#FAF7F2] border-t border-[#D48C70]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Interactive review submission */}
            <div className="lg:col-span-4 bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-glow-sm border border-[#D48C70]/10">
              <span className="text-[#D48C70] text-xs font-bold uppercase tracking-widest block mb-1">
                La Comunidad Glow
              </span>
              <h3 className="font-serif italic font-semibold text-xl text-[#2D2422] mb-4">
                Comparte tu experiencia
              </h3>
              <p className="text-xs text-[#2D2422]/70 leading-relaxed mb-6 font-semibold">
                Ayuda a otros a descubrir el brillo ideal. Deja tu comentario y valoración del maquillaje de J & M Glow Cosmetics.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2422]/50 mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Sofía Medina"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full bg-[#FAF7F2]/60 border border-[#D48C70]/20 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#D48C70] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2422]/50 mb-1">
                    Valoración estrella *
                  </label>
                  <div className="flex gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setNewReview({ ...newReview, rating: starValue })}
                        className="text-[#D48C70] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${newReview.rating >= starValue ? 'fill-[#D48C70]' : 'stroke-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2422]/50 mb-1">
                    Reseña escrita *
                  </label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe las sensaciones de J&M Glow en tu piel..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-[#FAF7F2]/60 border border-[#D48C70]/20 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#D48C70] transition-colors h-20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2D2422] hover:bg-[#D48C70] text-[#FAF7F2] hover:text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all gap-1 cursor-pointer flex justify-center items-center"
                >
                  Publicar Reseña
                </button>
              </form>

              {reviewSubmitted && (
                <div className="mt-4 p-3 bg-[#FAF7F2] border border-[#D48C70]/20 text-[#D48C70] text-xs rounded-xl text-center font-bold">
                  ¡Gracias por tu reseña! Ha sido añadida a la comunidad en vivo.
                </div>
              )}
            </div>

            {/* Testimonials live vertical list block */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-[#D48C70] text-xs font-mono uppercase tracking-widest block font-bold">
                  Glow Reviews Hub
                </span>
                <h3 className="font-serif italic font-semibold text-2xl text-[#2D2422] mt-1">
                  Lo que dicen sobre J & M Glow Cosmetics
                </h3>
              </div>

              <div className="space-y-4">
                {testimonials.map((test) => (
                  <div key={test.id} className="bg-white/80 p-5 sm:p-6 rounded-3xl border border-[#D48C70]/10 hover:shadow-glow-sm transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#D48C70]/20 flex items-center justify-center font-mono font-bold text-[#D48C70] text-xs shrink-0 shadow-sm">
                          {test.avatarSeed}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#2D2422]">{test.name}</h4>
                          <span className="text-[10px] text-[#D48C70] font-bold uppercase tracking-wider bg-[#FAF7F2] px-1.5 py-0.2 rounded">
                            {test.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1 shrink-0">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${
                                i < test.rating ? 'stroke-[#D48C70] fill-[#D48C70]' : 'stroke-gray-200'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[9px] text-[#2D2422]/50 font-mono font-bold">{test.date}</span>
                      </div>

                    </div>
                    
                    <p className="text-xs text-[#2D2422]/80 leading-relaxed italic font-medium">
                      "{test.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. Contact Segment & Live Newsletter Sub */}
      <section id="contacto" className="py-20 bg-white border-t border-[#D48C70]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Information Block & Newsletter box */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 animate-fade-in">
              
              <div className="space-y-4">
                <span className="text-[#D48C70] text-xs font-bold uppercase tracking-widest block">
                  Atención Premium
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2422]">
                  ¿Tienes dudas sobre los tonos o envíos?
                </h3>
                <p className="text-xs text-[#2D2422]/70 leading-relaxed font-semibold">
                  Estamos aquí para guiarte en tu camino hacia una piel resplandeciente. Consúltanos o suscríbete para recibir un cupón de **10% de bienvenida en tu primera compra**.
                </p>

                <div className="space-y-3 pt-4 text-xs">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#D48C70] shrink-0" />
                    <span className="text-[#2D2422]/80 font-semibold">atencion@jmglowcosmetics.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#D48C70] shrink-0" />
                    <span className="text-[#2D2422]/80 font-semibold">+34 910 234 567 (L-V 9:00 - 18:00)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#D48C70] shrink-0" />
                    <span className="text-[#2D2422]/80 font-semibold">Calle de Serrano 45, Planta 2, Madrid, España</span>
                  </div>
                </div>
              </div>

              {/* Real Newsletter form */}
              <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#D48C70]/20">
                <h4 className="font-serif italic font-bold text-xs text-[#2D2422] mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D48C70]" />
                  Unete al Club J&M Glow
                </h4>
                <p className="text-[11px] text-[#2D2422]/70 mb-3 leading-relaxed font-semibold">
                  Entérate antes que nadie de lanzamientos exclusivos de iluminadores y colecciones de labiales nudes.
                </p>

                {newsletterOk ? (
                  <div className="p-3 bg-white border border-[#D48C70]/30 rounded-xl text-center text-xs font-bold text-[#D48C70]">
                    🎉 ¡Te has unido! Revisa tu bandeja de entrada para recibir tu cupón de 10%.
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Tu correo electrónico..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-white border border-[#D48C70]/20 text-xs rounded-xl px-3 py-2 flex-grow focus:outline-none focus:border-[#D48C70] transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (newsletterEmail.includes('@')) {
                          setNewsletterOk(true);
                          setNewsletterEmail('');
                        }
                      }}
                      className="bg-[#2D2422] hover:bg-[#D48C70] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
                    >
                      Unirse
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Custom Interactive Contact Form */}
            <div className="lg:col-span-7 bg-[#FAF7F2]/65 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#D48C70]/10 shadow-glow-sm">
              {contactFormSubmitted ? (
                <div className="h-full flex flex-col justify-center items-center text-center py-10 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-white border border-[#D48C70]/10 rounded-full flex items-center justify-center text-[#D48C70] shadow-sm animate-pulse">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif italic font-semibold text-lg text-[#2D2422]">
                    Mensaje Recibido de una Estrella ✨
                  </h4>
                  <p className="text-xs text-[#2D2422]/70 max-w-sm leading-relaxed font-semibold">
                    Muchas gracias por contactar con J & M Glow Cosmetics. Un personal shopper especializado se comunicará contigo vía email en menos de 24 horas hábiles.
                  </p>
                  <button
                    onClick={() => {
                      setContactFormSubmitted(false);
                      setContactMessage({ name: '', email: '', subject: '', text: '' });
                    }}
                    className="text-xs underline text-[#D48C70] hover:text-[#2D2422] font-bold cursor-pointer"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (contactMessage.name && contactMessage.email && contactMessage.text) {
                      setContactFormSubmitted(true);
                    }
                  }}
                  className="space-y-4 animate-fade-in"
                >
                  <h4 className="font-serif italic font-semibold text-xl text-[#2D2422]">
                    Escríbenos Directamente
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2422]/50 mb-1">
                        Tu Nombre *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Camila"
                        value={contactMessage.name}
                        onChange={(e) => setContactMessage({ ...contactMessage, name: e.target.value })}
                        className="w-full bg-white border border-[#D48C70]/15 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#D48C70] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2422]/50 mb-1">
                        Tu Correo Electrónico *
                      </label>
                      <input 
                        type="email" 
                        required
                        placeholder="Ej. cami@gmail.com"
                        value={contactMessage.email}
                        onChange={(e) => setContactMessage({ ...contactMessage, email: e.target.value })}
                        className="w-full bg-white border border-[#D48C70]/15 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#D48C70] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2422]/50 mb-1">
                      Asunto de Consulta
                    </label>
                    <select
                      value={contactMessage.subject}
                      onChange={(e) => setContactMessage({ ...contactMessage, subject: e.target.value })}
                      className="w-full bg-white border border-[#D48C70]/15 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#D48C70] transition-colors"
                    >
                      <option value="tonos">Ayuda con Selección de Tonos</option>
                      <option value="pedidos">Rastreo de Pedido o Envíos</option>
                      <option value="mayoristas">Compra Mayorista de Cosméticos</option>
                      <option value="otro">Otras consultas generales</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2422]/50 mb-1">
                      Mensaje completo o sugerencia *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="¿Deseas saber si el Serum es apto para piel sensible o requieres asistencia? Cuéntanos..."
                      value={contactMessage.text}
                      onChange={(e) => setContactMessage({ ...contactMessage, text: e.target.value })}
                      className="w-full bg-white border border-[#D48C70]/15 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#D48C70] transition-colors h-28 resize-none"
                    />
                  </div>

                  <p className="text-[10px] text-[#2D2422]/40 font-semibold">
                    * Campos obligatorios para agilizar tu respuesta experta.
                  </p>

                  <button
                    type="submit"
                    className="bg-[#2D2422] text-[#FAF7F2] hover:text-white text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#D48C70] transition-all cursor-pointer shadow-md"
                  >
                    Enviar Mensaje Seguro
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 10. Footer brand markup */}
      <footer id="brand-footer" className="bg-[#2D2422] text-[#FAF7F2]/70 pt-16 pb-8 border-t border-[#FAF7F2]/10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-1">
              <span className="font-serif text-xl tracking-wider font-semibold text-white">
                J & M <span className="text-[#D48C70] italic font-normal font-serif">Glow</span>
              </span>
              <p className="text-xs text-[#FAF7F2]/60 leading-relaxed font-semibold">
                Brindando texturas sensoriales premium, libres de crueldad animal, con los estándares más sofisticados de la cosmética europea moderna.
              </p>
              <div className="flex gap-3 text-white">
                <a href="#" className="p-2 border border-[#FAF7F2]/20 rounded-full hover:bg-[#D48C70] hover:text-[#2D2422] transition-colors duration-200">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 border border-[#FAF7F2]/20 rounded-full hover:bg-[#D48C70] hover:text-[#2D2422] transition-colors duration-200">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links A */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-white tracking-widest">Nuestra Tienda</h4>
              <ul className="text-xs space-y-2 text-[#FAF7F2]/50 font-semibold">
                <li><a href="#productos" className="hover:text-[#D48C70] hover:underline transition-colors">Serum Glow Booster</a></li>
                <li><a href="#productos" className="hover:text-[#D48C70] hover:underline transition-colors">Labial Silk Rose</a></li>
                <li><a href="#productos" className="hover:text-[#D48C70] hover:underline transition-colors">Polvo Celestial Shimmer</a></li>
                <li><a href="#productos" className="hover:text-[#D48C70] hover:underline transition-colors">Paleta Dreamy Nudes</a></li>
              </ul>
            </div>

            {/* Links B */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-white tracking-widest">Soporte Glow</h4>
              <ul className="text-xs space-y-2 text-[#FAF7F2]/50 font-semibold">
                <li><a href="#diagnostico" className="hover:text-[#D48C70] hover:underline transition-colors">Iniciar Glow Test</a></li>
                <li><a href="#probador" className="hover:text-[#D48C70] hover:underline transition-colors">Muestrario de Texturas</a></li>
                <li><a href="#contacto" className="hover:text-[#D48C70] hover:underline transition-colors">Envíos & Devoluciones</a></li>
                <li><a href="#rutinas" className="hover:text-[#D48C70] hover:underline transition-colors">Rutina Personalizada</a></li>
              </ul>
            </div>

            {/* Legal / Hours */}
            <div className="space-y-3 text-xs">
              <h4 className="text-xs font-bold uppercase text-white tracking-widest">Compromiso J&M</h4>
              <p className="text-[#FAF7F2]/60 leading-relaxed font-semibold">
                Todas nuestras fórmulas están dermatológicamente testadas, no son comedogénicas y respetan el manto lipídico natural protegiendo el pH facial.
              </p>
              <div className="flex items-center gap-2 text-[#D48C70]">
                <Award className="w-4 h-4 text-[#D48C70]" />
                <span className="font-semibold text-[10px] uppercase tracking-wider">Altos Estándares 2026</span>
              </div>
            </div>

          </div>

          <div className="border-t border-[#FAF7F2]/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#FAF7F2]/40 gap-4">
            <p>&copy; {new Date().getFullYear()} J & M Glow Cosmetics. Todos los derechos reservados. Diseñado para brillar.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacidad</a>
              <a href="#" className="hover:underline">Términos de servicio</a>
              <a href="#" className="hover:underline">Configurar Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. Shopping Cart Drawer / Panel Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[1100] overflow-hidden">
            
            {/* Backdrop filter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Sliding Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="absolute inset-y-0 right-0 max-w-full flex"
            >
              <div className="w-screen max-w-md bg-[#FAF7F2] flex flex-col shadow-glow-lg h-full">
                
                {/* Cart Header */}
                <div className="px-4 py-5 border-b border-[#D48C70]/10 sm:px-6 flex items-center justify-between bg-white bg-opacity-70 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D48C70]" />
                    <h3 className="font-serif italic font-semibold text-lg text-[#2D2422]">Tu Carrito Glow</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 px-1.5 text-gray-400 hover:text-[#D48C70] rounded-full hover:bg-[#D48C70]/15 duration-200 cursor-pointer"
                    aria-label="Cerrar coche"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main panel body */}
                {checkoutStep === 'cart' && (
                  <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                    
                    {/* List Items */}
                    <div className="px-4 py-4 sm:px-6 space-y-4 divide-y divide-[#D48C70]/10 flex-grow">
                      {cart.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-center space-y-3 py-10">
                          <ShoppingBag className="w-12 h-12 text-[#D48C70]/30 animate-bounce" />
                          <p className="text-sm font-bold text-[#2D2422]">Tu carrito de cosméticos está vacío.</p>
                          <p className="text-xs text-[#2D2422]/70 max-w-xs font-semibold">¡Agrega un labial Silk o el sérum iluminador para comenzar tu ritual radiantemente!</p>
                          <button
                            onClick={() => {
                              // Auto add first cosmetic as trial if they want
                              handleAddToCart(productsData[0], productsData[0].shades[0].value, 1);
                            }}
                            className="text-xs font-bold text-[#D48C70] hover:text-[#2D2422] underline cursor-pointer"
                          >
                            Agregar Serum Trial Gratis recomendación
                          </button>
                        </div>
                      ) : (
                        cart.map((item, index) => (
                          <div key={`${item.product.id}-${item.selectedShade}`} className="flex gap-4 pt-4 first:pt-0 items-center justify-between">
                            
                            {/* Product mini icon */}
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 object-cover rounded-2xl bg-white border border-[#D48C70]/10" 
                            />

                            {/* Center specifications Column */}
                            <div className="flex-grow space-y-1 select-none text-left">
                              <h4 className="font-serif italic font-bold text-xs text-[#2D2422]">{item.product.name}</h4>
                              <span className="text-[9px] text-[#D48C70] font-bold bg-white border border-[#D48C70]/15 px-2.5 py-0.5 rounded-full inline-block">
                                Tono: {item.selectedShade}
                              </span>
                              
                              {/* Quantity adjustment selectors */}
                              <div className="flex items-center gap-2 pt-1.5">
                                <button
                                  onClick={() => updateCartQty(index, -1)}
                                  className="w-5 h-5 rounded-full bg-white border border-[#D48C70]/10 flex items-center justify-center text-xs font-semibold hover:bg-[#FAF7F2] text-[#2D2422] cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQty(index, 1)}
                                  className="w-5 h-5 rounded-full bg-white border border-[#D48C70]/10 flex items-center justify-center text-xs font-semibold hover:bg-[#FAF7F2] text-[#2D2422] cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Right Pricing and action column */}
                            <div className="text-right flex flex-col justify-between h-16 shrink-0">
                              <span className="font-semibold text-xs text-[#2D2422]">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeCartItem(index)}
                                className="text-[#2D2422]/40 hover:text-[#D48C70] transition-colors duration-200 text-xs pt-2 flex justify-end cursor-pointer"
                                title="Eliminar cosmético"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer Totals Row */}
                    {cart.length > 0 && (
                      <div className="border-t border-[#D48C70]/10 bg-white bg-opacity-80 px-4 py-6 sm:px-6 space-y-4 shadow-inner">
                        <div className="space-y-1.5 text-xs text-[#2D2422]/70 font-semibold text-left">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-mono">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gastos de Envío</span>
                            <span className="font-mono font-bold">
                              {baseShippingCost === 0 ? (
                                <span className="text-[#D48C70] font-bold uppercase text-[10px]">Gratis</span>
                              ) : (
                                `$${baseShippingCost.toFixed(2)}`
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Impuestos Estimados (IVA 16%)</span>
                            <span className="font-mono">${estimatedTax.toFixed(2)}</span>
                          </div>
                          {subtotal < 60 && (
                            <p className="text-[10px] text-[#D48C70] italic font-bold">
                              * Añade ${(60 - subtotal).toFixed(2)} más en productos para obtener ENVÍO GRATIS.
                            </p>
                          )}
                        </div>

                        {/* Order Total */}
                        <div className="border-t border-[#D48C70]/10 pt-4 flex justify-between items-end">
                          <span className="text-xs font-bold text-[#2D2422] uppercase tracking-wide">Importe Total Seguro</span>
                          <span className="text-2xl font-bold font-serif text-[#D48C70]">
                            ${orderTotal.toFixed(2)}
                          </span>
                        </div>

                        <button 
                          onClick={() => setCheckoutStep('shipping')}
                          className="w-full bg-[#D48C70] hover:bg-[#2D2422] text-[#FAF7F2] hover:text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        >
                          Tramitar Pedido Seguro
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {checkoutStep === 'shipping' && (
                  <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-6 sm:px-6 space-y-6">
                    <div className="space-y-4">
                      
                      {/* Back button */}
                      <button 
                        onClick={() => setCheckoutStep('cart')}
                        className="text-xs underline text-[#D48C70] hover:text-[#2D2422] font-semibold text-left block"
                      >
                        &larr; Volver al Resumen del Carrito
                      </button>

                      <h4 className="font-serif italic font-semibold text-lg text-[#2D2422] text-left">
                        Datos de Despacho & Pago
                      </h4>
                      <p className="text-xs text-[#2D2422]/70 leading-relaxed text-left font-semibold">
                        Introduce tus datos de entrega en España o Latinoamérica. Brindamos soporte de pago contra entrega u online seguro.
                      </p>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (checkoutForm.name && checkoutForm.email && checkoutForm.address) {
                            setCheckoutStep('success');
                          }
                        }}
                        className="space-y-3.5 text-left"
                        id="checkout-form-wizard"
                      >
                        <div>
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-[#2D2422]/50 mb-1">
                            Nombre del Destinatario *
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Sofía Rodríguez"
                            value={checkoutForm.name}
                            onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                            className="w-full bg-white border border-[#D48C70]/20 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-[#D48C70] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-[#2D2422]/50 mb-1">
                            Tu Correo Electrónico *
                          </label>
                          <input 
                            type="email" 
                            required
                            placeholder="Ej. sofia.rod@gmail.com"
                            value={checkoutForm.email}
                            onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                            className="w-full bg-white border border-[#D48C70]/20 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-[#D48C70] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-[#2D2422]/50 mb-1">
                            Dirección completa de Entrega *
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Calle de Alcalá 120, Piso 3B, Madrid"
                            value={checkoutForm.address}
                            onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                            className="w-full bg-white border border-[#D48C70]/20 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-[#D48C70] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-[#2D2422]/50 mb-1">
                            Teléfono de contacto Móvil *
                          </label>
                          <input 
                            type="tel" 
                            required
                            placeholder="Ej. +34 612 345 678"
                            value={checkoutForm.phone}
                            onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                            className="w-full bg-white border border-[#D48C70]/20 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-[#D48C70] transition-colors"
                          />
                        </div>

                        {/* Pricing Recap Box */}
                        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D48C70]/25 text-xs space-y-1 select-none shadow-sm">
                          <div className="flex justify-between font-semibold text-[#2D2422]/60">
                            <span>Artículos</span>
                            <span className="font-mono text-[#2D2422]">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-sm border-t border-[#D48C70]/10 pt-1.5 mt-1.5">
                            <span className="text-[#2D2422]">Total a pagar</span>
                            <span className="text-[#D48C70] font-serif">${orderTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#D48C70] hover:bg-[#2D2422] text-[#FAF7F2] hover:text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 shadow-md mt-4 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Confirmar Compra — ${orderTotal.toFixed(2)}
                        </button>
                      </form>

                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="flex-grow flex flex-col justify-center items-center text-center px-6 py-10 space-y-6">
                    <div className="w-20 h-20 bg-white border border-[#D48C70]/20 rounded-full flex items-center justify-center text-[#D48C70] shadow-md animate-bounce">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-serif italic font-bold text-xl text-[#2D2422]">
                        ¡Tu pedido brilla en camino!
                      </h4>
                      <p className="text-xs text-[#2D2422]/70 font-semibold leading-relaxed">
                        Súper, <strong className="text-[#2D2422]">{checkoutForm.name || 'Estrella Gourmet'}</strong>. Recibirás una confirmación en tu correo de contacto de inmediato.
                      </p>
                    </div>

                    {/* Mimic Receipt */}
                    <div className="w-full bg-white/80 rounded-2xl p-5 border border-[#D48C70]/10 text-left text-xs space-y-2 font-mono shadow-sm">
                      <div className="text-[10px] text-gray-400 border-b border-dashed pb-2 mb-2 font-sans font-semibold uppercase flex justify-between select-none">
                        <span>Código Factura</span>
                        <span>#{(Date.now() % 1000000)}</span>
                      </div>
                      <p className="truncate"><span className="font-bold font-sans uppercase text-[9px] text-[#2D2422]/40 block select-none">Dirección de despacho</span>{checkoutForm.address}</p>
                      <p className="truncate"><span className="font-bold font-sans uppercase text-[9px] text-[#2D2422]/40 block select-none">Contacto móvil</span>{checkoutForm.phone}</p>
                      <div className="border-t border-dashed pt-2.5 mt-2 flex justify-between font-bold font-sans text-xs select-none">
                        <span>Total de Compra</span>
                        <span className="text-[#D48C70] font-mono">${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCart([]); // Clear shopping session
                        setIsCartOpen(false); // Close
                        setCheckoutStep('cart'); // Restore
                        setCheckoutForm({ name: '', email: '', address: '', phone: '' });
                      }}
                      className="w-full bg-[#D48C70] hover:bg-[#2D2422] text-[#FAF7F2] hover:text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer"
                    >
                      Continuar Navegando
                    </button>
                  </div>
                )}

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
