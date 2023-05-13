// import { dataTargetLink } from './const'
import { toast } from 'react-toastify'

const getLinkType = (val) => {
  const nameTypeRus = (item) => {
    switch (item) {
      case 'general':
        return { title: 'Авто', roleId: [43] }
      case 'shipping':
        return { title: 'Транспорт', roleId: [46] }
      case 'finance':
        return { title: 'Финансы', roleId: [49, 50] }
      case 'document':
        return { title: 'Документы', roleId: [53] }
      case 'payment':
        return { title: 'Платежи', roleId: [56] }

      default:
        return ''
    }
  }

  return nameTypeRus(val)
}
const controlNumber = (item) => {
  const dataValue = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
  let value = item.replace(',', '.')
  let res = ''

  if (item) {
    if (dataValue.includes(value.at(-1))) {
      if (value.at(-1) == '.') {
        const countPoint = value.split('').filter((item) => item === '.').length

        if (countPoint === 1) res = value
        else {
          res = value.slice(0, value.length - 1)
        }
      } else {
        if (value.split('.')[1]) {
          if (value.split('.')[1].split('').length <= 2) res = value
          else {
            res = value.slice(0, value.length - 1)
          }
        } else {
          res = value
        }
      }
    } else {
      res = value.slice(0, value.length - 1)
    }
  } else {
    res = ''
  }
  return res
}

const titleCurrentLink = (val) => {
  switch (val) {
    case '/auctions-transports':
    case '/':
      return 'Автомобили'

    case '/archiveTransport':
      return 'Авто в архиве'
    case '/removedTransport':
      return 'Удаленные авто'

    case '/auctions-transportsNotAll':
      return 'Неразобранные автомобили'
    case '/auctions-inSale':
      return 'Автомобили в продаже'

    case '/calculator/dealers':
    case '/calculator/clients':
      return 'Калькулятор'

    case '/aec/inlandrates':
      return 'Aec: Inland Rates'

    case '/aec/searatesconsolidation':
      return 'Aec: Sea Rates'

    case '/aec/docfees':
      return 'Aec: Doc Fees'

    case '/auto_universe/inlandrates':
      return 'Auto Universe: Inland Rates'

    case '/auto_universe/searatesconsolidation':
      return 'Auto Universe: Sea Rates'

    case '/auto_universe/docfees':
      return 'Auto Universe: Doc Fees'

    case '/aglogistic/inlandrates':
      return 'Ag Logistic: Inland Rates'

    case '/aglogistic/searatesconsolidation':
      return 'Ag Logistic: Sea Rates'

    case '/aglogistic/docfees':
      return 'Ag Logistic: Doc Fees'

    case '/aglogistic/fee_rates':
      return 'Ag Logistic: Fee Rates'

    case '/wallets/auctions':
      return 'Кошельки: Аукцион'

    case '/wallets/shipping':
      return 'Кошельки: Перевозка'

    case '/wallets/agent':
      return 'Кошельки: Посредники'
    case '/wallets/crypto':
      return 'Кошельки: Крипта'
    case '/wallets/cashAll':
      return 'Кошельки: Наличные'

    case '/masters':
      return 'Пользователи: мастер'

    case '/masters/create':
      return 'Добавить мастера'

    case '/mastersfinances':
      return 'Пользователи: мастер финансов'

    case '/mastersfinances/create':
      return 'Добавить мастера финансов'

    case '/logist':
      return 'Пользователи: мастер перевозки'

    case '/logist/create':
      return 'Добавить мастера перевозки'

    case '/office':
      return 'Офис: Розница'
    case '/officeDealers':
      return 'Офис: Дилерская служба'

    case '/office/create':
      return 'Добавить офис: Розница'
    case '/officeDealers/create':
      return 'Добавить офис: Дилерская служба'

    case '/dealers':
      return 'Пользователи: дилер'
    case '/dealers/create':
      return 'Добавить дилера'

    case '/subusers/create':
      return 'Добавить субпользователя'

    case '/subusers':
      return 'Субпользователь'

    case '/archive':
      return 'Пользователи: в архиве'

    case '/agent':
      return 'Посредники'
    case '/listOfCountries':
      return 'Список стран'

    case '/carrier':
      return 'Перевозчик'
    case '/carter':
      return 'Перевозчики'

    case '/credentials':
      return 'Назначение доступов'

    case '/services/brands-models':
      return 'Марки'

    case '/assign-permissions-to-roles':
      return 'Назначение прав ролям'

    case '/location':
      return 'Локация'
    case '/destinations':
      return 'Порт назначения'
    case '/place-destinations':
      return 'Место назначения'

    case '/pre-Bid':
    case '/contrPrice':
      return 'Pre-bid'

    case '/arhivePreBid':
      return 'Архив'
    case '/portOfLoading':
      return 'Порт погрузки'

    case '/setting':
      return 'Общие настройки'

    case '/placeOfOrigin/variant/':
      return 'Место покупки / отправления (place of origin)'
    case '/portOfDestination/variant/':
      return 'Порт назначения (port of destination)'
    case '/finalDestination/variant/':
      return 'Место назначения (final destination)'
    case '/listofAutions':
      return 'Аукционы'
    case '/paymentMethod':
      return ' Способ оплаты'

    case '/ports':
      return 'Список портов'
    case '/counterparty':
      return 'Список контрагентов'

    default:
      switch (val.split('/')[1]) {
        case 'agentProfile':
        case 'carterProfile':
          return ' Профиль'

        case 'costs':
          switch (val.split('/')[2]) {
            case 'destination':
              return 'Затраты места назначения'

            case 'destination-port':
              return 'Затраты порта назначения'
            case 'purchase-point':
              return 'Затраты места покупок'
            case 'loading-port':
              return 'Затраты порта погрузки'
          }

        case 'agentAddProfile':
          return 'Добавить посредника'
        case 'carterAddProfile':
          return 'Добавить перевозчика'

        case 'noticeTransport':
          return 'Уведомление'
        case 'profileUser':
          return 'Профиль пользователя'
        case 'masters':
          return val.split('/')[3] === 'edit' && 'Редактирование мастера'

        case 'mastersfinances':
          return (
            val.split('/')[3] === 'edit' && 'Редактирование мастера финансов'
          )

        case 'logist':
          return (
            val.split('/')[3] === 'edit' && 'Редактирование мастера перевозки'
          )

        case 'officeDealers':
          return (
            val.split('/')[3] === 'edit' &&
            'Редактирование офиса: Дилерская служба'
          )
        case 'office':
          return val.split('/')[3] === 'edit' && 'Редактирование офиса: Розница'
        case 'dealers':
          return val.split('/')[3] === 'edit' && 'Редактирование дилера'

        case 'subusers':
          return (
            val.split('/')[3] === 'edit' && 'Редактирование субпользователя'
          )

        case 'auction-transport':
          return val.split('/')[2] === 'edit' && 'Редактирование автомобиля'
        case 'containers':
        case 'uncontainers':
          switch (val.split('/')[2]) {
            case 'import':
              return 'Импорт контейнеров'

            default:
              return val.split('/')[3] === 'info'
                ? 'Детальная страница контейнера'
                : 'Контейнера'
          }
      }
  }
}

