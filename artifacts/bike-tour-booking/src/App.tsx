import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowRight,
  Bike,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  MapPin,
  Maximize2,
  Menu,
  Mountain,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

export interface Tour {
  id: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  durationHours: string;
  distanceKm: string;
  difficulty: 'Moderado' | 'Intermedio' | 'Desafiante';
  priceUSD: number;
  maxCapacity: number;
  availableSeats: number;
  image: string;
  category: string;
  badge?: string;
  rating: string;
  reviews: number;
}

const TOURS: Tour[] = [
  {
    id: 'maras-salt-mines',
    name: 'Maras y las salineras',
    tagline: 'Una ruta entre sal, montaña e historia',
    description:
      'Descubre las salineras de Maras y los caminos panorámicos del Valle Sagrado a un ritmo cómodo, acompañado por nuestro equipo local.',
    city: 'Maras, Cusco',
    durationHours: '5',
    distanceKm: '28',
    difficulty: 'Intermedio',
    priceUSD: 119,
    maxCapacity: 8,
    availableSeats: 8,
    image: '/assets/aistudio/IMG_20261010_135534236_HDR_02ca2d6b.jpg',
    category: 'Salineras',
    badge: 'Favorito local',
    rating: '4,98',
    reviews: 142,
  },
  {
    id: 'pisac-terraces',
    name: 'Terrazas de Pisac',
    tagline: 'Senderos ancestrales y vistas infinitas',
    description:
      'Pedalea entre andenes incas y pueblos andinos con un guía local. Incluye bicicleta, casco y transporte desde el Valle.',
    city: 'Pisac, Cusco',
    durationHours: '4.5',
    distanceKm: '22',
    difficulty: 'Moderado',
    priceUSD: 89,
    maxCapacity: 8,
    availableSeats: 8,
    image: '/assets/aistudio/IMG_20261012_161823591_HDR_d112481d.jpg',
    category: 'Andenes',
    badge: 'Más popular',
    rating: '4,95',
    reviews: 198,
  },
  {
    id: 'sacred-valley-day',
    name: 'El gran Valle Sagrado',
    tagline: 'Un día completo para perderse y encontrarse',
    description:
      'Conecta Urubamba, campos de cultivo y comunidades locales en una travesía completa con almuerzo campestre, bicicleta y guía bilingüe.',
    city: 'Urubamba, Cusco',
    durationHours: '7',
    distanceKm: '42',
    difficulty: 'Desafiante',
    priceUSD: 159,
    maxCapacity: 6,
    availableSeats: 6,
    image: '/assets/aistudio/IMG_20261011_130604499_HDR_9b9f92a9.jpg',
    category: 'Montaña',
    badge: 'Jornada completa',
    rating: '4,99',
    reviews: 87,
  },
];

const CATEGORIES = ['Todos', 'Salineras', 'Andenes', 'Montaña'];

export interface GalleryPhoto {
  id: string;
  title: string;
  location: string;
  category: 'Rutas & Montaña' | 'Río & Puentes' | 'Compañerismo' | 'Patrimonio';
  src: string;
  description: string;
  altitude?: string;
}

