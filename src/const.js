import {
  ArrowRightLine,
  ArrowDownLine,
  UserChange,
  Location,
  Setting,
  Growth,
  Conversion,
  Member,
  OperatePeople,
  PeopleBranch,
  Model,
  Code,
  Coupon,
  WavePoint,
  Split,
  Shield,
  OneColumn,
  AbTest,
  AdvancedAnalytics,
  Trend,
  Peoples,
  PeoplesMap,
  UserInfo,
  SettingHorizontal,
  ThreeColumns,
  ArrowRight,
  ArrowLeft,
  PeoplesCostomize,
  PeopleExpand,
  Storage,
  FunnelTime,
  PieChart,
  Tag,
  ExpandOutline,
} from '@rsuite/icons'

import DashboardIcon from '@rsuite/icons/legacy/Dashboard'
import GroupIcon from '@rsuite/icons/legacy/Group'
import MagicIcon from '@rsuite/icons/legacy/Magic'
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle'
import PushMessageIcon from '@rsuite/icons/PushMessage'
import CouponIcon from '@rsuite/icons/Coupon'

const btnInfo = [
  { id: 'Данные получателя/плательщика', status: false },
  { id: 'Создания инвойса', status: false },
  { id: 'Документы', status: false },
]
const ratesData = [
  { id: 1, title: 'Inland rates', code: 'inlandrates' },
  { id: 2, title: 'Sea rates', code: 'searatesconsolidation' },
  { id: 3, title: 'Doc fees', code: 'docfees' },
]

const formInvoiceArray = [
  { id: 1, value: 'Оплата за авто' },
  { id: 2, value: 'Оплата за доставку' },
  { id: 3, value: 'Инвойс для таможни' },
]

const btnInfoInvoice = [
  { id: 'Инвойсы', status: false },
  { id: 'Платежи', status: false },
  { id: 'Доп.доки', status: false },
]

const addSelectArray = [
  { id: 'Выберите из списка' },
  { id: 'action balance 1' },
  { id: 'action balance 2' },
  { id: 'credit card' },
  { id: 'the driver' },
  { id: 'interTrade' },
]
const btnShow = [
  { id: 'Быстрый вызов' },
  { id: 'Выгрузка Клайпеда' },
  { id: 'Доп за тройку' },
  { id: 'InterTrade account' },
  { id: 'Pre-bid / InterTrade account' },
  { id: 'Storage fee' },
  { id: 'late payment fee' },
  { id: 'mailing fee' },
  { id: 'EV fee' },
]
const btnShowPay = [
  { id: 'Добавить Оплату', status: false },
  { id: 'Платежи Совершенные', status: false },
]

const payUserArray = [
  { id: 0, title: 'авто' },
  { id: 1, title: 'доставку' },
]

const variantPayArray = [
  { id: 0, title: 'Из кошелька' },
  { id: 1, title: 'Банк перевод' },

  { id: 2, title: 'Третья компания' },

  { id: 3, title: 'Крипта' },

  { id: 4, title: 'Иная форма' },
]

const bankTransitArray = [
  { id: 0, title: 'Аукциона' },
  { id: 1, title: 'Перевозчика' },
  // { id: 2, title: 'Посредники' },
]

const dataInfo = [
  {
    id: 1,
    title: 'Чистая доставка',
    content: [
      {
        id: 1,
        title:
          'Без консультаций сотрудников, лишь присылаете номер лота и ставку по нему',
      },
      {
        id: 2,
        title:
          'Без консультаций сотрудников, лишь присылаете номер лота и ставку по нему',
      },
      { id: 3, title: 'Проведение аукциона' },
      { id: 4, title: 'Организация доставки' },
      { id: 5, title: 'Отчёт CarFax бесплатно' },
      { id: 6, title: 'Приглашаем к сотрудничеству!' },
    ],
    titleBtn: 'Мне подходит',
    prise: 550,
    status: false,
  },
  {
    id: 2,
    title: 'Стандартный',
    content: [
      { id: 7, title: 'Подбор авто (лотов)' },
      {
        id: 8,
        title:
          'Консультация по найденному лоту: оценка степени проникновения удара, проверка истории автомобиля',
      },
      { id: 9, title: 'Проведение аукциона' },
      { id: 10, title: 'Организация доставки' },
      { id: 11, title: 'Отчёт CarFax бесплатно' },
    ],
    titleBtn: 'Мне подходит',
    prise: 799,
    status: false,
  },
  {
    id: 3,
    title: 'Всё включено',
    content: [
      { id: 12, title: 'Включен "тариф стандартный"' },
      { id: 13, title: 'Дополнительные фото с порта' },
      {
        id: 14,
        title: ' Детализированные предложения по ремонту с партнёрских СТО',
      },
    ],
    titleBtn: 'Мне подходит',
    prise: 1200,
    status: false,
  },
]

