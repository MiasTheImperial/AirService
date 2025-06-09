import { Product, Category } from '../types';

// Категории товаров
export const categories: Category[] = [
  {
    id: 'food',
    name: 'Еда',
    description: 'Основные блюда и закуски',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'drinks',
    name: 'Напитки',
    description: 'Безалкогольные напитки',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'alcohol',
    name: 'Алкоголь',
    description: 'Алкогольные напитки',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'snacks',
    name: 'Закуски',
    description: 'Легкие закуски и снеки',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'desserts',
    name: 'Десерты',
    description: 'Сладкие десерты и выпечка',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'souvenirs',
    name: 'Сувениры',
    description: 'Памятные сувениры и подарки',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'accessories',
    name: 'Аксессуары',
    description: 'Полезные аксессуары для путешествий',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'electronics',
    name: 'Электроника',
    description: 'Электронные устройства и аксессуары',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'cosmetics',
    name: 'Косметика',
    description: 'Средства по уходу за собой',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'toys',
    name: 'Игрушки',
    description: 'Игрушки для детей',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'books',
    name: 'Книги',
    description: 'Книги и журналы',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300',
  }
];

// Товары
export const products: Product[] = [
  // Еда
  {
    id: 'food-1',
    name: 'Куриное филе с овощами',
    description: 'Нежное куриное филе, приготовленное на гриле, подается с сезонными овощами и соусом.',
    price: 750,
    categoryId: 'food',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Куриное филе, болгарский перец, цуккини, морковь, лук, оливковое масло, специи.',
    nutritionalInfo: {
      calories: 320,
      proteins: 28,
      fats: 12,
      carbs: 18
    },
    allergens: ['Может содержать следы глютена'],
    weight: '250 г'
  },
  {
    id: 'food-2',
    name: 'Паста Карбонара',
    description: 'Классическая итальянская паста с соусом из сливок, яиц, бекона и сыра пармезан.',
    price: 680,
    categoryId: 'food',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Паста, бекон, сливки, яйца, сыр пармезан, черный перец, соль.',
    nutritionalInfo: {
      calories: 450,
      proteins: 18,
      fats: 22,
      carbs: 45
    },
    allergens: ['Глютен', 'Яйца', 'Молочные продукты'],
    weight: '280 г'
  },
  {
    id: 'food-3',
    name: 'Стейк из говядины',
    description: 'Сочный стейк из мраморной говядины средней прожарки с картофельным пюре и соусом.',
    price: 1200,
    categoryId: 'food',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Говядина, картофель, сливочное масло, сливки, розмарин, тимьян, чеснок.',
    nutritionalInfo: {
      calories: 520,
      proteins: 35,
      fats: 32,
      carbs: 25
    },
    allergens: ['Молочные продукты'],
    weight: '300 г'
  },
  {
    id: 'food-4',
    name: 'Рыба с овощами на пару',
    description: 'Нежное филе лосося, приготовленное на пару, с овощным гарниром и лимонным соусом.',
    price: 850,
    categoryId: 'food',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Филе лосося, брокколи, морковь, цуккини, лимон, оливковое масло, укроп.',
    nutritionalInfo: {
      calories: 310,
      proteins: 29,
      fats: 18,
      carbs: 10
    },
    allergens: ['Рыба'],
    weight: '270 г'
  },
  {
    id: 'food-5',
    name: 'Вегетарианский салат',
    description: 'Свежий салат из сезонных овощей с оливковым маслом и бальзамическим уксусом.',
    price: 450,
    categoryId: 'food',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Листья салата, помидоры, огурцы, болгарский перец, красный лук, оливковое масло, бальзамический уксус.',
    nutritionalInfo: {
      calories: 120,
      proteins: 3,
      fats: 8,
      carbs: 9
    },
    allergens: [],
    weight: '200 г'
  },
  {
    id: 'food-6',
    name: 'Борщ',
    description: 'Традиционный украинский борщ со сметаной и чесночными пампушками.',
    price: 480,
    categoryId: 'food',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Говядина, свекла, капуста, картофель, морковь, лук, томатная паста, сметана.',
    nutritionalInfo: {
      calories: 280,
      proteins: 15,
      fats: 12,
      carbs: 30
    },
    allergens: ['Молочные продукты'],
    weight: '350 г'
  },

  // Напитки
  {
    id: 'drinks-1',
    name: 'Свежевыжатый апельсиновый сок',
    description: 'Натуральный свежевыжатый сок из спелых апельсинов.',
    price: 350,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Апельсины.',
    nutritionalInfo: {
      calories: 110,
      proteins: 2,
      fats: 0,
      carbs: 26
    },
    allergens: [],
    volume: '250 мл'
  },
  {
    id: 'drinks-2',
    name: 'Минеральная вода',
    description: 'Негазированная минеральная вода.',
    price: 150,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Природная минеральная вода.',
    nutritionalInfo: {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0
    },
    allergens: [],
    volume: '500 мл'
  },
  {
    id: 'drinks-3',
    name: 'Кофе Американо',
    description: 'Классический кофе американо из свежемолотых зерен арабики.',
    price: 280,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Кофе арабика, вода.',
    nutritionalInfo: {
      calories: 5,
      proteins: 0,
      fats: 0,
      carbs: 0
    },
    allergens: [],
    volume: '200 мл'
  },
  {
    id: 'drinks-4',
    name: 'Чай зеленый',
    description: 'Китайский зеленый чай с жасмином.',
    price: 220,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Зеленый чай, жасмин.',
    nutritionalInfo: {
      calories: 2,
      proteins: 0,
      fats: 0,
      carbs: 0
    },
    allergens: [],
    volume: '200 мл'
  },
  {
    id: 'drinks-5',
    name: 'Смузи ягодный',
    description: 'Освежающий смузи из свежих ягод с йогуртом и медом.',
    price: 380,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Клубника, черника, малина, йогурт, мед, лед.',
    nutritionalInfo: {
      calories: 180,
      proteins: 5,
      fats: 2,
      carbs: 35
    },
    allergens: ['Молочные продукты'],
    volume: '300 мл'
  },

  // Алкоголь
  {
    id: 'alcohol-1',
    name: 'Вино красное сухое',
    description: 'Итальянское красное сухое вино Кьянти Классико.',
    price: 750,
    categoryId: 'alcohol',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Виноград Санджовезе.',
    nutritionalInfo: {
      calories: 85,
      proteins: 0,
      fats: 0,
      carbs: 2
    },
    allergens: ['Сульфиты'],
    volume: '150 мл'
  },
  {
    id: 'alcohol-2',
    name: 'Пиво светлое',
    description: 'Чешское светлое пиво Пилзнер.',
    price: 450,
    categoryId: 'alcohol',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Вода, солод, хмель, дрожжи.',
    nutritionalInfo: {
      calories: 140,
      proteins: 1,
      fats: 0,
      carbs: 11
    },
    allergens: ['Глютен'],
    volume: '330 мл'
  },
  {
    id: 'alcohol-3',
    name: 'Виски',
    description: 'Шотландский односолодовый виски 12 лет выдержки.',
    price: 950,
    categoryId: 'alcohol',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Ячменный солод, вода.',
    nutritionalInfo: {
      calories: 70,
      proteins: 0,
      fats: 0,
      carbs: 0
    },
    allergens: [],
    volume: '50 мл'
  },

  // Закуски
  {
    id: 'snacks-1',
    name: 'Орешки ассорти',
    description: 'Смесь жареных орехов с солью.',
    price: 320,
    categoryId: 'snacks',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Арахис, миндаль, кешью, фундук, соль.',
    nutritionalInfo: {
      calories: 580,
      proteins: 20,
      fats: 50,
      carbs: 10
    },
    allergens: ['Орехи'],
    weight: '100 г'
  },
  {
    id: 'snacks-2',
    name: 'Чипсы картофельные',
    description: 'Хрустящие картофельные чипсы с солью и специями.',
    price: 280,
    categoryId: 'snacks',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Картофель, растительное масло, соль, специи.',
    nutritionalInfo: {
      calories: 530,
      proteins: 6,
      fats: 35,
      carbs: 50
    },
    allergens: [],
    weight: '90 г'
  },
  {
    id: 'snacks-3',
    name: 'Сырная тарелка',
    description: 'Ассорти из 4 видов сыра с виноградом и крекерами.',
    price: 680,
    categoryId: 'snacks',
    image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Сыр бри, камамбер, пармезан, горгонзола, виноград, крекеры.',
    nutritionalInfo: {
      calories: 420,
      proteins: 22,
      fats: 32,
      carbs: 15
    },
    allergens: ['Молочные продукты', 'Глютен'],
    weight: '150 г'
  },

  // Десерты
  {
    id: 'desserts-1',
    name: 'Тирамису',
    description: 'Классический итальянский десерт на основе маскарпоне и кофе.',
    price: 420,
    categoryId: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Маскарпоне, яйца, сахар, кофе, печенье савоярди, какао-порошок.',
    nutritionalInfo: {
      calories: 350,
      proteins: 7,
      fats: 24,
      carbs: 28
    },
    allergens: ['Яйца', 'Молочные продукты', 'Глютен'],
    weight: '120 г'
  },
  {
    id: 'desserts-2',
    name: 'Чизкейк',
    description: 'Нежный чизкейк с ягодным соусом.',
    price: 390,
    categoryId: 'desserts',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Сливочный сыр, сахар, яйца, сливки, печенье, сливочное масло, ягоды.',
    nutritionalInfo: {
      calories: 380,
      proteins: 8,
      fats: 26,
      carbs: 30
    },
    allergens: ['Яйца', 'Молочные продукты', 'Глютен'],
    weight: '130 г'
  },
  {
    id: 'desserts-3',
    name: 'Шоколадный фондан',
    description: 'Шоколадный кекс с жидкой начинкой и ванильным мороженым.',
    price: 450,
    categoryId: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Темный шоколад, масло, яйца, сахар, мука, ванильное мороженое.',
    nutritionalInfo: {
      calories: 420,
      proteins: 6,
      fats: 28,
      carbs: 35
    },
    allergens: ['Яйца', 'Молочные продукты', 'Глютен'],
    weight: '150 г'
  },

  // Сувениры
  {
    id: 'souvenirs-1',
    name: 'Магнит на холодильник',
    description: 'Сувенирный магнит с изображением самолета.',
    price: 250,
    categoryId: 'souvenirs',
    image: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '30 г'
  },
  {
    id: 'souvenirs-2',
    name: 'Модель самолета',
    description: 'Коллекционная модель самолета в масштабе 1:400.',
    price: 1200,
    categoryId: 'souvenirs',
    image: 'https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '120 г'
  },

  // Аксессуары
  {
    id: 'accessories-1',
    name: 'Дорожная подушка',
    description: 'Удобная подушка для шеи для комфортного сна во время полета.',
    price: 980,
    categoryId: 'accessories',
    image: 'https://images.unsplash.com/photo-1520996729250-7d888a835cc4?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '250 г'
  },
  {
    id: 'accessories-2',
    name: 'Маска для сна',
    description: 'Мягкая маска для сна с регулируемым ремешком.',
    price: 450,
    categoryId: 'accessories',
    image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '50 г'
  },
  {
    id: 'accessories-3',
    name: 'Беруши',
    description: 'Силиконовые беруши для защиты от шума.',
    price: 280,
    categoryId: 'accessories',
    image: 'https://images.unsplash.com/photo-1590935217281-8f102120d683?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '10 г'
  },

  // Электроника
  {
    id: 'electronics-1',
    name: 'Наушники',
    description: 'Беспроводные наушники с шумоподавлением.',
    price: 3500,
    categoryId: 'electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '200 г'
  },
  {
    id: 'electronics-2',
    name: 'Внешний аккумулятор',
    description: 'Портативный внешний аккумулятор емкостью 10000 мАч.',
    price: 2200,
    categoryId: 'electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '220 г'
  },

  // Косметика
  {
    id: 'cosmetics-1',
    name: 'Увлажняющий крем',
    description: 'Увлажняющий крем для лица с гиалуроновой кислотой.',
    price: 850,
    categoryId: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: 'Вода, глицерин, гиалуроновая кислота, масло ши, экстракт алоэ вера.',
    nutritionalInfo: null,
    allergens: [],
    weight: '50 мл'
  },
  {
    id: 'cosmetics-2',
    name: 'Набор миниатюр',
    description: 'Дорожный набор миниатюр средств по уходу за кожей.',
    price: 1200,
    categoryId: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '150 г'
  },

  // Игрушки
  {
    id: 'toys-1',
    name: 'Мягкая игрушка',
    description: 'Мягкая игрушка в виде самолета для детей.',
    price: 680,
    categoryId: 'toys',
    image: 'https://images.unsplash.com/photo-1563901935883-cb61f5d49be4?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '150 г'
  },
  {
    id: 'toys-2',
    name: 'Набор для раскрашивания',
    description: 'Детский набор для раскрашивания с карандашами и раскрасками.',
    price: 450,
    categoryId: 'toys',
    image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '200 г'
  },

  // Книги
  {
    id: 'books-1',
    name: 'Роман "Мастер и Маргарита"',
    description: 'Знаменитый роман Михаила Булгакова в мягкой обложке.',
    price: 550,
    categoryId: 'books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '350 г'
  },
  {
    id: 'books-2',
    name: 'Журнал о путешествиях',
    description: 'Свежий выпуск журнала о путешествиях и приключениях.',
    price: 320,
    categoryId: 'books',
    image: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?auto=format&fit=crop&q=80&w=300',
    inStock: true,
    ingredients: null,
    nutritionalInfo: null,
    allergens: [],
    weight: '200 г'
  }
]; 