const valuePosition = (val, pathCurrent) => {
  let res
  let boll =
    pathCurrent === '/removedTransport' || pathCurrent === '/archiveTransport'
      ? 165
      : 140
  if (val) {
    res = val * 45.5 + boll
  } else {
    res = 190
  }
  return res
}
//Расчет цены за контейнер
const dataResultPriseContainer = (prise) => {
  let res = 0
  if (prise.paymentInformation.length > 0) {
    const filterPayment_by = prise.paymentInformation.filter(
      (el) => +el.payment_by === 1
    )

    if (filterPayment_by.length > 0) {
      filterPayment_by.map((el) => (res += el.confirm_price))
      // res += elem.confirm_price
    } else {
      return 'Уточняется'
    }
  } else {
    return 'Уточняется'
  }
  return Math.round(
    res -
      Number(prise.financeInformation ? prise.financeInformation.ag_price : 0)
  )
}

const getDestinationsFunc = (val, klaipedaArray) => {
  let find = val.filter((elem) => klaipedaArray.id === elem.destination_id)

  return find.length > 0 ? find[0].date.split('-').reverse().join('-') : ''
}

const statusValue = (pathCurrent) => {
  let res
  if (pathCurrent === '/archiveTransport') res = [5]
  else if (pathCurrent === '/auctions-transportsNotAll') res = [1]
  else if (pathCurrent === '/auctions-inSale') res = [4]
  else res = [2, 3, 4]
  return res
}

const getDateFunc = (val) => {
  let date = val ? new Date(val) : new Date()

  let year = String(date.toLocaleDateString()).split('.')[2]
  let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  let dayRes = String(date.toLocaleDateString()).split('.')[0]
  return year + '-' + mouthRes + '-' + dayRes
}

