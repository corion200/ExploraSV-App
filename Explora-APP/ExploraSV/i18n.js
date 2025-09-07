import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "reserve_now": "Reserve Now",
      "my_reservations": "My Reservations",
      "explore_categories": "Explore by categories",
      "must_see_places": "Must-See Places",
      "see_all": "See all",
      "what_adventure_today": "What adventure awaits today?",
      "banner":"Receive a special reward when you book with us and enjoy unique experiences.",
      "senderismo": "Hiking",
      "playas": "Beaches",
      "eco-turismo": "Eco Tourism",
      "aventura": "Adventure",
      "coast":"Entry cost"
    }
  },
  es: {
    translation: {
      "reserve_now": "Reserva Ahora",
      "my_reservations": "Mis Reservas",
      "explore_categories": "Explora por categorías",
      "must_see_places": "Lugares imperdibles",
      "see_all": "Ver todos",
      "what_adventure_today": "¿Qué aventura nos espera hoy?",
      "banner":"Recibe una recompensa especial al hacer tu reserva con nosotros y vive experiencias únicas",
      "senderismo": "Senderismo",
      "playas": "Playas",
      "eco-turismo": "Eco Turismo",
      "aventura": "Aventura",
      "coast":"Costo de entrada"
    }
  },
  fr: {
    translation: {
      "reserve_now": "Réservez Maintenant",
      "my_reservations": "Mes Réservations",
      "explore_categories": "Explorer par catégories",
      "must_see_places": "Lieux incontournables",
      "see_all": "Voir tout",
      "what_adventure_today": "Quelle aventure nous attend aujourd'hui?",
      "senderismo": "Randonnée",
      "playas": "Plages",
      "eco-turismo": "Éco Tourisme",
      "aventura": "Aventure",
      "coast":"coût d'entrée"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

export default i18n;
