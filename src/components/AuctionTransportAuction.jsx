import React, { useContext, useEffect, useState } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { showLoder } from '../reducers/actions'
import { getRequest, putRequest } from '../base/api-request'
import ContextApp from '../context/contextApp'
import { useParams } from 'react-router-dom'
import {
  constTitleAuction,
  paramsFinanceDefault,
  paramsTsDefault,
  paramsSpecificationsDefault,
  paramsAuctionDefault,
  paramsShippingDefault,
} from '../const'

import { controlNumber } from '../helper'

import { Modal, Checkbox } from 'rsuite'

const AuctionTransportAutoCreate = () => {
  const [transportFuels, setTransportFuels] = useState([])
  const [transportTransmissions, setTransportTransmissions] = useState([])
  const [transportDrives, setTransportDrives] = useState([])
  const [transportHighlights, setTransportHighlights] = useState([])
  const [defaultParams, setDefaultParams] = useState({})
  const [isModalClose, setIsModalClose] = useState(false)
  const [calculationSystemsArray, setCalculationSystemsArray] = useState([])
  const pathCurrent = window.location.pathname
  const { state, dispatch } = useContext(ContextApp)
  const { id } = useParams()
  const [paramsFinance, setParamsFinance] = useState(paramsFinanceDefault)
  const [paramsTs, setParamsTs] = useState(paramsTsDefault)
  const [paramsSpecifications, setParamsSpecifications] = useState(
    paramsSpecificationsDefault
  )
  const [{ auction, buyer, lot, location }, setParamsAuction] =
    useState(paramsAuctionDefault)
  const [
    { number_container, sea_line, port, arrival_warehouse, date_arrival },
    setParamsShipping,
  ] = useState(paramsShippingDefault)

  const getAuctionData = (id) => {
    dispatch(showLoder({ getAuctionData: 1 }))
    getRequest(`/api/v1/order/transport-auto`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        let result = res.general_information.find((el) => +el.id === +id)

        if (result.id) {
          fillData(result)
          setDefaultParams(result)
        }
        dispatch(showLoder({ getAuctionData: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getAuctionData: 0, status: err.status }))
      })
  }

  useEffect(() => {
    getAuctionData(id)
  }, [])

  useEffect(() => {
    dispatch(showLoder({ fuel: 1 }))
    getRequest(`/api/v1/transport-fuel`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setTransportFuels(res.transportFuels)
        setParamsSpecifications({
          ...paramsSpecifications,
          fuel: res.transportFuels[0].id,
        })
        dispatch(showLoder({ fuel: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ fuel: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ systems: 1 }))
    getRequest(`/api/v1/calculation-systems`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCalculationSystemsArray(res.calculationSystems.odometer)
        setParamsSpecifications({
          ...paramsSpecifications,
          calculation_system_id: res.calculationSystems.odometer[0].id,
        })

        // setCalculationSystemsSelect(res.calculationSystems.odometer[0].id)

        dispatch(showLoder({ systems: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ systems: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ transmission: 1 }))
    getRequest(`/api/v1/transport-transmission`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setTransportTransmissions(res.transportTransmissions)

        setParamsSpecifications({
          ...paramsSpecifications,
          transmission: res.transportTransmissions[0].id,
        })
        dispatch(showLoder({ transmission: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ transmission: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ drive: 1 }))
    getRequest(`/api/v1/transport-drive`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setTransportDrives(res.transportDrives)

        setParamsSpecifications({
          ...paramsSpecifications,
          drive: res.transportTransmissions[0].id,
        })
        dispatch(showLoder({ drive: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ drive: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ highlight: 1 }))
    getRequest(`/api/v1/transport-highlight`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setTransportHighlights(res.transportHighlights)

        setParamsSpecifications({
          ...paramsSpecifications,
          highlight: res.transportHighlights[0].id,
        })
        dispatch(showLoder({ highlight: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ highlight: 0, status: err.status }))
      })
  }, [])
  const myRound10 = (val) => Math.ceil(val / 50) * 50

  const fillData = (val) => {
    if (val) {
      let allPrice = val.financeInformation
        ? val.financeInformation.ag_price + val.price
        : val.price

      setParamsAuction({
        auction: val.auction ? val.auction.name : auction,
        buyer: val.credential ? val.credential.buyerCode : buyer,
        lot: val.lot ? val.lot : lot,
        location: val.location ? val.location.name : location,
      })

      setParamsFinance({
        cost_price: myRound10(allPrice),
        auto_price: myRound10(val.price),
        shipping_price: val.financeInformation
          ? myRound10(val.financeInformation.ag_price)
          : 0,
        start_price: myRound10(allPrice + allPrice * 0.05),
        min_price: myRound10(
          allPrice + (allPrice * 0.1 > 300 ? allPrice * 0.1 : 300)
        ),
        now_price: myRound10(
          allPrice + (allPrice * 0.15 > 500 ? allPrice * 0.15 : 500)
        ),
        status_order_id: val.status_order ? val.status_order.id : 3,
      })
      setParamsSpecifications({
        engine: val.engine ? val.engine : paramsSpecifications.engine,
        equipment: val.equipment
          ? val.equipment
          : paramsSpecifications.equipment,
        odometer: val.odometer ? val.odometer : paramsSpecifications.odometer,
        fuel: val.transportFuel
          ? val.transportFuel.id
          : paramsSpecifications.fuel,
        drive: val.transportDrive
          ? val.transportDrive.id
          : paramsSpecifications.drive,
        transmission: val.transportTransmission
          ? val.transportTransmission.id
          : paramsSpecifications.engine,
        highlight: val.transportHighlight
          ? val.transportHighlight.id
          : paramsSpecifications.engine,
        keys: val.keys,
        calculation_system_id: val.calculationSystem
          ? val.calculationSystem.id
          : paramsSpecifications.calculation_system_id,
      })

      setParamsShipping({
        number_container: val.shippingInformation
          ? val.shippingInformation.number_container
          : number_container,
        sea_line: val.seaLine ? val.seaLine.title : sea_line,
        port: val.port ? val.port.name : port,
        arrival_warehouse: val.destination
          ? val.destination.title
          : arrival_warehouse,
        date_arrival: val.shippingInformation
          ? val.shippingInformation.date_arrival
          : date_arrival,
      })

      setParamsTs({
        year: val.year ? val.year : paramsTs.year,
        denomination: val.transport_name ? val.transport_name : paramsTs.brand,
        vin: val.vin ? val.vin : paramsTs.vin,
        type_ts: val.transport_type
          ? val.transport_type.name
          : paramsTs.type_ts,
        type_document: val.doc_fee ? val.doc_fee.title : paramsTs.type_document,
        transport_brand: val.transport_brand
          ? val.transport_brand.name
          : paramsTs.transport_brand,
        transport_model: val.transport_model
          ? val.transport_model.name
          : paramsTs.transport_model,
      })
    }
  }

  const setValue = (e = null) => {
    let paramsEdit = {
      engine: paramsSpecifications.engine,
      equipment: paramsSpecifications.equipment,
      odometer: paramsSpecifications.odometer,
      transport_fuel_id: paramsSpecifications.fuel,
      transport_drive_id: paramsSpecifications.drive,
      transport_transmission_id: paramsSpecifications.transmission,
      calculation_system_id: paramsSpecifications.calculation_system_id,
      transport_highlight_id: paramsSpecifications.highlight,
      keys: paramsSpecifications.keys,
      start_price: paramsFinance.start_price,
      min_price: paramsFinance.min_price,
      now_price: paramsFinance.now_price,
      status_sale: e,
    }

    const updateSale = () => {
      dispatch(showLoder({ updateSale: 1 }))
      putRequest(`/api/v1/order/transport-auto/updateSale/${id}`, paramsEdit)
        .then((res) => {
          getAuctionData(id)
          state.createNotification('Успешно обновлено!', 'success')

          setIsModalClose(false)
          dispatch(showLoder({ updateSale: 0 }))
        })
        .catch((err) => {
          setIsModalClose(false)
          state.createNotification('Что-то пошло не так!', 'error')

          dispatch(showLoder({ updateSale: 0, status: err.status }))
        })
    }

    if (typeof e === 'boolean') {
      if (
        +paramsFinance.start_price <= +defaultParams.start_price ||
        +paramsFinance.min_price <= +defaultParams.min_price
      ) {
        if (
          //Тех характеристики
          number_container &&
          sea_line &&
          port &&
          arrival_warehouse &&
          date_arrival &&
          //Перевозка
          paramsSpecifications.engine &&
          paramsSpecifications.fuel &&
          paramsSpecifications.drive &&
          paramsSpecifications.transmission &&
          paramsSpecifications.odometer &&
          paramsSpecifications.keys &&
          paramsSpecifications.highlight &&
          paramsSpecifications.equipment
        ) {
          updateSale()
        } else {
          setIsModalClose(true)
        }
      } else {
        state.createNotification(
          'Заполните стартовую и минимальную цену продажи!',
          'error'
        )
      }
    } else {
      updateSale()
    }
  }

  const updatePredSale = () => {
    dispatch(showLoder({ updatePredSale: 1 }))
    putRequest(`/api/v1/order/transport-auto/updatePredSale/${id}`)
      .then((res) => {
        getAuctionData(id)

        setIsModalClose(false)
        dispatch(showLoder({ updatePredSale: 0 }))
      })
      .catch((err) => {
        setIsModalClose(false)
        state.createNotification('Что-то пошло не так!', 'error')

        dispatch(showLoder({ updatePredSale: 0, status: err.status }))
      })
  }

  useEffect(() => {
    getAuctionData(id)
  }, [id])

  const changeField = ({ title, value }) => {
    switch (title) {
      case constTitleAuction[0].title:
        setParamsTs({ ...paramsTs, ...value })
        break
      case constTitleAuction[1].title:
        setParamsSpecifications({ ...paramsSpecifications, ...value })
        break

      case constTitleAuction[4].title:
        setParamsFinance({ ...paramsFinance, ...value })
        break

      default:
        break
    }
  }

  const controlRoleView = () => {
    let bollean = false
    if (
      pathCurrent.split('/')[1] === 'archiveTransport' ||
      pathCurrent.split('/')[1] === 'removedTransport'
    )
      bollean = true

    if (defaultParams.id && defaultParams.status_order.code !== 'pred-sale')
      bollean = true

    return bollean
  }

  return (
    <div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalClose}
          onClose={() => setIsModalClose(false)}
        >
          <Modal.Header>
            <Modal.Body>
              Транспорт не может быть выставлен на аукцион. Не заполнены все
              обязательные поля!
            </Modal.Body>
          </Modal.Header>
        </Modal>
      </div>

      {defaultParams.id && defaultParams.status_order.code === 'new' ? (
        <button
          type="submit"
          className="btn-success-preBid btn-auto"
          style={{ width: 'fit-content' }}
          onClick={() => updatePredSale()}
        >
          Заявить лот на продажу
        </button>
      ) : (
        <div className="contentBlockTop">
          <div className="dropBlockContent">
            <div>
              <h2>{constTitleAuction[0].title}</h2>
              <label>
                <span>Наименование</span>
                <input
                  type="text"
                  placeholder="Наименование"
                  value={paramsTs.denomination}
                  disabled
                />
              </label>

              <label>
                <span>Марка</span>
                <input
                  type="text"
                  placeholder="Марка"
                  value={paramsTs.transport_brand}
                  disabled
                />
              </label>

              <label>
                <span>Модель</span>
                <input
                  type="text"
                  placeholder="Марка"
                  value={paramsTs.transport_model}
                  disabled
                />
              </label>
              <label>
                <span>Год </span>
                <input
                  type="text"
                  placeholder="Год"
                  value={paramsTs.year}
                  disabled
                />
              </label>

              <label>
                <span>VIN</span>
                <input
                  type="text"
                  placeholder="VIN"
                  value={paramsTs.vin}
                  disabled
                />
              </label>
              <label>
                <span>Тип ТС</span>
                <input
                  type="text"
                  placeholder="Тип ТС"
                  value={paramsTs.type_ts}
                  disabled
                />
              </label>
              <label>
                <span>Тип документа</span>
                <input
                  type="text"
                  placeholder="Тип документа"
                  value={paramsTs.type_document}
                  disabled
                />
              </label>
            </div>
            <div>
              <h2>{constTitleAuction[1].title}</h2>
              <label>
                <span>Объем*</span>
                <input
                  type="text"
                  placeholder="Объем"
                  value={paramsSpecifications.engine}
                  disabled={controlRoleView()}
                  onChange={(e) =>
                    changeField({
                      title: constTitleAuction[1].title,
                      value: { engine: controlNumber(e.target.value) },
                    })
                  }
                  onBlur={(e) => setValue()}
                  required
                />
              </label>
              <label>
                <span>Топливо*</span>
                {transportFuels.length > 0 ? (
                  <select
                    value={paramsSpecifications.fuel}
                    disabled={controlRoleView()}
                    onChange={(e) =>
                      changeField({
                        title: constTitleAuction[1].title,
                        value: { fuel: +e.target.value },
                      })
                    }
                    required
                    onBlur={(e) => setValue()}
                  >
                    {transportFuels.map((el) => {
                      return (
                        <option key={el.id} value={el.id}>
                          {el.name}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  'Нет данных!'
                )}
              </label>

              <label>
                <span>Привод*</span>
                {transportDrives.length > 0 ? (
                  <select
                    value={paramsSpecifications.drive}
                    disabled={controlRoleView()}
                    onChange={(e) =>
                      changeField({
                        title: constTitleAuction[1].title,
                        value: { drive: +e.target.value },
                      })
                    }
                    required
                    onBlur={(e) => setValue()}
                  >
                    {transportDrives.map((el) => {
                      return (
                        <option key={el.id} value={el.id}>
                          {el.name}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  'Нет данных!'
                )}
              </label>
              <label>
                <span>КПП*</span>
                {transportTransmissions.length > 0 ? (
                  <select
                    value={paramsSpecifications.transmission}
                    disabled={controlRoleView()}
                    onChange={(e) =>
                      changeField({
                        title: constTitleAuction[1].title,
                        value: { transmission: +e.target.value },
                      })
                    }
                    required
                    onBlur={(e) => setValue()}
                  >
                    {transportTransmissions.map((el) => {
                      return (
                        <option key={el.id} value={el.id}>
                          {el.name}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  'Нет данных!'
                )}
              </label>
              <label>
                <span>Пробег*</span>
                <div className="customOdometerGroup">
                  <input
                    type="text"
                    placeholder="Пробег"
                    value={paramsSpecifications.odometer}
                    disabled={controlRoleView()}
                    onChange={(e) =>
                      changeField({
                        title: constTitleAuction[1].title,
                        value: { odometer: controlNumber(e.target.value) },
                      })
                    }
                    onBlur={(e) => setValue()}
                    required
                  />

                  {calculationSystemsArray.length > 0 && (
                    <select
                      value={paramsFinance.calculation_system_id}
                      disabled={controlRoleView()}
                      onChange={(e) =>
                        changeField({
                          title: constTitleAuction[1].title,
                          value: { calculation_system_id: e.target.value },
                        })
                      }
                      onBlur={(e) => setValue()}
                      required
                    >
                      {calculationSystemsArray.map((el) => {
                        return (
                          <option key={el.id} value={el.id}>
                            {el.code}
                          </option>
                        )
                      })}
                    </select>
                  )}
                </div>
              </label>
              <label>
                <span>Ключи*</span>

                <Checkbox
                  checked={paramsSpecifications.keys}
                  disabled={controlRoleView()}
                  style={{ marginLeft: '-10px' }}
                  onChange={(e) => {
                    changeField({
                      title: constTitleAuction[1].title,
                      value: { keys: !paramsSpecifications.keys },
                    })
                  }}
                  required
                  onBlur={(e) => setValue()}
                />
              </label>

              <label>
                <span>Состояние*</span>
                {transportDrives.length > 0 ? (
                  <select
                    value={paramsSpecifications.highlight}
                    disabled={controlRoleView()}
                    onChange={(e) =>
                      changeField({
                        title: constTitleAuction[1].title,
                        value: { highlight: e.target.value },
                      })
                    }
                    required
                    onBlur={(e) => setValue()}
                  >
                    {transportHighlights.map((el) => {
                      return (
                        <option key={el.id} value={el.id}>
                          {el.name}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  'Нет данных!'
                )}
              </label>

              <label>
                <span>Комплектация</span>
                <input
                  type="text"
                  placeholder="Комплектация"
                  value={paramsSpecifications.equipment}
                  disabled={controlRoleView()}
                  onChange={(e) =>
                    changeField({
                      title: constTitleAuction[1].title,
                      value: { equipment: e.target.value },
                    })
                  }
                  onBlur={(e) => setValue()}
                />
              </label>
            </div>

            <div>
              <h2>{constTitleAuction[2].title}</h2>
              <label>
                <span>Название аукциона</span>
                <input
                  type="text"
                  placeholder="Название аукциона"
                  value={auction}
                  disabled
                />
              </label>
              <label>
                <span>Buyer</span>
                <input type="text" placeholder="Buyer" value={buyer} disabled />
              </label>
              <label>
                <span>Лот</span>
                <input type="text" placeholder="Лот" value={lot} disabled />
              </label>
              <label>
                <span>Локация</span>
                <input
                  type="text"
                  placeholder="Локация"
                  value={location}
                  disabled
                />
              </label>
            </div>
          </div>

          <div className="dropBlockContent">
            <div>
              <h2>{constTitleAuction[3].title}</h2>

              <label>
                <span>Номер контейнера*</span>
                <input
                  type="text"
                  placeholder="Номер контейнера"
                  value={number_container}
                  disabled
                />
              </label>

              <label>
                <span>Линия*</span>
                <input
                  type="text"
                  placeholder="Линия"
                  value={sea_line}
                  disabled
                />
              </label>

              <label>
                <span>Порт погрузки*</span>
                <input
                  type="text"
                  placeholder="Порт погрузки"
                  value={port}
                  disabled
                />
              </label>
              <label>
                <span>Место назначения*</span>
                <input
                  type="text"
                  placeholder="Место назначения"
                  value={arrival_warehouse}
                  disabled
                />
              </label>

              <label>
                <span>Дата доставки в порт назначения*</span>
                <input
                  type="text"
                  placeholder="Дата доставки в порт назначения"
                  value={date_arrival}
                  disabled
                />
              </label>
            </div>
            <div>
              <h2>{constTitleAuction[4].title}</h2>

              <label>
                <span> Стоимость доcтавки</span>
                <input
                  type="number"
                  placeholder="Cтоимость покупки"
                  value={paramsFinance.shipping_price}
                  disabled
                />
              </label>

              <label>
                <span>Cтоимость покупки</span>
                <input
                  type="number"
                  placeholder="Стоимость доcтавки"
                  value={paramsFinance.auto_price}
                  disabled
                />
              </label>

              <label style={{ visibility: 'hidden' }}>
                <span>Cтоимость покупки</span>
                <input
                  type="number"
                  placeholder="Cтоимость покупки"
                  value={paramsFinance.shipping_price}
                  disabled
                />
              </label>
              <label>
                <span>Себестоимость лота</span>
                <input
                  type="number"
                  placeholder="Себестоимость лота"
                  value={paramsFinance.cost_price}
                  disabled
                />
              </label>
              <label>
                <span>Cтартовая цена продажи</span>
                <input
                  type="text"
                  placeholder="стартовая цена продажи"
                  value={paramsFinance.start_price}
                  disabled={controlRoleView()}
                  onChange={(e) =>
                    changeField({
                      title: constTitleAuction[4].title,
                      value: { start_price: controlNumber(e.target.value) },
                    })
                  }
                  onBlur={(e) => setValue()}
                />
              </label>
              <label>
                <span>Минимальная цена продажи</span>
                <input
                  type="text"
                  placeholder="Минимальная цена продажи"
                  value={paramsFinance.min_price}
                  disabled={controlRoleView()}
                  onChange={(e) =>
                    changeField({
                      title: constTitleAuction[4].title,
                      value: { min_price: controlNumber(e.target.value) },
                    })
                  }
                  onBlur={(e) => setValue()}
                />
              </label>
              <label>
                <span>Цена Buy it now</span>
                <input
                  type="text"
                  placeholder="Цена Buy it now"
                  value={paramsFinance.now_price}
                  disabled={controlRoleView()}
                  onChange={(e) =>
                    changeField({
                      title: constTitleAuction[4].title,
                      value: { now_price: controlNumber(e.target.value) },
                    })
                  }
                  onBlur={(e) => setValue()}
                />
              </label>

              {pathCurrent.split('/')[1] !== 'archiveTransport' &&
                pathCurrent.split('/')[1] !== 'removedTransport' && (
                  <button
                    type="submit"
                    className="btn-success-preBid btn-auto"
                    style={{
                      display:
                        (defaultParams.id &&
                          defaultParams.status_order.code === 'pred-sale') ||
                        (defaultParams.id &&
                          defaultParams.status_order.code === 'sale')
                          ? 'flex'
                          : 'none',
                      width: 'fit-content',
                    }}
                    onClick={() =>
                      setValue(
                        defaultParams.id &&
                          defaultParams.status_order.code === 'pred-sale'
                          ? true
                          : false
                      )
                    }
                  >
                    {defaultParams.id &&
                    defaultParams.status_order.code === 'pred-sale'
                      ? 'Выставить на аукцион'
                      : 'Снять с аукциона'}
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AuctionTransportAutoCreate
