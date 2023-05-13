import React, { useState, useEffect, useRef, useContext, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, SelectPicker, Toggle } from 'rsuite'
import { Check, Close, Search, DocPass } from '@rsuite/icons'

import 'react-toastify/dist/ReactToastify.css'

import { postRequest, getRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp'

import { controlNumber } from '../helper'

const AuctionTransportAutoCreate = ({
  carrierArray,
  credentialsArray,
  // auctionArray,
  destinationsArray,
}) => {
  const [currentValueToggle, setCurrentValueToggle] = useState(false)

  const [currentUrlId, setCurrentUrlId] = useState('')
  const [docFeesArray, setDocFeesArray] = useState([])
  const [docFeesValue, setDocFeesValue] = useState('')

  //paramsToSave1

  const [countrySelect, setCountrySelect] = useState(0)
  const [dataCountries, setDataCountries] = useState([])
  const [auctionArray, setAuctionArray] = useState([])
  const [auctionSelect, setAuctionSelect] = useState(0)
  const [numberLot, setNumberLot] = useState('')
  const [locationsArray, setLocationsArray] = useState([])
  const [locationsSelect, setLocationsSelect] = useState('')
  // const [destinationsArray, setDestinationsArray] = useState([])
  const [destinationsSelect, setDestinationsSelect] = useState('')
  const [placeDestinationsSelect, setPlaceDestinationsSelect] = useState('')
  const [placeDestinationsArray, setPlaceDestinationsArray] = useState('')
  //paramsToSave2
  const [transportTypeArray, setTransportTypeArray] = useState([])
  const [transportTypeSelect, setTransportTypeSelect] = useState('')
  const [transportSizeArray, setTransportSizeArray] = useState([])
  const [transportSizeSelect, setTransportSizeSelect] = useState('')
  // let [portName, setPortName] = useState([])

  const [portNameArray, setPortNameArray] = useState([])
  const [portNameSelect, setPortNameSelect] = useState('')

  //paramsToSave3
  const [buyArray, setBuyArray] = useState([])
  const [buySelect, setBuySelect] = useState(0)
  const [listArray, setListArray] = useState([])
  const [listSelect, setlistSelect] = useState(0)
  const [codeArray, setCodeArray] = useState([])
  const [codeSelect, setCodeSelect] = useState(0)
  const [usersArray, setUsersArray] = useState([])
  const [absoluteArray, setAbsoluteArray] = useState([])

  const [showModalDefaultUsers, setShowModalDefaultUsers] = useState(false)
  const [dataParse, setDataParse] = useState({})
  const [nameAuto, setNameAuto] = useState('')
  const [year, setYear] = useState('')

  const [vin, setVin] = useState('')
  const [priceValue, setPriceValue] = useState('')

  const userCurrentRole = JSON.parse(window.sessionStorage.getItem('role')).code
  const userCurrentEmail = JSON.parse(
    window.sessionStorage.getItem('user')
  ).email

  const [dataOffice, setDataOffice] = useState([])

  // const [credentialsArray, setCredentialsArray] = useState({})
  const [statusSearchLot, setStatusSearchLot] = useState(true)
  const [statusTs, setStatusTs] = useState(false)

  const refFocus = useRef()
  const refFocusLot = useRef()
  const navigate = useNavigate()
  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    if (currentUrlId) {
      dispatch(showLoder({ docfees: 1 }))
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
          setDocFeesValue(+res.docFees[0].id)
          dispatch(showLoder({ docfees: 0 }))
        })

        .catch((err) => {
          //state.createNotification('Успешно обновлено!', 'error')
          dispatch(showLoder({ docfees: 0 }))
        })
    }
    return () => {
      setDocFeesArray([])
      setDocFeesValue('')
    }
  }, [currentUrlId])

  // useEffect(() => {
  //   dispatch(showLoder({ auctions: 1 }))
  //   getRequest('/api/v1/auctions', {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       setAuctionArray(res.auction)

  //       dispatch(showLoder({ auctions: 0 }))
  //     })
  //     .catch((err) => {
  //       dispatch(showLoder({ auctions: 0 }))
  //       //state.createNotification('Успешно обновлено!', 'error')
  //     })
  // }, [])
  // useEffect(() => {
  //   if (auctionArray.length > 0) {
  //     setAuctionSelect(JSON.stringify(auctionArray[0]))
  //   } else setAuctionSelect(0)
  // }, [auctionArray])

  //   useEffect(() => {
  //   if (countrySelect) {
  //     setAuctionSelect(JSON.stringify(countrySelect.[0]))
  //   } else setAuctionSelect(0)
  // }, [countrySelect])

  // useEffect(() => {
  //   if (dataCountries.length > 0) getAuctions()
  // }, [countrySelect])

  // const getAuctions = () => {
  //   dispatch(showLoder({ auctions: 1 }))
  //   getRequest('/api/v1/auctions', {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       let auctionsArr = res.auction.filter(
  //         (elem) => elem.country.id == JSON.parse(countrySelect).id
  //       )

  //       setAuctionArray(auctionsArr)

  //       dispatch(showLoder({ auctions: 0 }))
  //     })
  //     .catch((err) => {
  //       dispatch(showLoder({ auctions: 0 }))
  //       //state.createNotification('Успешно обновлено!', 'error')
  //     })
  // }
  // console.log(JSON.parse(countrySelect))

  useEffect(() => {
    if (carrierArray.length > 0)
      carrierArray.map(
        (elem) =>
          elem.code === 'aec' &&
          // elem.code === 'test'
          setCurrentUrlId(elem.id)
      )
  }, [carrierArray])

  useEffect(() => {
    if (destinationsArray.length > 0) {
      setDestinationsSelect(destinationsArray[0]['id'])
    }
  }, [destinationsArray])

  {
    /*useEffect(() => {
    if (placeDestinationsArray.length > 0) {
      setPlaceDestinationsSelect(placeDestinationsArray[0]['id'])
    }
  }, [placeDestinationsArray])*/
  }

  useEffect(() => {
    if (auctionSelect) {
      dispatch(showLoder({ locations: 1 }))
      getRequest(
        `/api/v1/locations?limit=1000&auction_id=${
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
          // getPortNameFunc(res.locations)
          dispatch(showLoder({ locations: 0 }))
        })
        .catch((err) => {
          setLocationsArray([])

          setPortNameSelect('')
          setPortNameArray([])
          // setPortName([])
          //state.createNotification('Успешно обновлено!', 'error')
          dispatch(showLoder({ locations: 0 }))
        })
    } else {
      setLocationsArray([])
    }
    return () => {
      setLocationsArray([])
      setPortNameSelect('')
      setPortNameArray([])
    }
  }, [auctionSelect])

  useEffect(() => {
    dispatch(showLoder({ offices: 1 }))
    getRequest('/api/v1/offices', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataOffice(res.offices)
        dispatch(showLoder({ offices: 0 }))
      })
      .catch(() => dispatch(showLoder({ offices: 0 })))
  }, [])

  useEffect(() => {
    dispatch(showLoder({ offices: 1 }))
    getRequest('/api/v1/countries', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterAray = res.countries.filter((item) => item.is_buyed)
        const filterArayDefault = filterAray.find((item) =>
          item.auctions.find((el) => el.is_default)
        )

        setDataCountries(filterAray)

        setCountrySelect(
          JSON.stringify(filterArayDefault ? filterArayDefault : filterAray[0])
        )
        dispatch(showLoder({ offices: 0 }))
      })
      .catch(() => dispatch(showLoder({ offices: 0 })))
  }, [])

  useEffect(() => {
    getAuctions(countrySelect)
  }, [countrySelect])

  const getAuctions = (val) => {
    const { auctions } = JSON.parse(val)

    if (auctions && auctions.length > 0) {
      const is_default = auctions.find(({ is_default }) => !!is_default)

      setAuctionArray(auctions)
      setAuctionSelect(
        is_default ? JSON.stringify(is_default) : JSON.stringify(auctions[0])
      )
    } else {
      setAuctionArray([])
      setAuctionSelect(0)
    }
  }

  useEffect(() => {
    dispatch(showLoder({ autotype: 1 }))
    getRequest('/api/v1/transport-type', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setTransportTypeArray(res.transportTypes)
        setTransportTypeSelect(JSON.stringify(res.transportTypes[0]))
        dispatch(showLoder({ autotype: 0 }))
      })
      .catch((err) => {
        setTransportTypeArray([])

        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ autotype: 0 }))
      })
  }, [])

  useEffect(() => {
    if (transportTypeSelect) {
      setTransportSizeArray(JSON.parse(transportTypeSelect).transportSizes)
      setTransportSizeSelect(
        JSON.parse(transportTypeSelect).transportSizes[0]['id']
      )
    }
    return () => {
      setTransportSizeArray([])
      setTransportSizeSelect(0)
    }
  }, [transportTypeSelect])

  useEffect(() => {
    if (credentialsArray[JSON.parse(auctionSelect).code]) {
      let resultArray = []
      let absoluteArray = []

      absoluteArray = credentialsArray[JSON.parse(auctionSelect).code]
      resultArray = credentialsArray[JSON.parse(auctionSelect).code].filter(
        (elem) => elem.users.length > 0
      )

      setAbsoluteArray(absoluteArray)
      setUsersArray(resultArray)
    } else return null

    return () => {
      setAbsoluteArray([])
      setUsersArray([])
    }
  }, [auctionSelect, credentialsArray])

  useEffect(() => {
    getBuyArray()

    return () => {
      setBuyArray([])
      setBuySelect(0)
    }
  }, [auctionSelect, usersArray])

  useEffect(() => {
    getListArray()

    return () => {
      setListArray([])
      setlistSelect(0)
    }
  }, [auctionSelect, buySelect, usersArray])

  useEffect(() => {
    getCodeArray()

    return () => {
      setCodeArray([])
      setCodeSelect(0)
    }
  }, [auctionSelect, buySelect, listSelect, absoluteArray])

  const getBuyArray = () => {
    let usersContain = []

    if (userCurrentRole !== 'office') {
      if (usersArray.length > 0) {
        usersArray.map((elem) =>
          elem.users.map((elemChaild) => {
            if (userCurrentRole === 'dealer') {
              return elemChaild.userRoleCode == userCurrentRole
                ? usersContain.push(
                    JSON.stringify({
                      userRoleId: elemChaild.userRoleId,
                      userRoleName: elemChaild.userRoleName,
                    })
                  )
                : null
            } else {
              return usersContain.push(
                JSON.stringify({
                  userRoleId: elemChaild.userRoleId,
                  userRoleName: elemChaild.userRoleName,
                })
              )
            }
          })
        )
      }
    } else {
      dataOffice.length > 0 &&
        dataOffice.map((elem) => {
          if (elem.email == userCurrentEmail)
            usersContain.push(
              JSON.stringify({ userRoleId: 5, userRoleName: 'Офис' })
            )
          if (elem.dealers.length > 0)
            usersContain.push(
              JSON.stringify({ userRoleId: 6, userRoleName: 'Дилер' })
            )
        })
    }

    setBuyArray([...new Set(usersContain)])
    setBuySelect([...new Set(usersContain)][0])
  }

  const getListArray = () => {
    if (buySelect) {
      let listContain = []
      let set = new Set()
      if (userCurrentRole !== 'office') {
        usersArray.map((elem) =>
          elem.users.map((elemChaild) => {
            if (userCurrentRole === 'dealer') {
              elemChaild.userRoleName == JSON.parse(buySelect).userRoleName &&
                elemChaild.email == userCurrentEmail &&
                listContain.push(elemChaild)
            } else {
              elemChaild.userRoleName == JSON.parse(buySelect).userRoleName &&
                listContain.push(elemChaild)
            }
          })
        )
      } else {
        dataOffice.map((elem) => {
          if (elem.email == userCurrentEmail) {
            JSON.parse(buySelect).userRoleName == elem.user_role &&
              listContain.push(elem)

            if (
              elem.dealers.length > 0 &&
              JSON.parse(buySelect).userRoleName !== elem.user_role
            )
              elem.dealers.map((el) => listContain.push(el))
          }
        })
      }

      listContain.map(({ CashAccountAuction, ...resValue }) =>
        set.add(JSON.stringify(resValue))
      )

      setListArray([...set])

      setlistSelect([...set][0])
    }
  }

  const getCodeArray = () => {
    if (absoluteArray.length > 0 && buySelect && listSelect) {
      let codeArrayFist = []
      absoluteArray.map((elem) =>
        elem.users.map(
          (elemChaild) =>
            elemChaild.userRoleName === JSON.parse(buySelect).userRoleName &&
            elemChaild.email === JSON.parse(listSelect).email
              ? codeArrayFist.push({
                  titleItem:
                    elem.auction_name + '-' + elem.login + '-' + elem.buyerCode,
                  credential_id: elem.id,
                })
              : null,
          setCodeArray(codeArrayFist)
        )
      )
      return (
        codeArrayFist.length > 0 &&
        setCodeSelect(codeArrayFist[0]['credential_id'])
      )
    }
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
  useEffect(() => {
    if (destinationsArray.length > 0) {
      if (destinationsSelect !== null) {
        destinationsArray.filter((elem) => {
          if (Number(elem.id) === Number(destinationsSelect)) {
            if (elem.place_destinations !== null) {
              setPlaceDestinationsArray(elem.place_destinations)
              setPlaceDestinationsSelect(elem.place_destinations[0].id)
            } else {
              setPlaceDestinationsArray([])
              setPlaceDestinationsSelect('')
            }
          }
        })
      } else {
        setPlaceDestinationsArray([])
        setPlaceDestinationsSelect('')
      }
    }
  }, [destinationsArray, destinationsSelect])

  const parseFunction = () => {
    dispatch(showLoder({ parseFunction: 1 }))

    postRequest('/api/v1/pre-bid/parsing', {
      lot: numberLot,
      auction_id: JSON.parse(auctionSelect).id,
    })
      .then(
        ({
          fuel,
          highlight,
          keys,
          location,
          odometer,
          transmission,
          name,
          year,
          engine,
          drive,
        }) => {
          setDataParse({
            fuel,
            highlight,
            keys,
            location,
            odometer,
            transmission,
            engine,
            drive,
          })
          setNameAuto(name)
          setYear(year)
          if (location) {
            locationsArray.map((elem) => {
              if (elem.copart_name)
                if (elem.copart_name.toLowerCase() === location.toLowerCase())
                  setLocationsSelect(elem.id)
            })
          }

          state.createNotification('Успешно найдено!', 'success')
          dispatch(showLoder({ parseFunction: 0 }))
        }
      )
      .catch(() => {
        state.createNotification('Не найдено!', 'error')
        dispatch(showLoder({ parseFunction: 0 }))
      })
  }

  let params = {
    status_order_id: 2,
    status_finance_id: 1,
    status_shipping_id: 1,
    auction_id: JSON.parse(auctionSelect).id,
    country_id: JSON.parse(countrySelect).id,
    lot: numberLot,
    location_id: locationsSelect,
    outside: currentValueToggle,
    destination_id: destinationsSelect,
    place_destination_id: placeDestinationsSelect,
    transport_size_id: transportSizeSelect,
    transport_name: nameAuto,
    vin: vin,
    doc_fee_id: docFeesValue,
    // 1,

    // old_price: 0,
    price: priceValue,
    buyer_role_id: buySelect ? JSON.parse(buySelect).userRoleId : null,
    buyer_user_id: listSelect ? JSON.parse(listSelect).user_id : null,
    credential_id: codeSelect,
    port_id: portNameSelect,
    year: year,
    // customer: currentValueToggleAuc,
  }

  const createAuctionTransport = (e) => {
    e.preventDefault()

    if (
      JSON.parse(auctionSelect).name === 'Default' ||
      JSON.parse(listSelect).name_ru === 'Default' ||
      JSON.parse(transportTypeSelect).name === 'Default'
    ) {
      setShowModalDefaultUsers(true)
    } else {
      if (vin.length === 17) {
        if (statusTs) {
          if (numberLot.length === 8) {
            dispatch(showLoder({ createAuctionTransport: 1 }))
            postRequest('/api/v1/order/transport-auto', {
              ...params,
              ...dataParse,
            })
              .then((res) => {
                state.createNotification('Успешно создано!', 'success')
                navigate(
                  `/auction-transport/edit/${res.general_information_id}`
                )
                dispatch(showLoder({ createAuctionTransport: 0 }))
              })
              .catch((res) => {
                state.createNotification('Что-то пошло не так!', 'error')
                dispatch(showLoder({ createAuctionTransport: 0 }))
              })
          } else {
            state.createNotification(
              'Лот должен содержать  8 символов!',
              'error'
            )
          }
        } else {
          state.createNotification('Подтвердите тип ТС!', 'error')
        }
      } else {
        refFocus.current.focus()
        refFocus.current.style.outline = 'none'
        refFocus.current.style.border = 'solid'
        refFocus.current.style.borderWidth = '1px'
        refFocus.current.style.borderColor = 'red'

        state.createNotification(
          `Неверное количество символов (${vin.length}) vin(Должно быть равное 17)`,
          'error'
        )
      }
    }
  }

  const verification = (fieldName, val) => {
    dispatch(showLoder({ verification: 1 }))
    let body, textError
    if (fieldName === 'lot') {
      body = { lot: val }
      textError = 'Автомобиль по данному лоту уже создан!'
    } else if (fieldName === 'vin') {
      body = { vin: val }
      textError = 'Данный VIN существует в системе'
    }
    postRequest('/api/v1/order/transport-auto/verification', body)
      .then((res) => {
        if (fieldName === 'lot') {
          refFocusLot.current.style.outline = 'none'
          refFocusLot.current.style.border = 'solid'
          refFocusLot.current.style.borderWidth = '1px'
          refFocusLot.current.style.borderColor = 'green'
        } else if (fieldName === 'vin') {
          refFocus.current.style.outline = 'none'
          refFocus.current.style.border = 'solid'
          refFocus.current.style.borderWidth = '1px'
          refFocus.current.style.borderColor = 'green'
        }

        setStatusSearchLot(true)
        dispatch(showLoder({ verification: 0 }))
      })
      .catch((err) => {
        state.createNotification(textError, 'error')

        if (fieldName === 'lot') {
          refFocusLot.current.style.outline = 'none'
          refFocusLot.current.style.border = 'solid'
          refFocusLot.current.style.borderWidth = '1px'
          refFocusLot.current.style.borderColor = 'red'
        } else if (fieldName === 'vin') {
          refFocus.current.style.outline = 'none'
          refFocus.current.style.border = 'solid'
          refFocus.current.style.borderWidth = '1px'
          refFocus.current.style.borderColor = 'red'
        }

        setStatusSearchLot(false)
        dispatch(showLoder({ verification: 0 }))
      })
  }
  const setGetInfoId = ({ transport_name }) =>
    transport_name && setNameAuto(transport_name)

  const getInfoByVin = () => {
    dispatch(showLoder({ getInfoByVin: 1 }))

    postRequest(`/api/v1/order/transport-auto/get-info-by-vin`, { vin })
      .then((res) => {
        setGetInfoId(res.info)

        state.createNotification('Успешно выполнено!', 'success')
        dispatch(showLoder({ getInfoByVin: 0 }))
      })
      .catch((err) => {
        state.createNotification('Не найдено!', 'error')
        dispatch(showLoder({ getInfoByVin: 0 }))
      })
  }

  return (
    <form onSubmit={createAuctionTransport}>
      <div className="contentBlockTop">
        <div className="modal-container">
          <Modal
            backdrop={'static'}
            keyboard={false}
            open={showModalDefaultUsers}
            onClose={() => setShowModalDefaultUsers(false)}
          >
            <Modal.Header>
              <Modal.Title>Создание автомобиля</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              Измените данные по автомобилю,значения не должны быть равные
              Default!
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn-success"
                onClick={() => setShowModalDefaultUsers(false)}
                appearance="subtle"
              >
                Понятно
              </button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="dropBlockContent">
          <h2 style={{ padding: 0 }}>Информация по аукциону</h2>

          <label>
            <span>Страна</span>
            {dataCountries.length > 0 ? (
              <select
                value={countrySelect}
                onChange={(event) => setCountrySelect(event.target.value)}
              >
                {dataCountries.map((elem) => {
                  return (
                    <option
                      key={elem.id + elem.name_ru}
                      value={JSON.stringify(elem)}
                    >
                      {elem.name_ru}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных!</span>
            )}
          </label>

          <label>
            <span>Название аукциона</span>
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
              <span>Нет данных!</span>
            )}
          </label>

          <label>
            <span>Лот</span>

            <input
              className=""
              type="text"
              value={numberLot}
              onChange={(e) => {
                if (e.target.value.length <= 8) setNumberLot(e.target.value)
              }}
              ref={refFocusLot}
              placeholder="Лот"
              required
            />
            {statusSearchLot && (
              <div
                className="helpParse"
                onClick={(e) => {
                  parseFunction()
                  verification('lot', e.target.value)
                }}
              >
                <Search />
              </div>
            )}
          </label>

          <div
            className="selectCustom selectCustom--space"
            style={{
              visibility: locationsArray.length > 0 ? 'visible' : 'none',
            }}
          >
            <label htmlFor="selectCustomId">Название площадки</label>
            {locationsArray.length > 0 ? (
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
            ) : (
              'Нет данных'
            )}
          </div>

          <label>
            <span>Offsite</span>

            <div className="helpGroupInput">
              <Toggle
                checkedChildren={<Check />}
                unCheckedChildren={<Close />}
                onChange={(value) => {
                  setCurrentValueToggle(value)
                }}
              />
            </div>
          </label>

          <label>
            <span>Порт погрузки:</span>

            {portNameArray.length > 0 ? (
              <select
                value={portNameSelect}
                onChange={(event) => setPortNameSelect(event.target.value)}
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
              <span>Нет данных!</span>
            )}
          </label>

          <label>
            <span>Порт назначения</span>

            {destinationsArray.length > 0 ? (
              <select
                value={destinationsSelect}
                onChange={(event) => setDestinationsSelect(event.target.value)}
              >
                {destinationsArray.map((elem) => {
                  return (
                    <option key={elem.id} value={elem.id}>
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных</span>
            )}
          </label>

          <label>
            <span>Место назначения</span>
            {placeDestinationsArray.length > 0 ? (
              <select
                value={placeDestinationsSelect}
                onChange={(event) =>
                  setPlaceDestinationsSelect(event.target.value)
                }
              >
                {placeDestinationsArray.map((elem) => {
                  return (
                    <option key={elem.id} value={elem.id}>
                      {elem.title + ' , ' + elem.country.name_ru}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных</span>
            )}
          </label>
        </div>

        <div className="dropBlockContent">
          <h2 style={{ padding: 0 }}>Информация о покупателе</h2>
          {!state.loader && buyArray.length > 0 && (
            <label>
              <span>Назначить покупателя</span>

              {buyArray.length > 0 ? (
                <select
                  value={buySelect}
                  onChange={(event) => setBuySelect(event.target.value)}
                >
                  {buyArray.map((elem) => {
                    return (
                      <option key={JSON.parse(elem).userRoleId} value={elem}>
                        {JSON.parse(elem).userRoleName}
                      </option>
                    )
                  })}
                </select>
              ) : (
                <span style={{ color: 'red' }}>
                  Требуется предоставить доступ к аукциону!
                </span>
              )}
            </label>
          )}
          {!state.loader && listArray.length > 0 && (
            <label>
              <span>Список выбранных</span>

              {listArray.length > 0 ? (
                <select
                  value={listSelect}
                  onChange={(event) => setlistSelect(event.target.value)}
                >
                  {listArray.map((elem) => {
                    return (
                      <option key={JSON.parse(elem).email} value={elem}>
                        {JSON.parse(elem).email}
                      </option>
                    )
                  })}
                </select>
              ) : (
                <span style={{ color: 'red' }}>
                  Требуется предоставить доступ к аукциону!
                </span>
              )}
            </label>
          )}

          {!state.loader && codeArray.length > 0 && (
            <label>
              <span>Код покупателя</span>

              {codeArray.length > 0 ? (
                <select
                  value={codeSelect}
                  onChange={(event) => setCodeSelect(event.target.value)}
                >
                  {codeArray.map((elem, i) => {
                    return (
                      <option
                        key={elem.credential_id}
                        value={elem.credential_id}
                      >
                        {elem.titleItem}
                      </option>
                    )
                  })}
                </select>
              ) : (
                <span style={{ color: 'red' }}>
                  Требуется предоставить доступ к аукциону!
                </span>
              )}
            </label>
          )}
        </div>

        <div className="dropBlockContent">
          <h2>Данные по лоту</h2>
          {/* <label>
            <span>VIN</span>
            <input
              type="text"
              placeholder="Vin"
              value={vin}
              onChange={(e) => {
                let value = e.target.value
                value = value.replace(/[^A-Za-z0-9]/gi, '').toUpperCase()
                return value.length <= 17 && setVin(value)
              }}
              onBlur={(e) => verification('vin', e.target.value)}
              required
              ref={refFocus}
            />
          </label> */}

          <div
            style={{
              display: 'flex',
              alighItems: 'center',
              position: 'relative',
            }}
          >
            <label>
              <span>VIN</span>
              <input
                type="text"
                placeholder="Vin"
                value={vin}
                onChange={(e) => {
                  let value = e.target.value
                  value = value.replace(/[^A-Za-z0-9]/gi, '').toUpperCase()
                  return value.length <= 17 && setVin(value)
                }}
                onBlur={(e) => verification('vin', e.target.value)}
                ref={refFocus}
              />
            </label>
            <div
              className="helpParse"
              style={{
                position: 'absolute',
                top: '20%',
                right: '10px',
              }}
              onClick={(e) => getInfoByVin()}
            >
              <DocPass />
            </div>
          </div>

          <label>
            <span>Наименование</span>
            <input
              type="text"
              placeholder="Наименование"
              value={nameAuto}
              onChange={(e) => {
                let value = e.target.value
                value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                return setNameAuto(value)
              }}
              required
            />
          </label>

          <div className="selectCustom selectCustom--space">
            <label htmlFor="selectCustomId">Тип средства</label>

            {transportTypeArray.length > 0 ? (
              <select
                value={transportTypeSelect}
                onChange={(event) => setTransportTypeSelect(event.target.value)}
              >
                {transportTypeArray.map((elem) => {
                  return (
                    <option key={elem.id} value={JSON.stringify(elem)}>
                      {elem.name}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных!</span>
            )}

            <div className="helpGroupInput" style={{ marginLeft: '10px' }}>
              <div className="toggleCheck">
                <Toggle
                  checkedChildren={<Check />}
                  unCheckedChildren={<Close />}
                  onChange={(value) => {
                    setStatusTs(value)
                  }}
                />
              </div>
            </div>
          </div>

          <label>
            <span>Размер транспорта</span>
            {transportSizeArray.length > 0 ? (
              <select
                value={transportSizeSelect}
                onChange={(event) => setTransportSizeSelect(event.target.value)}
              >
                {transportSizeArray.map((elem) => {
                  return (
                    <option key={elem.id} value={elem.id}>
                      {elem.name}
                      {elem.additional_info && '(' + elem.additional_info + ')'}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных!</span>
            )}
          </label>

          <label>
            <span>Тип документа</span>

            {docFeesArray.length > 0 ? (
              <select
                value={docFeesValue}
                onChange={(event) => setDocFeesValue(event.target.value)}
              >
                {docFeesArray.map((elem) => {
                  return (
                    <option key={elem.id} value={elem.id}>
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных!</span>
            )}
          </label>
          <label>
            <span>Цена на торгах с учетом сбора</span>
            <input
              type="text"
              placeholder="Цена на торгах с учетом сбора"
              value={priceValue}
              onChange={(e) => setPriceValue(controlNumber(e.target.value))}
              required
            />
          </label>
        </div>
      </div>

      <input
        type="submit"
        className="btn-success-preBid btn-auto"
        value="Сохранить"
      />
    </form>
  )
}
export default memo(AuctionTransportAutoCreate)