const GALLERY_CATEGORIES = [
  'Todas',
  'Rutas & Montaña',
  'Río & Puentes',
  'Compañerismo',
  'Patrimonio',
] as const;

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-vilcanota-bridge',
    title: 'Puente ferroviario sobre el río Vilcanota',
    location: 'Valle Sagrado · Urubamba',
    category: 'Río & Puentes',
    src: '/assets/aistudio/IMG_20261011_130604499_HDR_9b9f92a9.jpg',
    altitude: '2,870 msnm',
    description:
      'Pedaleando sobre las vías y el puente histórico con el rugir del río sagrado bajo las ruedas y los eucaliptos del valle.',
  },
  {
    id: 'photo-andean-trail-sun',
    title: 'Senderos de puna y cielos andinos',
    location: 'Abra de Maras · Valle Sagrado',
    category: 'Rutas & Montaña',
    src: '/assets/aistudio/IMG_20261010_135534236_HDR_02ca2d6b.jpg',
    altitude: '3,380 msnm',
    description:
      'Rayos de sol filtrándose entre las nubes en las alturas del valle, acompañados de cabañas rústicas de piedra y senderos abiertos.',
  },
  {
    id: 'photo-trail-riders',
    title: 'Ciclistas en el Valle Sagrado',
    location: 'Senderos de Pisac y Maras',
    category: 'Compañerismo',
    src: '/assets/aistudio/IMG_20261012_161823591_HDR_d112481d.jpg',
    altitude: '3,100 msnm',
    description:
      'Descenso fluido por acantilados y curvas panorámicas con vistas completas hacia la cordillera de Urubamba.',
  },
  {
    id: 'photo-urubamba-traverse',
    title: 'Travesía completa por Urubamba',
    location: 'Urubamba · Río Sagrado',
    category: 'Rutas & Montaña',
    src: '/assets/aistudio/IMG_20261011_130604499_HDR_9b9f92a9.jpg',
    altitude: '2,870 msnm',
    description:
      'Caminos ribereños y cruces ferroviarios entre la frondosa vegetación del río Vilcanota.',
  },
  {
    id: 'photo-maras-highlands',
    title: 'Caminos altos hacia Maras',
    location: 'Maras · Valle Sagrado',
    category: 'Patrimonio',
    src: '/assets/aistudio/IMG_20261010_135534236_HDR_02ca2d6b.jpg',
    altitude: '3,380 msnm',
    description:
      'La inmensidad del cielo cusqueño y la arquitectura rústica tradicional en las rutas de montaña.',
  },
  {
    id: 'photo-sacred-riders-panoramic',
    title: 'Aventura compartida sobre dos ruedas',
    location: 'Valle Sagrado de los Incas',
    category: 'Compañerismo',
    src: '/assets/aistudio/IMG_20261012_161823591_HDR_d112481d.jpg',
    altitude: '3,100 msnm',
    description:
      'Explorando senderos fuera de las rutas comerciales con guías locales nativos.',
  },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [galleryCategory, setGalleryCategory] = useState<string>('Todas');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string>('maras-salt-mines');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [riders, setRiders] = useState<number>(2);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [bookingDone, setBookingDone] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');
  const [searched, setSearched] = useState(false);

  const selectedTour = useMemo(
    () => TOURS.find((t) => t.id === selectedTourId) || TOURS[0],
    [selectedTourId],
  );

  const shownTours = useMemo(() => {
    return TOURS.filter((tour) => {
      const categoryMatch =
        activeCategory === 'Todos' || tour.category === activeCategory;
      const cityMatch =
        !searched ||
        !searchDestination ||
        tour.city.toLowerCase().includes(searchDestination.toLowerCase()) ||
        tour.name.toLowerCase().includes(searchDestination.toLowerCase());
      return categoryMatch && cityMatch;
    });
  }, [activeCategory, searchDestination, searched]);

  const filteredPhotos = useMemo(() => {
    if (galleryCategory === 'Todas') return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.filter((p) => p.category === galleryCategory);
  }, [galleryCategory]);

  useEffect(() => {
    if (!activePhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhoto(null);
      if (e.key === 'ArrowLeft') {
        const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
        const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        setActivePhoto(filteredPhotos[prevIndex]);
      }
      if (e.key === 'ArrowRight') {
        const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
        const nextIndex = (currentIndex + 1) % filteredPhotos.length;
        setActivePhoto(filteredPhotos[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, filteredPhotos]);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectTourForBooking = (tourId: string) => {
    setSelectedTourId(tourId);
    setBookingDone(false);
    document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setBookingDone(true);
  };

  const resetSearch = () => {
    setSearchDestination('');
    setSearched(false);
    setActiveCategory('Todos');
  };

  return (
    <div className="site-shell">
      {/* Top announcement bar */}
      <div className="announcement">
        <span className="announcement-dot" /> Aventura local · Cusco, Perú{' '}
        <span className="announcement-divider">·</span>{' '}
        <a href="#experiencias">
          Historias andinas a tu ritmo <ArrowRight size={13} />
        </a>
      </div>

      {/* Header navigation */}
      <header className="nav-wrap">
        <a className="brand" href="#inicio" aria-label="Andes sobre ruedas, inicio">
          <span className="brand-mark">
            <Bike size={21} strokeWidth={2.1} />
          </span>
          <span>
            andes<span className="brand-light">sobre ruedas</span>
            <i>.</i>
          </span>
        </a>

        <nav className={mobileOpen ? 'main-nav nav-open' : 'main-nav'}>
          <a href="#experiencias" onClick={() => setMobileOpen(false)}>
            Experiencias
          </a>
          <a href="#galeria" onClick={() => setMobileOpen(false)}>
            Galería
          </a>
          <a href="#reservar" onClick={() => setMobileOpen(false)}>
            Reservar
          </a>
          <a href="#nosotros" onClick={() => setMobileOpen(false)}>
            Nuestra forma
          </a>
          <a href="#preguntas" onClick={() => setMobileOpen(false)}>
            Preguntas
          </a>
        </nav>

        <div className="nav-actions">
          <a className="nav-login" href="#nosotros">
            Guías locales
          </a>
          <a className="nav-cta" href="#reservar">
            Encuentra tu ruta <ArrowRight size={15} />
          </a>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="eyebrow-line" /> AVENTURA LOCAL · CUSCO, PERÚ
            </div>
            <h1>
              El Valle Sagrado,
              <br />
              <em>a tu propio ritmo.</em>
            </h1>
            <p className="hero-lede">
              Menos mapas. Más momentos que no salen en la guía.
            </p>
            <p className="hero-description">
              Pedalea por caminos que cuentan historias. Guiados por gente de
              aquí, para descubrir mucho más que el paisaje andino.
            </p>

            <div className="hero-trust">
              <span>
                <Check size={14} /> Grupos pequeños (máx. 8)
              </span>
              <span>
                <Check size={14} /> Guías locales certificados
              </span>
            </div>

            <div className="hero-proof">
              <div className="avatar-stack">
                <span>VS</span>
                <span>MA</span>
                <span>PI</span>
                <span>+</span>
              </div>
              <div>
                <strong>4,97 de 5</strong>
                <span className="proof-stars">★★★★★</span>
                <small>de viajeros que ya salieron a pedalear los Andes</small>
              </div>
            </div>

            <div style={{ marginTop: '28px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <a href="#experiencias" className="button button-green">
                Explorar tours <ArrowRight size={14} />
              </a>
              <a href="#reservar" className="button button-light">
                Reservar plaza
              </a>
            </div>

            <a href="#experiencias" className="scroll-cue">
              EXPLORAR EL VALLE <ArrowDown size={14} />
            </a>
          </div>

          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src="/assets/aistudio/IMG_20261012_161823591_HDR_d112481d.jpg"
              alt="Ciclistas en el Valle Sagrado"
              fetchPriority="high"
            />
            <div className="image-shade" />
            <div className="hero-image-caption">
              <span className="caption-pin">
                <MapPin size={14} />
              </span>
              <div>
                <strong>Valle Sagrado, Cusco</strong>
                <small>13°18' S · 72°06' O · Perú</small>
              </div>
              <span className="caption-index">01 / 03</span>
            </div>
            <div className="floating-note">
              <span className="note-icon">
                <Compass size={18} />
              </span>
              <div>
                <strong>Sin prisa, sin perderte</strong>
                <small>Bicicletas Pro & Cascos incluidos</small>
              </div>
            </div>
            <div className="hero-stamp">
              ANDES<br />EN<br />BICI
            </div>
          </div>
        </section>

        {/* Value Strip */}
        <div className="value-strip" aria-label="Ventajas de nuestros tours">
          <div>
            <span className="value-icon">
              <Mountain size={18} />
            </span>
            <span>
              <strong>Rutas con sentido</strong>
              <small>Fuera del camino turístico tradicional</small>
            </span>
          </div>
          <div>
            <span className="value-icon">
              <Users size={18} />
            </span>
            <span>
              <strong>Máximo 8 ciclistas</strong>
              <small>Más cerca, más auténtico y personalizado</small>
            </span>
          </div>
          <div>
            <span className="value-icon">
              <ShieldCheck size={18} />
            </span>
            <span>
              <strong>Reserva sencilla</strong>
              <small>Pago seguro con Stripe y confirmación</small>
            </span>
          </div>
        </div>

        {/* Quick Search */}
        <section className="search-section" id="busqueda">
          <div className="search-heading">
            <span>01 — ELIGE TU RUTA ANDINA</span>
            <p>¿Qué rincón del Valle quieres pedalear?</p>
          </div>
          <form
            className="search-panel"
            onSubmit={(event) => {
              event.preventDefault();
              setSearched(true);
              document
                .getElementById('experiencias')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <label className="search-field destination-field">
              <span className="field-icon">
                <MapPin size={19} />
              </span>
              <span className="field-content">
                <small>DESTINO ANDINO</small>
                <select
                  value={searchDestination}
                  onChange={(event) => setSearchDestination(event.target.value)}
                  aria-label="Elige un destino andino"
                >
                  <option value="">Todos los destinos del Valle</option>
                  <option value="Maras">Maras y las salineras</option>
                  <option value="Pisac">Terrazas de Pisac</option>
                  <option value="Urubamba">El gran Valle Sagrado (Urubamba)</option>
                </select>
              </span>
              <ChevronDown className="select-chevron" size={15} />
            </label>

            <label className="search-field">
              <span className="field-icon">
                <CalendarDays size={18} />
              </span>
              <span className="field-content">
                <small>FECHA</small>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  aria-label="Fecha del tour"
                />
              </span>
            </label>

            <label className="search-field">
              <span className="field-icon">
                <Users size={19} />
              </span>
              <span className="field-content">
                <small>CICLISTAS</small>
                <select
                  value={riders}
                  onChange={(event) => setRiders(Number(event.target.value))}
                  aria-label="Número de ciclistas"
                >
                  <option value={1}>1 ciclista</option>
                  <option value={2}>2 ciclistas</option>
                  <option value={3}>3 ciclistas</option>
                  <option value={4}>4 ciclistas</option>
                  <option value={6}>6 ciclistas</option>
                  <option value={8}>8 ciclistas</option>
                </select>
              </span>
              <ChevronDown className="select-chevron" size={15} />
            </label>

            <button className="search-button" type="submit">
              Buscar rutas <ArrowRight size={17} />
            </button>
          </form>
          <div className="search-reassurance">
            <span>
              <ShieldCheck size={14} /> Reserva flexible
            </span>
            <span>·</span>
            <span>Precios en USD sin cargos sorpresa</span>
            <span>·</span>
            <span>Guías nativos bilingües</span>
          </div>
        </section>

        {/* Experiences Section */}
        <section className="experiences section-wrap" id="experiencias">
          <div className="section-topline">
            <span>HECHAS PARA SENTIR EL VALLE SAGRADO</span>
            <span className="section-number">02 — 04</span>
          </div>

          <div className="section-title-row">
            <div>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>
                Elige tu aventura
              </div>
              <h2>
                Un valle.
                <br />
                <em>Mil maneras de vivirlo.</em>
              </h2>
              <p>
                Desde un paseo entre terrazas ancestrales hasta una jornada
                completa de montaña. Cada ruta está pensada para conectar.
              </p>
            </div>
            <a className="text-link" href="#reservar">
              Ir a reservas <ArrowRight size={16} />
            </a>
          </div>

          {searched && searchDestination && (
            <div className="search-result-note">
              <span className="result-marker" />
              Mostrando rutas para <strong>{searchDestination}</strong>
              {date && (
                <span>
                  {' '}
                  ·{' '}
                  {new Date(`${date}T00:00:00`).toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              )}{' '}
              <button onClick={resetSearch}>
                Quitar filtro <X size={13} />
              </button>
            </div>
          )}

          <div className="category-row">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? 'category-chip active'
                    : 'category-chip'
                }
              >
                {category}
              </button>
            ))}
          </div>

          {shownTours.length ? (
            <div className="tour-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              {shownTours.map((tour) => (
                <article
                  className="tour-card"
                  key={tour.id}
                  data-testid={`card-tour-${tour.id}`}
                >
                  <div className="tour-image-wrap">
                    <img
                      src={tour.image}
                      alt={`Paisaje de ${tour.name} en el Valle Sagrado`}
                      className="tour-image"
                      loading="lazy"
                    />
                    {tour.badge && <span className="tour-badge">{tour.badge}</span>}
                    <span className="tour-difficulty">{tour.difficulty}</span>
                    <button
                      className={saved.includes(tour.id) ? 'save-tour saved' : 'save-tour'}
                      onClick={() => toggleSave(tour.id)}
                      aria-label={
                        saved.includes(tour.id)
                          ? 'Quitar de favoritos'
                          : 'Guardar en favoritos'
                      }
                    >
                      <Heart
                        size={17}
                        fill={saved.includes(tour.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                    <span className="image-location">
                      <MapPin size={12} />
                      {tour.city}
                    </span>
                  </div>

                  <div className="tour-body">
                    <div className="tour-kicker">
                      <span>{tour.distanceKm} km</span>
                      <span className="dot" />
                      <span>{tour.durationHours} horas</span>
                      <span className="dot" />
                      <Star size={11} fill="#bf9a58" color="#bf9a58" />
                      <span style={{ color: '#425a4c' }}>{tour.rating}</span>
                    </div>

                    <h3>{tour.name}</h3>
                    <p className="tour-tagline">{tour.tagline}</p>
                    <p className="tour-detail" style={{ lineHeight: '1.6', marginBottom: '12px' }}>
                      {tour.description}
                    </p>

                    <div className="tour-footer">
                      <div>
                        <span>Desde </span>
                        <strong>${tour.priceUSD} USD</strong>
                        <small> / persona</small>
                      </div>
                      <button
                        onClick={() => handleSelectTourForBooking(tour.id)}
                        className="tour-arrow"
                        aria-label={`Reservar ${tour.name}`}
                        title="Seleccionar y reservar"
                      >
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <Compass size={25} />
              <h3>Esta ruta aún no la tenemos listada.</h3>
              <p>Prueba con Maras, Pisac o Urubamba en el Valle Sagrado.</p>
              <button onClick={resetSearch}>
                Ver todas las rutas <ArrowRight size={15} />
              </button>
            </div>
          )}

          <div className="after-cards">
            <span>
              EL VALLE SAGRADO DE CUSCO. <em>UN CAMINO POR DESCUBRIR.</em>
            </span>
            <span>01 — 03</span>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section className="gallery-section section-wrap" id="galeria">
          <div className="section-topline">
            <span>FOTOGRAFÍAS REALES EN RUTA · VALLE SAGRADO</span>
            <span className="section-number">03 — 04</span>
          </div>

          <div className="gallery-header">
            <div>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>
                <Camera size={14} style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: '6px' }} />
                Galería visual
              </div>
              <h2>
                Momentos en ruta,
                <br />
                <em>la mirada de nuestros ciclistas.</em>
              </h2>
              <p>
                Capturas auténticas tomadas por nuestros guías y viajeros explorando senderos de altura,
                el puente ferroviario sobre el río Vilcanota, salineras milenarias y vistas a la cordillera.
              </p>
            </div>
            <div className="gallery-badge" style={{ alignSelf: 'flex-end', marginBottom: '8px' }}>
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'foto' : 'fotos'}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="gallery-filter-row">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryCategory(cat)}
                className={galleryCategory === cat ? 'category-chip active' : 'category-chip'}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="gallery-grid">
            {filteredPhotos.map((photo, idx) => {
              let spanClass = 'col-span-4';
              if (filteredPhotos.length === 1) {
                spanClass = 'col-span-12';
              } else if (filteredPhotos.length === 2) {
                spanClass = 'col-span-6';
              } else if (idx === 0) {
                spanClass = 'col-span-8';
              } else if (idx === 1) {
                spanClass = 'col-span-4';
              } else if (idx === 5) {
                spanClass = 'col-span-12';
              }

              return (
                <div
                  key={photo.id}
                  className={`gallery-item ${spanClass}`}
                  onClick={() => setActivePhoto(photo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActivePhoto(photo);
                    }
                  }}
                  aria-label={`Ver foto: ${photo.title}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <span className="gallery-badge">{photo.category}</span>
                      {photo.altitude && (
                        <span className="gallery-badge" style={{ background: 'rgba(20,36,28,0.7)', color: '#e4d4b3' }}>
                          {photo.altitude}
                        </span>
                      )}
                    </div>
                    <div className="gallery-info">
                      <div className="gallery-location">
                        <MapPin size={11} /> {photo.location}
                      </div>
                      <h3 className="gallery-title">{photo.title}</h3>
                      <p className="gallery-desc">{photo.description}</p>
                    </div>
                  </div>
                  <div className="gallery-zoom-cue" title="Ampliar imagen">
                    <Maximize2 size={16} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="after-cards" style={{ marginTop: '28px' }}>
            <span>
              CADA SALIDA TIENE SU PROPIA LUZ. <em>CAPTURA TU PROPIO VALLE.</em>
            </span>
            <span>FOTOS REALES DE SALIDAS 2024</span>
          </div>
        </section>

        {/* Dedicated Booking Section matching target page */}
        <section className="booking-section" id="reservar">
          <div className="booking-inner">
            <div className="booking-copy">
              <div className="eyebrow">Tu próxima historia empieza aquí</div>
              <h2>
                Reserva tu lugar
                <br />
                <em>en el camino.</em>
              </h2>
              <p>
                Elige una ruta, cuéntanos quién viene y asegura tus plazas. Tu
                pago se procesa de forma segura con Stripe.
              </p>

              <div className="booking-inclusions">
                <span>
                  <Check size={14} /> Confirmación inmediata con itinerario
                </span>
                <span>
                  <Check size={14} /> Cancelación flexible (hasta 48h antes)
                </span>
                <span>
                  <Check size={14} /> Equipo profesional y cascos incluidos
                </span>
                <span>
                  <Check size={14} /> Guía bilingüe local y vehículo de apoyo
                </span>
              </div>

              <div className="booking-smallprint">
                <ShieldCheck size={22} />
                <span>
                  Pago protegido por Stripe
                  <small>Precios en USD · Sin cargos sorpresa</small>
                </span>
              </div>
            </div>

            <div className="booking-form">
              {bookingDone ? (
                <div className="booking-success">
                  <div className="success-mark">
                    <Check size={26} />
                  </div>
                  <span className="eyebrow">¡PLAZA CONFIRMADA!</span>
                  <h2 style={{ fontSize: '32px' }}>
                    Tu aventura andina
                    <br />
                    <em>está lista.</em>
                  </h2>
                  <p>
                    Hemos registrado tu reserva para <strong>{selectedTour.name}</strong>{' '}
                    el día{' '}
                    <strong>
                      {new Date(`${date}T00:00:00`).toLocaleDateString('es-PE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>{' '}
                    para <strong>{riders} {riders === 1 ? 'viajero' : 'viajeros'}</strong>.
                  </p>
                  <div
                    style={{
                      background: '#f4f2ea',
                      padding: '16px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      marginBottom: '20px',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <strong>Referencia:</strong> ASR-
                      {Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </div>
                    <div>
                      <strong>Total:</strong> ${selectedTour.priceUSD * riders} USD
                    </div>
                    <div>
                      <strong>Titular:</strong> {guestName || 'Viajero'}
                    </div>
                    <div>
                      <strong>Email:</strong> {guestEmail || 'tu@correo.com'}
                    </div>
                  </div>
                  <button
                    className="button button-green"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setBookingDone(false);
                      setGuestName('');
                      setGuestPhone('');
                      setGuestEmail('');
                    }}
                  >
                    Hacer otra reserva <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-title">
                    <span>RESERVA EN 2 MINUTOS</span>
                    <strong>Planifica tu salida</strong>
                  </div>

                  <label className="field-label" htmlFor="tour-choice">
                    Experiencia
                  </label>
                  <select
                    id="tour-choice"
                    value={selectedTourId}
                    onChange={(e) => setSelectedTourId(e.target.value)}
                    required
                  >
                    {TOURS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} · ${t.priceUSD} USD / persona ({t.difficulty})
                      </option>
                    ))}
                  </select>

                  <div className="form-row">
                    <div>
                      <label className="field-label" htmlFor="tour-date">
                        Fecha
                      </label>
                      <input
                        id="tour-date"
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="traveler-count">
                        Ciclistas
                      </label>
                      <select
                        id="traveler-count"
                        value={riders}
                        onChange={(e) => setRiders(Number(e.target.value))}
                      >
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'persona' : 'personas'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="availability">
                    <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {selectedTour.availableSeats} plazas disponibles para esta fecha
                  </p>

                  <div className="form-divider" />

                  <div className="form-row">
                    <div>
                      <label className="field-label" htmlFor="guest-name">
                        Nombre completo
                      </label>
                      <input
                        id="guest-name"
                        type="text"
                        placeholder="Tu nombre y apellido"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="guest-phone">
                        Teléfono
                      </label>
                      <input
                        id="guest-phone"
                        type="tel"
                        placeholder="+51 987 654 321"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <label className="field-label" htmlFor="guest-email">
                    Correo electrónico
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />

                  <div className="booking-total">
                    <span>
                      Total estimado{' '}
                      <small>
                        {riders} {riders === 1 ? 'persona' : 'personas'}
                      </small>
                    </span>
                    <strong>${selectedTour.priceUSD * riders} USD</strong>
                  </div>

                  <button className="button button-green booking-submit" type="submit">
                    Continuar al pago seguro <ArrowRight size={15} />
                  </button>

                  <p className="checkout-note">
                    <ShieldCheck size={13} /> Tus datos están protegidos. Nunca
                    almacenamos datos de tarjeta.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="manifesto" id="nosotros">
          <div className="manifesto-image">
            <img
              src="/assets/aistudio/IMG_20261010_135534236_HDR_02ca2d6b.jpg"
              alt="Bicicleta de montaña en sendero andino con casa rústica de piedra y cielos del Valle Sagrado"
              loading="lazy"
            />
          </div>
          <div className="manifesto-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> UNA FORMA DISTINTA DE VIAJAR
            </div>
            <h2>
              No venimos a tachar lugares.
              <br />
              <em>Venimos a sentirlos.</em>
            </h2>
            <p>
              Somos guías, ciclistas y vecinos del Valle. Diseñamos recorridos
              que respetan el lugar, celebran a quienes lo habitan y te dejan
              llevarte algo más que una foto.
            </p>
            <div style={{ marginTop: '24px' }}>
              <a href="#experiencias" className="text-link">
                Conoce nuestras rutas <ArrowRight size={16} />
              </a>
            </div>
            <div className="manifesto-signature">
              <span className="signature-rule" />
              Lo bueno pasa fuera del itinerario.
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="how-section section-wrap" id="como-funciona">
          <div className="section-topline">
            <span>03 — TAN FÁCIL COMO SALIR</span>
            <span>Y TAN AUTÉNTICO COMO CONOCER</span>
          </div>
          <div className="how-heading">
            <h2>
              De aquí a <em>ahí.</em>
            </h2>
            <p>
              Todo lo que necesitas para salir a rodar,
              <br />
              sin tener que pensarlo demasiado.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step-number">01</span>
              <div className="step-icon">
                <MapPin size={21} />
              </div>
              <h3>Elige tu ruta andina</h3>
              <p>
                Maras, Pisac o Urubamba: encuentra una experiencia con el ritmo
                y la mirada que te apetecen.
              </p>
            </div>
            <div className="step">
              <span className="step-number">02</span>
              <div className="step-icon">
                <Bike size={22} />
              </div>
              <h3>Conoce a tu guía local</h3>
              <p>
                Gente de aquí, historias ancestrales, bicicletas de montaña
                puestas a punto y cascos para todos.
              </p>
            </div>
            <div className="step">
              <span className="step-number">03</span>
              <div className="step-icon">
                <ArrowRight size={21} />
              </div>
              <h3>Sal a descubrir</h3>
              <p>
                Reserva sin complicaciones. El resto, mejor dejarlo a las
                montañas y al camino.
              </p>
            </div>
          </div>
          <div className="trust-strip">
            <ShieldCheck size={20} />
            <p>
              <strong>Planes claros, gente real.</strong> Cada ruta incluye lo
              que necesitas saber antes de reservar.
            </p>
            <span>Y si cambian los planes, hay cancelación flexible hasta 48h.</span>
          </div>
        </section>

        {/* FAQ Section matching target page */}
        <section className="faq section-wrap" id="preguntas">
          <div className="faq-heading">
            <div className="eyebrow">Antes de salir</div>
            <h2>
              Preguntas
              <br />
              <em>frecuentes.</em>
            </h2>
            <p>¿Algo más? Escríbenos y te ayudamos a encontrar la ruta ideal.</p>
            <a className="text-link" href="mailto:hola@andessobreruedas.com">
              Hablemos <ArrowRight size={16} />
            </a>
          </div>

          <div className="faq-list">
            <details open>
              <summary>
                ¿Necesito experiencia en bicicleta de montaña? <span>+</span>
              </summary>
              <p>
                No para todas las rutas. Cada experiencia muestra su nivel de
                dificultad. Cuéntanos cómo te sientes en bici y te recomendamos la
                mejor opción.
              </p>
            </details>

            <details>
              <summary>
                ¿Qué incluye el precio? <span>+</span>
              </summary>
              <p>
                Bicicleta, casco, guía local y transporte de apoyo. Cada detalle
                específico aparece en la descripción de cada tour.
              </p>
            </details>

            <details>
              <summary>
                ¿Puedo cancelar o cambiar la fecha? <span>+</span>
              </summary>
              <p>
                Las reservas pueden cambiarse con 48 horas de anticipación,
                sujeto a disponibilidad. Escríbenos antes de tu salida y buscamos
                la mejor solución.
              </p>
            </details>

            <details>
              <summary>
                ¿A qué moneda están publicados los precios? <span>+</span>
              </summary>
              <p>
                Los precios están publicados en dólares estadounidenses (USD).
                El pago se procesa de forma segura con Stripe.
              </p>
            </details>
          </div>
        </section>

        {/* Last call banner */}
        <section className="last-call">
          <p>EL CAMINO CORTO NO SIEMPRE ES EL MEJOR.</p>
          <a href="#reservar">
            ¿Salimos a pedalear? <ArrowRight size={18} />
          </a>
          <span>Con curiosidad basta.</span>
        </section>
      </main>

      {/* Footer matching target page */}
      <footer className="footer site-footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark">
            <Bike size={20} />
          </span>
          <span>
            andes<span className="brand-light">sobre ruedas</span>
            <i>.</i>
          </span>
        </a>
        <span>Hecho con cariño en el Valle Sagrado, Perú.</span>
        <div>
          <a href="#experiencias">Experiencias</a>
          <a href="#galeria">Galería</a>
          <a href="#reservar">Reservas</a>
          <a href="mailto:hola@andessobreruedas.com">
            hola@andessobreruedas.com
          </a>
          <span>© 2024 Andes sobre Ruedas</span>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="lightbox-backdrop"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
        >
          <div
            className="lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setActivePhoto(null)}
              aria-label="Cerrar vista de foto"
            >
              <X size={18} />
            </button>

            <div className="lightbox-image-wrap">
              <img src={activePhoto.src} alt={activePhoto.title} />
            </div>

            <div className="lightbox-footer">
              <div>
                <div className="gallery-location" style={{ color: '#9a7840', marginBottom: '3px' }}>
                  <MapPin size={12} /> {activePhoto.location} {activePhoto.altitude ? `· ${activePhoto.altitude}` : ''}
                </div>
                <h3>{activePhoto.title}</h3>
                <p>{activePhoto.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="lightbox-nav-btn"
                  onClick={handlePrevPhoto}
                  aria-label="Foto anterior"
                  title="Foto anterior (Flecha izquierda)"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="lightbox-nav-btn"
                  onClick={handleNextPhoto}
                  aria-label="Foto siguiente"
                  title="Foto siguiente (Flecha derecha)"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
