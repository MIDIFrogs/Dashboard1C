import type { Category, ProductGroup, Sale } from './models';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "ФОКУС",
    products: [
      {
        id: 101,
        name: "Postgres Pro, Tantor SE 1C",
        sales: generateSales(101),
        categoryId: 1
      },
      {
        id: 102,
        name: "Kaspersky (только B2B)",
        sales: generateSales(102),
        categoryId: 1
      },
      {
        id: 103,
        name: "Р7",
        sales: generateSales(103),
        categoryId: 1
      },
      {
        id: 104,
        name: "ГК «Астра» (без учета Tantor SE 1C)",
        sales: generateSales(104),
        categoryId: 1
      },
      {
        id: 105,
        name: "АСКОН",
        sales: generateSales(105),
        categoryId: 1
      },
      {
        id: 106,
        name: "Контент ИИ",
        sales: generateSales(106),
        categoryId: 1
      }
    ]
  },
  {
    id: 2,
    name: "Сетевая безопасность",
    products: [
      {
        id: 201,
        name: "UserGate",
        sales: generateSales(201),
        categoryId: 2
      },
      {
        id: 202,
        name: "Ideco",
        sales: generateSales(202),
        categoryId: 2
      },
      {
        id: 203,
        name: "ИКС",
        sales: generateSales(203),
        categoryId: 2
      },
      {
        id: 204,
        name: "Смарт-Софт, SkyDNS",
        sales: generateSales(204),
        categoryId: 2
      }
    ]
  },
  {
    id: 3,
    name: "Системное ПО",
    products: [
      {
        id: 301,
        name: "ALT Linux (Базальт СПО)",
        sales: generateSales(301),
        categoryId: 3
      },
      {
        id: 302,
        name: "РедСофт",
        sales: generateSales(302),
        categoryId: 3
      },
      {
        id: 303,
        name: "РОСА, Атлант, ОСнова",
        sales: generateSales(303),
        categoryId: 3
      }
    ]
  },
  {
    id: 4,
    name: "Удаленное управление и виртуализация",
    products: [
      {
        id: 401,
        name: "SHUTLE TSplus (ШАТЛ), Ассистент, Getscreen, AnyDesk, RuDesktop, RMS, Radmin",
        sales: generateSales(401),
        categoryId: 4
      }
    ]
  },
  {
    id: 5,
    name: "ВКС",
    products: [
      {
        id: 501,
        name: "TrueConf, Вкурсе, Телемост, Mind, VideoMost, Webinar, VirtualRoom (Mirapolis)",
        sales: generateSales(501),
        categoryId: 5
      }
    ]
  },
  {
    id: 6,
    name: "-",
    products: [
      {
        id: 601,
        name: "Киберпротект (Акронис-Инфозащита)",
        sales: generateSales(601),
        categoryId: 6
      },
      {
        id: 602,
        name: "Dr.Web",
        sales: generateSales(602),
        categoryId: 6
      },
      {
        id: 603,
        name: "Tegu",
        sales: generateSales(603),
        categoryId: 6
      },
      {
        id: 604,
        name: "МойОфис",
        sales: generateSales(604),
        categoryId: 6
      },
      {
        id: 605,
        name: "Остальной софт",
        sales: generateSales(605),
        categoryId: 6
      }
    ]
  }
];

function generateSales(productId: number): Sale[] {
  const currentYear = new Date().getFullYear();
  const sales: Sale[] = [];
  
  // Generate sales data for current and previous year
  for (let year of [currentYear - 1, currentYear]) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const targetAmount = 50000 + Math.random() * 100000;
      const actualSales = targetAmount * (0.7 + Math.random() * 0.6); // 70-130% of target
      
      sales.push({
        id: parseInt(`${productId}${year}${quarter}`),
        productId,
        year,
        quarter,
        targetAmount,
        actualSales
      });
    }
  }
  
  return sales;
} 