const dataYearOld = [
  { id: 1, title: 'меньше 3х лет' },
  { id: 2, title: '3-5 лет' },
  { id: 3, title: '5-7 лет' },
  { id: 4, title: 'больше 7 лет' },
]

const dataTypeEngine = [
  { id: 1, title: 'Бензин/Дизель/Гибрид' },
  { id: 2, title: 'Электрический' },
]
const customsDutyRatesYearOld = [
  {
    id: '0-3',
    rates: [
      { prise: '0-8.5', rate: 2.5, interest: 54 },
      { prise: '8.501-16.7', rate: 3.5, interest: 48 },
      { prise: '16.701-42.3', rate: 5.5, interest: 48 },
      { prise: '42.301-84.5', rate: 15, interest: 48 },
      { prise: '84.501-169', rate: 20, interest: 48 },
      { prise: '169.001-1000', rate: 20, interest: 48 },
    ],
  },
  {
    id: '4-5',
    rates: [
      { volume: '0-1', rate: 1.5 },
      { volume: '1.001-1.5', rate: 1.7 },
      { volume: '1.501-1.8', rate: 2.5 },
      { volume: '1.801-2.3', rate: 2.7 },
      { volume: '2.301-3', rate: 3 },
      { volume: '3.001-100', rate: 3.6 },
    ],
  },
  {
    id: '5-100',
    rates: [
      { volume: '0-1', rate: 3 },
      { volume: '1.001-1.5', rate: 3.2 },
      { volume: '1.501-1.8', rate: 3.5 },
      { volume: '1.801-2.3', rate: 4.8 },
      { volume: '2.301-3', rate: 5 },
      { volume: '3.001-100', rate: 5.7 },
    ],
  },
]

const btnShowBid = [
  { id: 'Текущая', status: false, link: '/pre-Bid' },
  { id: 'На утверждении', status: false, link: '/contrPrice' },
  { id: 'Архив', status: false, link: '/arhivePreBid' },
]

const defaultSetting = [
  { id: 1, name: 'Статус' },
  { id: 2, name: 'Дата' },
  { id: 3, name: 'Марка/Модель' },
  { id: 4, name: 'VIN' },
  { id: 5, name: 'Тип' },
  { id: 6, name: 'Имя Фамилия' },
  { id: 7, name: 'Город' },
  { id: 8, name: 'Аукцион' },
  { id: 9, name: 'Buyer' },
  { id: 10, name: 'Лот' },
  { id: 11, name: 'Порт' },
  { id: 12, name: 'Оплата' },
  { id: 13, name: '№ контейнера' },
  { id: 14, name: 'POD date' },
  { id: 15, name: 'Дата поступления в порт' },
  { id: 16, name: 'Наличие документов' },
  { id: 17, name: 'Действие' },
]

const initialValueIdSetting = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
]

const btnShowAuto = [
  { id: 'Авто', status: true, link: '/' },
  { id: 'Транспорт', status: false, link: '/shipping-finance' },
  { id: 'Финансы', status: false, link: '/auction-finance' },
  { id: 'Документы', status: false, link: '/documents' },
  { id: 'Платежи', status: false, link: '/payments' },
  { id: 'Drops', status: false, link: '/drops' },
  { id: 'Фото', status: false, link: '/pictures' },
  { id: 'Уведомление', status: false, link: '/' },
  { id: 'Аукцион', status: false, link: '/' },
]

const dataInfoCon = [
  { id: 'Контейнера', status: true, link: '/containers/container' },
  { id: 'Погрузка', status: false, link: '/containers/loading' },
  { id: 'Неразобранные', status: false, link: '/containers/unconfirm' },
  { id: 'Архив', status: false, link: '/containers/archive' },
]

const dataInfoArchive = [
  { id: 'Архив', status: true, link: '/archiveTransport' },
  { id: 'Удаленные', status: false, link: '/removedTransport' },
]

