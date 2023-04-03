import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLinkType, getDateFunc } from '../helper.js'

const NoticeInner = ({ dataAray, type_notification, toastClick }) => {
  const navigate = useNavigate()
  const [viewControler, setViewControler] = useState([])
  const [flagClickRole, setFlagClickRole] = useState(false)

  useEffect(() => {
    if (viewControler.length > 0 && type_notification) {
      const { title, roleId } = getLinkType(type_notification)

      if (roleId.length > 0) {
        roleId.forEach((el) => {
          if (viewBlock(el)) {
            sessionStorage.setItem('curLink', title)
            setFlagClickRole(true)
          }
        })
      }
    } else {
      sessionStorage.removeItem('curLink')
      setFlagClickRole(false)
    }
  }, [type_notification, viewControler])

  const clickLink = ({ id, status_shipping }) => {
    return () => {
      if (flagClickRole) {
        navigate(
          id && status_shipping.id
            ? `/auction-transport/edit/${id}/editTransport/${status_shipping.id}`
            : `/auction-transport/edit/${id}`
        )
      } else {
        toastClick('У вас нет прав для перехода!')
      }
    }
  }

  // const getDateFunc = (val) => {
  //   let date = new Date(val)
  //   let year = String(date.toLocaleDateString()).split('.')[2]
  //   let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  //   let dayRes = String(date.toLocaleDateString()).split('.')[0]
  //   return dayRes + '-' + mouthRes + '-' + year
  // }

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )

  let controlRoleView = () => {
    if (
      Object.keys(
        JSON.parse(window.sessionStorage.getItem('access_rights'))
      ).includes('auto')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).auto.access_rights

      setViewControler(initialValue)
    }
  }

  let viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  // //Расчет цены за лот

  // const dataResultPriseLot = (prise) => {
  //   let res = 0

  //   if (prise.paymentInformation.length > 0) {
  //     prise.paymentInformation.map((elem) => {
  //       if (+elem.payment_by === 0) {
  //         res += elem.confirm_price ? elem.confirm_price : 0
  //       }
  //     })
  //   } else {
  //     res = 0
  //   }
  //   return (res - Number(prise.price ? prise.price : 0)).toFixed(2)
  // }
  // //Расчет цены за контейнер
  // const dataResultPriseContainer = (prise) => {
  //   let res = 0
  //   if (prise.paymentInformation.length > 0) {
  //     prise.paymentInformation.map((elem) => {
  //       if (+elem.payment_by === 1) {
  //         res += elem.confirm_price ? elem.confirm_price : 0
  //       }
  //     })
  //   } else {
  //     res = 0
  //   }
  //   return (
  //     res -
  //     Number(prise.financeInformation ? prise.financeInformation.ag_price : 0)
  //   ).toFixed(2)
  // }

  return (
    <tr className="positonTr">
      <td colSpan="20">
        {dataAray && dataAray.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Марка/Модель</th>
                <th>VIN</th>
                <th>Тип</th>
                <th>Имя Фамилия</th>
                <th>Город</th>
                <th>Аукцион</th>
                <th>Buyer</th>
                <th>Лот</th>
                <th>Порт</th>
                <th>Место</th>
                <th> Оплата</th>
                <th> Номер контейнера</th>
                <th>POD date</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {dataAray.map((el) => {
                return (
                  <tr key={el.id}>
                    <td onClick={clickLink(el)}>
                      {getDateFunc(el.created_at)}
                    </td>
                    <td onClick={clickLink(el)}>{el.transport_name}</td>
                    <td onClick={clickLink(el)}>{el.vin.slice(11)}</td>
                    <td onClick={clickLink(el)}>{el.buyer_role.title}</td>
                    <td onClick={clickLink(el)}>
                      {el.user[0].second_name_ru + ' ' + el.user[0].name_ru}
                    </td>
                    <td onClick={clickLink(el)}>{el.destination.title}</td>
                    <td onClick={clickLink(el)}>{el.auction.name}</td>
                    <td onClick={clickLink(el)}>{el.credential.buyerCode}</td>
                    <td onClick={clickLink(el)}>{el.lot}</td>
                    <td onClick={clickLink(el)}>{el.port.name}</td>
                    <td onClick={clickLink(el)}>{el.destination.title}</td>
                    <td onClick={clickLink(el)}>
                      <span>Не потверждена</span>
                    </td>
                    <td onClick={clickLink(el)}>
                      {el.hasOwnProperty('shippingInformation') &&
                      el.shippingInformation.number_container
                        ? el.shippingInformation.number_container
                        : '-'}
                    </td>
                    <td onClick={clickLink(el)}>
                      {/*{el.shippingInformation.date_city !== null
                        ? getDestinationsFunc(JSON.parse(el.shippingInformation.date_city))
                        : ''}*/}
                    </td>

                    <td onClick={clickLink(el)}>
                      {/* {titleRates === 'Кошельки: Перевозка'
                        ? dataResultPriseContainer(el)
                        : dataResultPriseLot(el)} */}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <span>Нет информации по автомобилю!</span>
        )}
      </td>
    </tr>
  )
}
export default NoticeInner