//Расчет цены за лот
const dataResultPriseLot = (prise) => {
  let res = 0
  if (prise.paymentInformation.length > 0) {
    prise.paymentInformation.map((elem) => {
      if (+elem.payment_by === 0) {
        res += elem.confirm_price ? elem.confirm_price : 0
      }
    })
  } else {
    res = 0
  }
  return Math.round(res - Number(prise.price ? prise.price : 0))
}
// const testFunc = (array) => {
//   console.log(array)
//   for (let index = 0; index < array.length; index++) {
//     for (let j = index + 1; j < array.length; j++) {
//       if (array[index][0] == array[j][0]) {
//         array[index] = {
//           [array[index][0]]: array[index][1] + array[j][1],
//         }
//         array[j] = ''
//       }
//     }
//   }

//   return array.filter((el) => el[0])
// }

const controlWidth = (expanded, openKeys) => {
  let width = 0
  if (expanded) {
    if (openKeys.length > 0 && openKeys.includes('5')) {
      width = 310
      if (openKeys.includes('5-1')) {
        width = 410
      }
    } else if (openKeys.includes('8-1')) {
      width = 450
    } else if (
      openKeys.includes('8') ||
      openKeys.includes('7') ||
      openKeys.includes('6')
    ) {
      width = 310
    } else {
      width = 210
    }
  }
  return width
}

const viewPorts = (val) => {
  let res = []
  if (val && val.length > 0) val.map((el) => res.push(el.name))
  return res.length > 0 ? res.join(', ') : '-'
}
const viewDestinations = (val) => {
  let res = []
  if (val && val.length > 0) val.map((el) => res.push(el.title))
  return res.length > 0 ? res.join(', ') : '-'
}

const dataView = (place_destination, destination) => {
  if (place_destination && destination) {
    return `порт: ${destination.title}, место: ${place_destination.title}`
  } else if (destination && !place_destination) {
    return `порт: ${destination.title}`
  } else if (!destination && place_destination) {
    return `место: ${place_destination.title}`
  } else {
    return '-'
  }
}
const dataViewInland = (place_destination, destination) => {
  if (place_destination && destination) {
    return `${destination} - ${place_destination}`
  } else if (destination && !place_destination) {
    return `${destination}`
  } else if (!destination && place_destination) {
    return `${place_destination}`
  } else {
    return '-'
  }
}

const connect = (val) => {
  let res = []
  if (val.length > 0) {
    val.map((item) => res.push(item.id))

    return res.join(',')
  } else return '-'
}

const connectTitle = (val) => {
  let res = []
  if (val.length > 0) {
    val.map((item) => {
      if (!res.includes(item.destination.title))
        res.push(`${item.destination.title}`)
    })

    return res.join(',')
  } else return '-'
}
const controlCheck = (pdpSelectDefault, pdpSelect) => {
  let res
  if (pdpSelectDefault.length > pdpSelect.length) {
    const findRes = pdpSelectDefault.filter((item) => !pdpSelect.includes(item))
    res = { status: false, value: findRes }
  } else if (pdpSelectDefault.length < pdpSelect.length) {
    const findRes = pdpSelect.filter((item) => !pdpSelectDefault.includes(item))
    res = { status: true, value: findRes }
  }
  return res ? res : []
}
const controlIdPdp = (dataCarters) => {
  let findfindArrayPdt = []
  dataCarters.destinationPlaceDestinations.map((item) => {
    findfindArrayPdt.push(item.id)
  })
  return findfindArrayPdt.length > 0 ? findfindArrayPdt : []
}
const controlIdDestination = (dataCarters) => {
  let findfindArrayPdt = []
  dataCarters.destinationPlaceDestinations.map((item) => {
    findfindArrayPdt.push(item.destination_id)
  })
  return findfindArrayPdt.length > 0 ? findfindArrayPdt : []
}

const createNotification = (message, type) => {
  const options = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }
  switch (type) {
    case 'success':
      toast.success(message, options)
      break
    case 'warning':
      toast.warn(message, options)
      break
    case 'error':
      toast.error(message, options)
      break
    case 'info':
      toast.info(message, options)
      break
    default:
      toast.info(message, options)
      break
  }
}
const controlTitle = (id, item) => {
  if (item) {
    switch (id) {
      case 1:
        return item.title

      case 2:
        return item.name

      case 3:
        return item.name
      case 4:
        return item.name

      default:
        break
    }
  }
}

export {
  getLinkType,
  titleCurrentLink,
  controlNumber,
  valuePosition,
  dataResultPriseContainer,
  getDestinationsFunc,
  statusValue,
  getDateFunc,
  dataResultPriseLot,
  controlWidth,
  // testFunc,
  viewPorts,
  dataView,
  connect,
  controlCheck,
  controlIdPdp,
  dataViewInland,
  createNotification,
  viewDestinations,
  connectTitle,
  controlTitle,
  controlIdDestination,
}