const btnShowBlockCredentials = [
  { id: '+ Добавить новый доступ', status: false },
  { id: '+ Редактировать доступы для назначения', status: false },
  { id: '+ Назначить доступ пользователю', status: false },
  { id: 'Доступы в работе', status: false },
]
const btnShowBlockProfile = [
  { id: 'Данные Пользователя', status: false },
  { id: 'Доступы', status: false },
  { id: 'Кошельки', status: false },
  { id: 'Пользовательские соглашения', status: false },
]

const dataParams = [
  {
    id: 1,
    title: 'client_secret',
    option: [
      { id: 1, data: 'XsCXIvC6CF6tGLSqWN7e7juDAe0DNeJBQ54JbH07' },
      { id: 2, data: 'Wl7e9mmh0fynhhW5Uqy88yrHHmlqFgiF1ywgDgBK' },
    ],
  },
  {
    id: 2,
    title: 'echo_key',
    option: [
      { id: 1, data: '46bc884436548e12bb05' },
      { id: 2, data: '8f07b6b68cba727124ea' },
    ],
  },
  {
    id: 3,
    title: 'client_id',
    option: [
      { id: 1, data: 6 },
      { id: 2, data: 4 },
    ],
  },
  {
    id: 4,
    title: 'backRequest',
    option: [
      { id: 1, data: 'https://autoru.neonface.by' },
      { id: 2, data: 'https://api.autobroker.by' },
    ],
  },
  {
    id: 5,
    title: 'backRequestDoc',
    option: [
      { id: 1, data: 'https://autoru.neonface.by/public' },
      { id: 2, data: 'https://api.autobroker.by' },
    ],
  },
]

const typeLevel = [
  { id: 1, title: 'Класс А' },
  { id: 2, title: 'Класс B' },
  { id: 3, title: 'Класс C' },
]

const InitialValueRatesFree = {
  type_level_id: 1,
  order_from: 0,
  order_to: 0,
  sum: 0,
  date_from: '',
  date_to: '',
}

const constTitleAuction = [
  { id: 1, title: 'ТС' },
  { id: 2, title: 'Тех характеристики' },
  { id: 3, title: 'Аукцион' },
  { id: 4, title: 'Перевозка' },
  { id: 5, title: 'Финансы' },
]

const activeUsers = [
  { id: 0, title: 'Активность' },
  { id: 1, title: 'Да' },
  { id: 2, title: 'Нет' },
]

const paramsFinanceDefault = {
  cost_price: 0,
  auto_price: 0,
  shipping_price: 0,
  start_price: 0,
  min_price: 0,
  now_price: 0,
  step_price: '',
  status_sale: 1,
  status_order_id: 3,
}

const paramsTsDefault = {
  year: '',
  denomination: '',
  vin: '',
  type_ts: '',
  type_document: '',
  transport_brand: '',
  transport_model: '',
}

const paramsSpecificationsDefault = {
  engine: '',
  fuel: '',
  drive: '',
  transmission: '',
  odometer: '',
  keys: 0,
  state: '',
  equipment: '',
  calculation_system_id: '',
}

const paramsAuctionDefault = {
  auction: '',
  buyer: '',
  lot: '',
  location: '',
}

const paramsShippingDefault = {
  number_container: '',
  sea_line: '',
  port: '',
  arrival_warehouse: '',
  date_arrival: '',
}

const documentsArray = [
  { id: 1, title: 'Республика Беларусь' },
  { id: 2, title: 'Другая' },
]

const variantPayFinance = [
  { id: 0, title: 'Выберите способ оплаты', status: false },
  { id: 1, title: 'Компании', status: false },
  { id: 2, title: 'Перевозчика', status: false },
  { id: 3, title: 'Кошелек', status: false },
]

const walletsVariant = [
  { id: 1, name: 'Аукцион', status: true },
  { id: 2, name: 'Перевозка', status: false },
]

const dataTargetLink = `https://autobroker.by/auth_data/${sessionStorage.getItem(
  'access_token'
)}`

