import { Router, type Request, type Response } from "express";

const toursRouter = Router();

const TOURS = [
  {
    id: "maras-salt-mines",
    slug: "maras-salt-mines",
    name: "Maras y las salineras",
    tagline: "Una ruta entre sal, montaña e historia",
    description:
      "Descubre las salineras de Maras y los caminos panorámicos del Valle Sagrado a un ritmo cómodo, acompañado por nuestro equipo local.",
    durationHours: "5",
    distanceKm: "28",
    difficulty: "Intermedio",
    priceCents: 11900,
    maxCapacity: 8,
    imageUrl: "/images/valle-sagrado-maras.png",
    featured: true,
    availableSeats: 8,
  },
  {
    id: "pisac-terraces",
    slug: "pisac-terraces",
    name: "Terrazas de Pisac",
    tagline: "Senderos ancestrales y vistas infinitas",
    description:
      "Pedalea entre andenes incas y pueblos andinos con un guía local. Incluye bicicleta, casco y transporte desde el Valle.",
    durationHours: "4.5",
    distanceKm: "22",
    difficulty: "Moderado",
    priceCents: 8900,
    maxCapacity: 8,
    imageUrl: "/images/valle-sagrado-terraces.png",
    featured: true,
    availableSeats: 8,
  },
  {
    id: "sacred-valley-day",
    slug: "sacred-valley-day",
    name: "El gran Valle Sagrado",
    tagline: "Un día completo para perderse y encontrarse",
    description:
      "Conecta Urubamba, campos de cultivo y comunidades locales en una travesía completa con almuerzo campestre, bicicleta y guía bilingüe.",
    durationHours: "7",
    distanceKm: "42",
    difficulty: "Desafiante",
    priceCents: 15900,
    maxCapacity: 6,
    imageUrl: "/images/valle-sagrado-cycling-hero.png",
    featured: false,
    availableSeats: 6,
  },
];

toursRouter.get("/tours", (_req: Request, res: Response) => {
  res.json(TOURS);
});

export default toursRouter;
