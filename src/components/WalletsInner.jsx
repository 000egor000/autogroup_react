import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../base/api-request'

import { Pagination } from 'rsuite'
// import PropTypes from 'prop-types'

import { getDateFunc } from '../helper'

const WalletsInner = ({ dataAray, nameAndSecondName, titleRates }) => {
  const [klaipedaArray, setKlaipedaArray] = useState([])
  const [mainArray, setMainArray] = useState([])

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState(0)
  const navigate = useNavigate()

  // const getDestinationsFunc = (val) =>
  // 	klaipedaArray.id &&
  // 	val
  // 		.filter((elem) => klaipedaArray.id === elem.destination_id)[0]
  // 		.date.split('-')
  // 		.reverse()
  // 		.join('-')

  useEffect(() => {
    getRequest('/api/v1/destinations', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setKlaipedaArray(
          ...res.destinations.filter((elem) => elem.title === 'Клайпеда')
        )
      })
      .catch((err) => {})
  }, [])

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }
  useEffect(() => {
    dataAray !== null && paramsPagination()
  }, [page])

  const paramsPagination = () => {
    setMainArray(
      dataAray.general_information.slice(limit * (page - 1), limit * page)
    )
    setPaginationValue(dataAray.general_information.length)
  }

  // const getDateFunc = (val) => {
  //   let date = new Date(val)
  //   let year = String(date.toLocaleDateString()).split('.')[2]
  //   let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  //   let dayRes = String(date.toLocaleDateString()).split('.')[0]
  //   return dayRes + '-' + mouthRes + '-' + year
  // }

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
    return (res - Number(prise.price ? prise.price : 0)).toFixed(2)
  }
  //Расчет цены за контейнер
  const dataResultPriseContainer = (prise) => {
    let res = 0
    if (prise.paymentInformation.length > 0) {
      prise.paymentInformation.map((elem) => {
        if (+elem.payment_by === 1) {
          res += elem.confirm_price ? elem.confirm_price : 0
        }
      })
    } else {
      res = 0
    }
    return (
      res -
      Number(prise.financeInformation ? prise.financeInformation.ag_price : 0)
    ).toFixed(2)
  }

  return (
    <tr className="positonTr">
      <td colSpan="20">
        {dataAray !== null ? (
          <React.Fragment>
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
                {mainArray.map((el) => {
                  return (
                    <tr key={el.id}>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {getDateFunc(el.created_at)}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.transport_name}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.vin.slice(11)}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.buyer_role.title}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {nameAndSecondName
                          ? nameAndSecondName
                          : el.user[0].second_name_ru +
                            ' ' +
                            el.user[0].name_ru}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.destination.title}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.auction.name}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.credential.buyerCode}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.lot}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.port.name}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.destination.title}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        <span>Не потверждена</span>
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {el.shippingInformation !== null
                          ? el.shippingInformation.number_container
                          : '-'}
                      </td>
                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {/*{el.shippingInformation.date_city !== null
													? getDestinationsFunc(JSON.parse(el.shippingInformation.date_city))
													: ''}*/}
                      </td>

                      <td
                        onClick={() => {
                          navigate(
                            el.id && el.status_shipping.id
                              ? `/auction-transport/edit/${el.id}/editTransport/${el.status_shipping.id}`
                              : `/auction-transport/edit/${el.id}`
                          )
                        }}
                      >
                        {titleRates === 'Кошельки: Перевозка'
                          ? dataResultPriseContainer(el)
                          : dataResultPriseLot(el)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="paginationBlock">
              <Pagination
                prev
                next
                ellipsis
                maxButtons={5}
                size="xs"
                layout={['total', 'pager']}
                total={paginationValue}
                limitOptions={[20]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>
          </React.Fragment>
        ) : (
          <span>Нет информации по автомобилю!</span>
        )}
      </td>
    </tr>
  )
}
export default WalletsInner