const staticData = [
  { id: '1', title: 'Автомобили', icon: Shield, link: '/', role: true },
  {
    id: '2',
    title: 'Контейнера',
    icon: OneColumn,
    link: '/containers/container',
    role: { keyTitle: 'container', id: 88 },
  },

  {
    id: '3',
    title: 'Калькулятор',
    icon: MagicIcon,
    role: [],
    children: [
      {
        id: '3-1',
        title: 'Дилер',
        icon: Shield,
        link: '/calculator/dealers',
        role: true,
      },
      {
        id: '3-2',
        title: 'Клиент',
        icon: Shield,
        link: '/calculator/clients',
        role: true,
      },
    ],
  },
  {
    id: '4',
    title: 'Пользователи',
    icon: Shield,
    role: [
      { keyTitle: 'masters', id: 4 },
      { keyTitle: 'masterfinance', id: 73 },
      { keyTitle: 'logist', id: 79 },
      { keyTitle: 'office', id: 8 },
      { keyTitle: 'dealer', id: 12 },
      { keyTitle: 'archive', id: 90 },
    ],
    children: [
      { id: '4-1', title: 'Админ', link: null, role: null },
      {
        id: '4-2',
        title: 'Мастер финансов',
        link: '/mastersfinances',
        role: { keyTitle: 'masterfinance', id: 73 },
      },
      {
        id: '4-3',
        title: 'Мастер перевозки',
        link: '/logist',
        role: { keyTitle: 'logist', id: 79 },
      },
      {
        id: '4-4',
        title: 'Офис',
        role: [{ keyTitle: 'office', id: 8 }],
        children: [
          { id: '4-4-1', title: 'Розница служба', link: '/office', role: true },
          ,
          {
            id: '4-4-2',
            title: 'Дилерская служба',
            link: '/officeDealers',
            role: true,
          },
        ],
      },
      {
        id: '4-5',
        title: 'Дилеры',
        link: '/dealers',
        role: { keyTitle: 'dealer', id: 12 },
      },
      { id: '4-6', title: 'Субпользователь', link: '/subusers', role: true },
      {
        id: '4-7',
        title: 'В архиве',
        link: '/archive',
        role: { keyTitle: 'archive', id: 90 },
      },
    ],
  },

  {
    id: '5',
    title: 'Контрагенты',
    icon: UserInfo,
    role: [],
    children: [
      {
        id: '5-1',
        title: 'Перевозка',
        role: [],

        children: [
          {
            id: '5-1-1',
            title: 'Место покупки / отправления (place of origin)',
            link: '/placeOfOrigin/variant/',
            role: true,
          },
          {
            id: '5-1-2',
            title: 'Порт назначения (port of destination)',
            link: '/portOfDestination/variant/',
            role: true,
          },
          {
            id: '5-1-3',
            title: 'Место назначения (final destination)',
            link: '/finalDestination/variant/',
            role: true,
            // /carter
          },
        ],
      },

      {
        id: '5-2',
        title: 'Платежные инстументы',
        role: [{ keyTitle: 'cash_account', id: 95 }],
        children: [
          {
            id: '5-2-1',
            title: 'Компании-посредники',
            link: '/agent',
            role: true,
          },
          {
            id: '5-2-2',
            title: 'Компании-перевозчики',
            link: '/carter',
            role: true,
          },
          {
            id: '5-2-3',
            title: 'Компании-агенты',
            link: '/listOfAgents',
            role: true,
          },
          {
            id: '5-3',
            title: 'Иные инструменты',
            role: [],
            children: [
              {
                id: '5-3-1',
                title: 'Крипта ',
                link: '/wallets/crypto',
                role: true,
              },
              {
                id: '5-3-2',
                title: 'Иная форма',
                link: '/wallets/cashAll',
                role: true,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: '6',
    title: 'AG Logistic',
    icon: PushMessageIcon,
    role: [
      { keyTitle: 'fee_rates', id: 84 },
      { keyTitle: 'fee_rates', id: 86 },
    ],
    children: [
      {
        id: '6-1',
        title: 'Inland rate (origin)',
        link: '/aglogistic/inlandrates',
        role: { keyTitle: 'fee_rates', id: 84 },
      },
      {
        id: '6-2',
        title: 'Sea shipment rate',
        link: '/aglogistic/searatesconsolidation',
        role: { keyTitle: 'fee_rates', id: 84 },
      },
      {
        id: '6-3',
        title: 'Inland rate (destination)',
        link: '/aglogistic/destination',
        role: { keyTitle: 'fee_rates', id: 84 },
      },
      {
        id: '6-4',
        title: 'Service fee (AG Logisctis fee)',
        link: '/aglogistic/fee_rates',
        role: { keyTitle: 'fee_rates', id: 86 },
      },
    ],
  },

  {
    id: '7',
    title: 'Финансы',
    icon: CouponIcon,

    children: [
      {
        id: '7-1',
        title: 'Кошельки',
        role: [
          { keyTitle: 'cash_account', id: 93 },
          { keyTitle: 'cash_account', id: 94 },
        ],
        children: [
          {
            id: '7-1-1',
            title: 'Площадка (Аукцион)',
            link: '/wallets/auctions',
            role: { keyTitle: 'cash_account', id: 93 },
          },

          {
            id: '7-1-2',
            title: 'Перевозчик (место покупки)',
            link: '/wallets/shipping',
            role: { keyTitle: 'cash_account', id: 94 },
          },
          {
            id: '7-1-3',
            title: 'Локальные перевозчики',
            link: '/wallets/carter',
            role: true,
          },

          {
            id: '7-1-4',
            title: ' Агент в порту',
            link: '/wallets/agentPortOfDestination',
            role: true,
          },

          {
            id: '7-1-6',
            title: 'Крипта',

            link: '/wallets/crypto',
            role: { keyTitle: 'cash_account', id: 94 },
          },
          {
            id: '7-1-7',
            title: 'Иная форма',
            link: '/wallets/cashAll',
            role: true,
          },
        ],
      },
      // {
      //   id: '7-2',
      //   title: 'Rates / fees',
      //   link: null,
      //   role: null,
      // },
      // {
      //   id: '7-3',
      //   title: 'Внутренний платеж',
      //   link: '/wallets/cashAll',
      //   role: { keyTitle: 'cash_account', id: 95 },
      // },
    ],
  },

  {
    id: '8',
    title: 'Сервиска',
    icon: GearCircleIcon,
    role: [
      { keyTitle: 'assign_permissions', id: 105 },
      { keyTitle: 'location', id: 108 },
      { keyTitle: 'assign_permissions', id: 61 },
    ],
    children: [
      {
        id: '8-1',
        title: 'Транспорт',

        role: true,
        children: [
          {
            id: '8-1-1',
            title: 'Место покупки (place of origin) (POOr)',
            // link: '/place-destinations',
            role: { keyTitle: 'location', id: 108 },
            children: [
              // {
              //   id: '8-1-1-1',
              //   title: 'Аукционы',
              //   link: '/listofAutions',
              //   role: { keyTitle: 'location', id: 108 },
              // },
              // {
              //   id: '8-1-1-2',
              //   title: 'Локации',
              //   link: '/location',
              //   role: { keyTitle: 'location', id: 108 },
              // },
              {
                id: '8-1-1-2',
                title: 'Затраты места покупок',
                link: '/costs/purchase-point',
                role: { keyTitle: 'location', id: 108 },
              },
            ],
          },
          {
            id: '8-1-2',
            title: 'Порт погрузки (port of loading)  (POL)',
            link: null,
            role: false,
            children: [
              {
                id: '8-1-2-1',
                title: 'Порт погрузки',
                link: '/portOfLoading',
                role: true,
              },
              {
                id: '8-1-2-2',
                title: 'Затраты порта погрузки',
                link: '/costs/loading-port',
                role: true,
              },
            ],
          },
          {
            id: '8-1-3',
            title: 'Порт назначения (port of destination) (POD)',
            // link: '/destinations',
            role: { keyTitle: 'location', id: 108 },
            children: [
              {
                id: '8-1-3-1',
                title: 'Порт назначения',
                link: '/destinations',
                role: true,
              },
              {
                id: '8-1-3-2',
                title: 'Затраты порта назначения',
                link: '/costs/destination-port',
                role: true,
              },
            ],
          },

          {
            id: '8-1-4',
            title: 'Место назначения (place of destination) (PlOD)',
            // link: '/place-destinations',
            children: [
              {
                id: '8-1-4-1',
                title: 'Место назначения',
                link: '/place-destinations',
                role: true,
              },
              {
                id: '8-1-4-2',
                title: 'Затраты места назначения',
                link: '/costs/destination',
                role: true,
              },
            ],
            // role: { keyTitle: 'location', id: 108 },
          },
        ],
      },

      {
        id: '8-2',
        title: 'Списки',
        role: true,
        children: [
          {
            id: '8-2-1',
            title: 'Страны',
            link: '/listOfCountries',
            role: true,
          },
          {
            id: '8-2-2',
            title: 'Порты',
            link: '/ports',
            role: true,
          },
          {
            id: '8-2-3',
            title: 'Площадки / аукционы',
            link: '/listofAutions',
            role: { keyTitle: 'location', id: 108 },
          },
          {
            id: '8-2-4',
            title: 'Локации',
            link: '/location',
            role: { keyTitle: 'location', id: 108 },
          },
          {
            id: '8-2-5',
            title: 'Контрагенты',
            link: '/counterparty',
            role: true,
          },
          /*{
            id: '8-2-5',
            title: 'Контрагенты',
            link: '/counterparty',
            role: true,
          },*/
        ],
      },
      {
        id: '8-3',
        title: 'Общие настройки',
        role: true,
        children: [
          {
            id: '8-3-1',
            title: 'Калькулятор',
            link: '/setting',
            role: true,
          },
          {
            id: '8-3-2',
            title: 'Марки',
            link: '/services/brands-models',
            role: { keyTitle: 'assign_permissions', id: 105 },
          },

          {
            id: '8-3-3',
            title: 'Способы оплаты',
            link: '/paymentMethod',
            role: true,
          },
          {
            id: '8-3-4',
            title: 'Роли',
            link: '/assign-permissions-to-roles',
            role: { keyTitle: 'assign_permissions', id: 61 },
          },
          {
            id: '8-3-5',
            title: 'Доступы',
            link: '/credentials',
            role: true,
          },
          {
            id: '8-3-6',
            title: 'Импорт контейнеров',
            link: '/containers/import',
            role: true,
          },
        ],
      },
    ],
  },

  {
    id: '9',
    title: 'Аукцион',
    icon: WavePoint,
    role: [{ keyTitle: 'pre-bid', id: 104 }],
    children: [
      {
        id: '9-1',
        title: 'Pre-bid',
        link: '/pre-Bid',
        role: { keyTitle: 'pre-bid', id: 104 },
      },
      {
        id: '9-2',
        title: 'Купить',
        link: dataTargetLink,
        role: true,
      },
      {
        id: '9-3',
        title: 'Продать',
        link: '/auctions-inSale',
        role: true,
      },
    ],
  },
]

const arrayPort = [
  { id: 3, name: 'UAB AEC', value: 3, linkName: 'ports', nameCash: 'ports' },
]

const dataAdd = [
  { id: 1, title: 'место покупки / отправления (place of origin)' },
  { id: 2, title: 'место назначения (final destination)' },
  { id: 3, title: 'порт назначения (port of destination)' },
  { id: 4, title: 'порт погрузки (port of loading)  (POL)' },
]

const typeList = [
  { id: 2, name: 'Транспорт' },
  { id: 3, name: 'Платежные инструменты' },
  { id: 4, name: 'Агент в порту назначения' },
]

const typeTransportation = [
  { id: 1, name: 'По суши до порта прибытия', type: 'buyed' },
  { id: 2, name: 'Локальная перевозка', type: 'destination' },
  { id: 3, name: 'По морю', type: 'buyed' },
  { id: 4, name: 'Агент в порту назначения', type: 'destination' },
  { id: 5, name: 'Агент по порт прибытия' },
]

const role = ['office', 'dealer', 'logist', 'finance', 'admin']

export {
  btnInfo,
  formInvoiceArray,
  btnInfoInvoice,
  addSelectArray,
  btnShow,
  btnShowPay,
  payUserArray,
  variantPayArray,
  bankTransitArray,
  dataInfo,
  dataYearOld,
  dataTypeEngine,
  customsDutyRatesYearOld,
  btnShowBid,
  defaultSetting,
  initialValueIdSetting,
  btnShowAuto,
  dataInfoCon,
  btnShowBlockCredentials,
  dataParams,
  typeLevel,
  InitialValueRatesFree,
  constTitleAuction,
  dataInfoArchive,
  paramsFinanceDefault,
  paramsTsDefault,
  paramsSpecificationsDefault,
  paramsAuctionDefault,
  paramsShippingDefault,
  activeUsers,
  documentsArray,
  variantPayFinance,
  btnShowBlockProfile,
  walletsVariant,
  staticData,
  dataTargetLink,
  ratesData,
  arrayPort,
  dataAdd,
  typeList,
  typeTransportation,
  role,
}
