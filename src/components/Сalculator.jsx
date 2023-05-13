import React, { useState, useContext, useEffect } from 'react'
import ContextApp from '../context/contextApp'
import { SelectPicker } from 'rsuite'
import { postRequest, getRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions.js'
import ModalCustomsPayments from './ModalCustomsPayments'
import ModalChoosePackage from './ModalChoosePackage'
import Smile from '../assets/smile.png'
import { useParams } from 'react-router-dom'

const Сalculator = () => {
  const { state, dispatch } = useContext(ContextApp)
  const [docFeesArray, setDocFeesArray] = useState([])
  const [docFeesValue, setDocFeesValue] = useState('')
  const [locationsArray, setLocationsArray] = useState([])
  const [locationsSelect, setLocationsSelect] = useState(0)

  const [finishArray, setFinishArray] = useState([])
  const [finishSelect, setFinishSelect] = useState(0)
  const [transportTypeArray, setTransportTypeArray] = useState([])
  const [transportTypeSelect, setTransportTypeSelect] = useState(0)
  const [auctionArray, setAuctionArray] = useState([])
  const [auctionSelect, setAuctionSelect] = useState(0)
  const [currentUrlId, setCurrentUrlId] = useState('')
  const [portName, setPortName] = useState([])

  const [evCheck, setEvCheck] = useState(false)
  const [threeAutoCheck, setThreeAutoCheck] = useState(false)

  const [customsPay, setCustomsPay] = useState(false)
  const [choosePackage, setChoosePackage] = useState(false)
  const { forName } = useParams()

  const [isModalCustomsPayments, setIsModalCustomsPayments] = useState(false)
  const [isModalShowchoosePackage, setIsModalShowchoosePackage] =
    useState(false)

  const [blockCurrentClick, setBlockCurrentClick] = useState('')
  const [ObjectPay, setObjectPay] = useState({})
  const [allPriseCustoms, setAllPriseCustoms] = useState('')

  const currentClickBlock = (val) => {
    setBlockCurrentClick(val)
  }

  const [portNameArray, setPortNameArray] = useState([])
  const [portNameSelect, setPortNameSelect] = useState('')

  useEffect(() => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAuctionArray(res.auction)
        setAuctionSelect(JSON.stringify(res.auction[0]))

        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ auctions: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ size: 1 }))
    getRequest('/api/v1/transport-size', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        dispatch(showLoder({ size: 0 }))
        let filter = res.transportSizes.filter((el) => el.id < 11)

        setTransportTypeArray(filter)
        setTransportTypeSelect(filter[0].id)
        dispatch(showLoder({ size: 0 }))
      })
      .catch((err) => {
        setTransportTypeArray([])
        setTransportTypeSelect('')
        dispatch(showLoder({ size: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])

  useEffect(() => {
    if (auctionSelect) {
      dispatch(showLoder({ calculatorLocations: 1 }))
      getRequest(
        `/api/v1/locations-calculator?limit=1000&auction_id=${
          JSON.parse(auctionSelect).id
        }`,
        {
          Authorization: `Bearer ${window.sessionStorage.getItem(
            'access_token'
          )}`,
        }
      )
        .then((res) => {
          setLocationsArray(res.locations)
          setLocationsSelect(res.locations[0].id)
          // getPortNameFunc(res.locations)
          dispatch(showLoder({ calculatorLocations: 0 }))
        })
        .catch((err) => {
          dispatch(showLoder({ calculatorLocations: 0 }))
          //state.createNotification('Успешно обновлено!', 'error')
        })
    }
    return () => {
      setLocationsArray([])
      setPortName([])
    }
  }, [auctionSelect])

  useEffect(() => {
    if (locationsSelect) getPortNameFunc(locationsArray)
  }, [locationsSelect])

  const getPortNameFunc = (val) => {
    if (locationsSelect !== 0) {
      val.filter(
        (elem) => elem.id === locationsSelect && setPortName(elem.port_name)
      )
    }
  }

  useEffect(() => {
    dispatch(showLoder({ carriers: 1 }))
    getRequest('/api/v1/carriers', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        res.carriers.map(
          (elem) => elem.code === 'aec' && setCurrentUrlId(elem.id)
        )
        dispatch(showLoder({ carriers: 0 }))
      })

      .catch((err) => {
        dispatch(showLoder({ carriers: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])

  useEffect(() => {
    if (currentUrlId) {
      dispatch(showLoder({ carrierId: 1 }))
      getRequest(
        `/api/v1/rates-fees/doc-fees?carrier_id=${currentUrlId}&limit=1000`,
        {
          Authorization: `Bearer ${window.sessionStorage.getItem(
            'access_token'
          )}`,
        }
      )
        .then((res) => {
          setDocFeesArray(res.docFees)
          setDocFeesValue(JSON.stringify(res.docFees[0]))
          dispatch(showLoder({ carrierId: 0 }))
        })

        .catch((err) => {
          dispatch(showLoder({ carrierId: 0 }))
          //state.createNotification('Успешно обновлено!', 'error')
        })
    }
    return () => {
      setDocFeesArray([])
      setDocFeesValue('')
    }
  }, [currentUrlId])

  useEffect(() => {
    dispatch(showLoder({ destinations: 1 }))
    getRequest('/api/v1/destinations', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFinishArray(res.destinations)
        setFinishSelect(res.destinations[0].id)
        dispatch(showLoder({ destinations: 0 }))
      })

      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ destinations: 0 }))
      })
  }, [])

  let params = {
    auction_id: auctionSelect && +JSON.parse(auctionSelect).id,
    transport_size_id: +transportTypeSelect,
    location_id: +locationsSelect,
    destination_id: +finishSelect,
    port_id: portNameSelect,
  }

  useEffect(() => {
    if (
      auctionSelect &&
      transportTypeSelect &&
      locationsSelect &&
      finishSelect &&
      portNameSelect
    ) {
      dispatch(showLoder({ calculatorClients: 1 }))

      postRequest(
        `/api/v1/calculator/${
          document.location.pathname !== '/calculator/clients'
            ? 'dealer'
            : 'client'
        }`,
        params
      )
        .then((res) => {
          setObjectPay(res)

          dispatch(showLoder({ calculatorClients: 0 }))
        })
        .catch((err) => {
          setObjectPay({})
          dispatch(showLoder({ calculatorClients: 0 }))
        })
    }
  }, [
    auctionSelect,
    transportTypeSelect,
    locationsSelect,
    finishSelect,
    portNameSelect,
    forName,
  ])

  const getAllPrise = () => {
    let prise = 100
    if (Object.keys(ObjectPay).length > 0) {
      prise += ObjectPay.inlandRatesPrice + ObjectPay.seaRatesPrice
    }
    if (evCheck) {
      prise += 175
    }
    if (threeAutoCheck) {
      prise += 375
    }
    if (docFeesValue && JSON.parse(docFeesValue).price != 0) {
      prise += +JSON.parse(docFeesValue).price
    }
    return prise
  }

  const customsPayProps = (val) => {
    return setAllPriseCustoms(val)
  }

  useEffect(() => {
    if (locationsArray.length > 0) {
      if (locationsSelect !== null) {
        locationsArray.filter((elem) => {
          if (elem.id === locationsSelect) {
            setPortNameArray(elem.ports)
            setPortNameSelect(elem.ports[0].id)
          }
        })
      } else {
        setPortNameArray([])
        setPortNameSelect('')
      }
    }
  }, [locationsArray, locationsSelect])

  return (
    <div className="itemContainer">
      <ModalChoosePackage
        isVisible={isModalShowchoosePackage}
        onClose={() => setIsModalShowchoosePackage(false)}
        currentClickBlock={currentClickBlock}
        blockCurrentClick={blockCurrentClick}
      />

      <ModalCustomsPayments
        isVisible={isModalCustomsPayments}
        onClose={() => setIsModalCustomsPayments(false)}
        customsPayProps={customsPayProps}
      />

      <div className="itemContainer-inner">
        <div className="top-item" style={{ paddingLeft: state.width }}>
          <div className="btnTransport">
            {/* <h1 className='titleInfo'>Калькулятор</h1> */}
          </div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          <div className="blockShowOrHide">
            <div
              className="dropBlock--inner"
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <div className="dropBlockContent">
                <h4 className="titleInfo">Введите данные</h4>
                <label>
                  <span className="classModal">Платформа</span>
                  {auctionArray.length > 0 ? (
                    <select
                      value={auctionSelect}
                      onChange={(event) => setAuctionSelect(event.target.value)}
                    >
                      {auctionArray.map((elem) => {
                        return (
                          <option
                            key={elem.id + elem.name}
                            value={JSON.stringify(elem)}
                          >
                            {elem.name}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    'Нет данных!'
                  )}
                </label>
                <div
                  className="selectCustom selectCustom--space"
                  style={{
                    visibility: locationsArray.length > 0 ? 'visible' : 'none',
                  }}
                >
                  <span className="classModal">Локация</span>

                  <SelectPicker
                    id="selectCustomId"
                    data={locationsArray}
                    valueKey="id"
                    labelKey="name"
                    value={locationsSelect}
                    onChange={setLocationsSelect}
                    placeholder="Выберите площадку"
                    loading={!locationsArray.length}
                  />
                </div>

                <label>
                  <span className="classModal">Порт погрузки:</span>

                  {portNameArray.length > 0 ? (
                    <select
                      value={portNameSelect}
                      onChange={(event) =>
                        setPortNameSelect(event.target.value)
                      }
                    >
                      {portNameArray.map((el) => {
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
                  <span className="classModal">Тип ТС</span>

                  {transportTypeArray.length > 0 ? (
                    <select
                      value={transportTypeSelect}
                      onChange={(event) =>
                        setTransportTypeSelect(event.target.value)
                      }
                    >
                      {transportTypeArray.map((elem) => {
                        return (
                          <option key={elem.id} value={elem.id}>
                            {elem.name}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    'Нет данных!'
                  )}
                </label>

                <label>
                  <span className="classModal">Куда везём</span>
                  {finishArray.length > 0 ? (
                    <select
                      value={finishSelect}
                      onChange={(event) => setFinishSelect(event.target.value)}
                    >
                      {finishArray.map((elem) => {
                        return (
                          <option key={elem.id} value={elem.id}>
                            {elem.title}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    'Нет данных!'
                  )}
                </label>

                <label>
                  <span className="classModal">Документ</span>

                  {docFeesArray.length > 0 ? (
                    <select
                      value={docFeesValue}
                      onChange={(event) => setDocFeesValue(event.target.value)}
                    >
                      {docFeesArray.map((elem) => {
                        return (
                          <option key={elem.id} value={JSON.stringify(elem)}>
                            {elem.title}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    'Нет данных!'
                  )}
                </label>

                <div className="helpCheckbox">
                  <span>EV/Hybrid</span>
                  <input
                    type="checkbox"
                    value={evCheck}
                    onChange={() => {
                      setEvCheck(!evCheck)
                    }}
                  />
                </div>

                <div className="helpCheckbox">
                  <span>Три авто в контейнере</span>
                  <input
                    type="checkbox"
                    value={threeAutoCheck}
                    onChange={() => {
                      setThreeAutoCheck(!threeAutoCheck)
                    }}
                  />
                </div>

                <div className="partInfo">
                  <p>
                    *величина является расчётной и может изменяться в
                    зависимости от условий на рынке перевозки
                  </p>
                </div>
              </div>
              <div className="dropBlockContent">
                <h4 className="titleInfo">Результат</h4>
                <label
                  style={{ justifyContent: 'space-between', margin: '10px 0' }}
                >
                  <span className="classModal">Доставка по США</span>
                  <span className="resPrise">
                    {ObjectPay && ObjectPay.inlandRatesPrice
                      ? ObjectPay.inlandRatesPrice + '$'
                      : 0 + '$'}
                  </span>
                </label>

                <label
                  style={{ justifyContent: 'space-between', margin: '10px 0' }}
                >
                  <span className="classModal">Доставка море</span>
                  <span className="resPrise">
                    {ObjectPay && ObjectPay.seaRatesPrice
                      ? ObjectPay.seaRatesPrice + '$'
                      : 0 + '$'}
                  </span>
                </label>
                {evCheck && (
                  <label
                    style={{
                      justifyContent: 'space-between',
                      margin: '10px 0',
                    }}
                  >
                    <span className="classModal">Доплата за EV/Hybrid</span>
                    <span className="resPrise">175$</span>
                  </label>
                )}

                <label
                  style={{ justifyContent: 'space-between', margin: '10px 0' }}
                >
                  <span className="classModal">Wire Fee</span>
                  <span className="resPrise">100$</span>
                </label>
                {threeAutoCheck && (
                  <label
                    style={{
                      justifyContent: 'space-between',
                      margin: '10px 0',
                    }}
                  >
                    <span className="classModal">
                      Доплата за 3 авто в контейнере
                    </span>
                    <span className="resPrise">375$</span>
                  </label>
                )}

                {docFeesValue && JSON.parse(docFeesValue).price != 0 && (
                  <label
                    style={{
                      justifyContent: 'space-between',
                      margin: '10px 0',
                    }}
                  >
                    <span className="classModal">Доп. за документы:</span>
                    <span className="resPrise">
                      {Number(JSON.parse(docFeesValue).price).toFixed(0) + '$'}
                    </span>
                  </label>
                )}

                <label
                  style={{ justifyContent: 'space-between', margin: '10px 0' }}
                >
                  <h4>Итого:</h4>
                  <span className="resPrise">{getAllPrise() + '$'}</span>
                </label>

                <label
                  style={{ justifyContent: 'space-between', margin: '10px 0' }}
                >
                  <h4>Таможенные платежи</h4>
                  <span>
                    {allPriseCustoms && customsPay ? allPriseCustoms : '-'}
                  </span>
                </label>
                <div className="helpCheckbox">
                  {/* <Checkbox /> */}
                  <input
                    type="checkbox"
                    value={customsPay}
                    onChange={(e) => {
                      setCustomsPay(!customsPay)

                      !customsPay && setIsModalCustomsPayments(true)
                    }}
                  />
                  <span>Таможенные платежи</span>
                </div>

                <div className="helpCheckbox">
                  <input
                    type="checkbox"
                    value={choosePackage}
                    onChange={(e) => {
                      setChoosePackage(!choosePackage)
                      !choosePackage && setIsModalShowchoosePackage(true)
                    }}
                  />
                  <span>Выбрать пакет услуг</span>
                </div>

                {docFeesValue && JSON.parse(docFeesValue).additional && (
                  <div className="infoDocBlock">
                    <p>{JSON.parse(docFeesValue).additional}</p>
                  </div>
                )}

                <div className="blockInfo">
                  <p>
                    Транзитный порт <span>{portName}</span>
                  </p>
                  <div className="smile">
                    <p>Удачи на торгах!</p>
                    <img src={Smile} width="40px" height="40px" alt="smile" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Сalculator
