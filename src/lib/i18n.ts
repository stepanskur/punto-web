export const translations: Record<string, Record<string, string>> = {
  EN: {
    'Fares & Classes': 'Fares & Classes',
    'Destinations': 'Destinations',
    'News': 'News',
    'About Us': 'About Us',
    'Search your flight': 'Search your flight',
    'Round Trip': 'Round Trip',
    'One Way': 'One Way',
    'From': 'From',
    'Where from?': 'Where from?',
    'To': 'To',
    'Where to?': 'Where to?',
    'Dates': 'Dates',
    'Add dates': 'Add dates',
    'Departure': 'Departure',
    'Return': 'Return',
    'Travelers': 'Travelers',
    'Person': 'Person',
    'Persons': 'Persons',
    'Class': 'Class',
    'Economy': 'Economy',
    'Business': 'Business',
    'Search Flights': 'Search Flights',
    'Filters': 'Filters',
    'Airlines': 'Airlines',
    'Punto Fly + Partners': 'Punto Fly + Partners',
    'Stops': 'Stops',
    'Any number of stops': 'Any number of stops',
    'Non-stop only': 'Non-stop only',
    'Up to 1 stop': 'Up to 1 stop',
    'Searching for the best flights...': 'Searching for the best flights...',
    'No flights found': 'No flights found',
    'Departure Flights': 'Departure Flights',
    'Return Flights': 'Return Flights',
    'Select Fare': 'Select Fare',
    'Direct': 'Direct',
    'stop': 'stop',
    'stops': 'stops',
    'from': 'from',
    'Partner Flight': 'Partner Flight',
    'Economy Basic': 'Economy Basic',
    'Economy Plus': 'Economy Plus',
    'Economy Premium': 'Economy Premium'
  },
  RU: {
    'Fares & Classes': 'Тарифы и классы',
    'Destinations': 'Направления',
    'News': 'Новости',
    'About Us': 'О нас',
    'Search your flight': 'Найти рейс',
    'Round Trip': 'Туда-обратно',
    'One Way': 'В одну сторону',
    'From': 'Откуда',
    'Where from?': 'Откуда?',
    'To': 'Куда',
    'Where to?': 'Куда?',
    'Dates': 'Даты',
    'Add dates': 'Добавить даты',
    'Departure': 'Туда',
    'Return': 'Обратно',
    'Travelers': 'Пассажиры',
    'Person': 'Пассажир',
    'Persons': 'Пассажиров',
    'Class': 'Класс',
    'Economy': 'Эконом',
    'Business': 'Бизнес',
    'Search Flights': 'Найти билеты',
    'Filters': 'Фильтры',
    'Airlines': 'Авиакомпании',
    'Punto Fly + Partners': 'Punto Fly + Партнеры',
    'Stops': 'Пересадки',
    'Any number of stops': 'Любое количество',
    'Non-stop only': 'Без пересадок',
    'Up to 1 stop': 'До 1 пересадки',
    'Searching for the best flights...': 'Ищем лучшие рейсы...',
    'No flights found': 'Рейсы не найдены',
    'Departure Flights': 'Рейсы туда',
    'Return Flights': 'Рейсы обратно',
    'Select Fare': 'Выбор тарифа',
    'Direct': 'Прямой',
    'stop': 'пересадка',
    'stops': 'пересадки',
    'from': 'от',
    'Partner Flight': 'Рейс партнера',
    'Economy Basic': 'Эконом Базовый',
    'Economy Plus': 'Эконом Плюс',
    'Economy Premium': 'Эконом Премиум'
  }
};

export function useTranslation() {
  const getLang = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('punto_lang') || 'EN';
    }
    return 'EN';
  };
  
  const lang = getLang();
  
  const t = (key: string) => {
    return translations[lang]?.[key] || key;
  };

  return { t, lang };
}
