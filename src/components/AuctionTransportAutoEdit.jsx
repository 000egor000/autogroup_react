import React, { useState, useEffect, useContext, memo } from 'react'

import { Modal, SelectPicker, Toggle } from 'rsuite'
import { Check, Close, Search, DocPass } from '@rsuite/icons'

import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

import { postRequest, getRequest, putRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp'
import PropTypes from 'prop-types'
import { controlNumber } from '../helper'

const AuctionTransportAutoEdit = ({
  propsData,
  propsId,
  viewBlock,
  carrierArray,
  destinationsArray,
  credentialsArray,
  // auctionArray,
}) => {
  const [currentValueToggle, setCurrentValueToggle] = useState(false)

  const [portNameArray, setPortNameArray] = useState([])
  const [placeDestinationsArray, setPlaceDestinationsArray] = useState([])
  const [portNameSelect, setPortNameSelect] = useState('')

  const [currentUrlId, setCurrentUrlId] = useState('')
  const [docFeesArray, setDocFeesArray] = useState([])
  const [docFeesValue, setDocFeesValue] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const pathCurrent = window.location.pathname

  //paramsToSave1

  const [countrySelect, setCountrySelect] = useState(0)
  const [dataCountries, setDataCountries] = useState([])
  const [auctionArray, setAuctionArray] = useState([])
  const [auctionSelect, setAuctionSelect] = useState(0)
  const [numberLot, setNumberLot] = useState('')
  const [locationsArray, setLocationsArray] = useState([])
  const [locationsSelect, setLocationsSelect] = useState('')

  const [destinationsSelect, setDestinationsSelect] = useState('')
  const [placeDestinationsSelect, setPlaceDestinationsSelect] = useState('')
  //paramsToSave2
  const [transportTypeArray, setTransportTypeArray] = useState([])
  const [transportTypeSelect, setTransportTypeSelect] = useState('')
  const [transportSizeArray, setTransportSizeArray] = useState([])
  const [transportSizeSelect, setTransportSizeSelect] = useState('')

  //paramsToSave3
  const [buyArray, setBuyArray] = useState([])
  const [buySelect, setBuySelect] = useState(0)
  const [listArray, setListArray] = useState([])
  const [listSelect, setlistSelect] = useState(0)
  const [codeArray, setCodeArray] = useState([])
  const [codeSelect, setCodeSelect] = useState(0)
  const [usersArray, setUsersArray] = useState([])
  const [absoluteArray, setAbsoluteArray] = useState([])

  const [nameAuto, setNameAuto] = useState('')
  const [year, setYear] = useState('')
  const [dataParse, setDataParse] = useState({})

  const [vin, setVin] = useState('')
  const [priceValue, setPriceValue] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    if (propsData.id) fillDataArray(propsData)

    // return () => {
    //   setNumberLot('')
    //   setLocationsSelect('')
    //   setCurrentValueToggle(false)
    //   // setCurrentValueToggleAuc(false)
    //   setNameAuto('')
    //   setVin('')
    //   setPriceValue('')
    //   setOldPriceValue(0)
    // }
  }, [propsData, buySelect])

  useEffect(() => {
    dispatch(showLoder({ countries: 1 }))
    getRequest('/api/v1/countries', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterAray = res.countries.filter((item) => item.is_buyed)
        setDataCountries(filterAray)

        dispatch(showLoder({ countries: 0 }))
      })
      .catch((err) => dispatch(showLoder({ countries: 0, status: err.status })))
  }, [])

  useEffect(() => {
    if (currentUrlId) {
      dispatch(showLoder({ docFees: 1 }))
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
          setDocFeesValue(
            propsData.doc_fee_id ? propsData.doc_fee_id : +res.docFees[0].id
          )
          dispatch(showLoder({ docFees: 0 }))
        })

        .catch((err) => {
          dispatch(showLoder({ docFees: 0, status: err.status }))
          //state.createNotification('Успешно обновлено!', 'error')
        })
    }
    return () => {
      setDocFeesArray([])
      setDocFeesValue('')
    }
  }, [currentUrlId])
  useEffect(() => {}, [dataCountries, propsData])

  useEffect(() => {
    getAuctions(countrySelect)
  }, [countrySelect])

  const getAuctions = (val) => {
    if (val) {
      const { auctions } = JSON.parse(val)

      if (auctions && auctions.length > 0) {
        const is_notValueDefault = auctions.filter(
          (el) => el.code !== 'Default'
        )

        setAuctionArray(is_notValueDefault)
        // setAuctionSelect(JSON.stringify(auctions[0]))
      }
    } else {
      setAuctionArray([])
      // setAuctionSelect(0)
    }
  }

  // useEffect(() => {
  //   if (propsData.auction_id && auctionArray.length > 0) {
  //     let upDatePropsFilter = auctionArray.filter(
  //       (elem) => elem.id == propsData.auction_id
  //     )
  //     // if(propsData.status_shipping_id===)
  //     console.log(countrySelect)

  //     setAuctionSelect(JSON.stringify(upDatePropsFilter[0]))
  //   } else if (auctionArray.length > 0) {
  //     setAuctionSelect(JSON.stringify(auctionArray[0]))
  //   } else {
  //     setAuctionSelect(0)
  //   }
  //   return () => setAuctionSelect('')
  // }, [propsData, countrySelect])

  useEffect(() => {
    if (propsData && dataCountries.length > 0) {
      const upDatePropsFilter = dataCountries.find(
        (item) => item.id == propsData.country_id
      )

      if (upDatePropsFilter) {
        const upDateAuctionPropsFilter = upDatePropsFilter.auctions.find(
          (item) => item.id == propsData.auction_id
        )

        setAuctionSelect(JSON.stringify(upDateAuctionPropsFilter))
        setCountrySelect(JSON.stringify(upDatePropsFilter))
      }
    }
    // else if (auctionArray.length > 0 && !propsData.country_id) {
    //   setCountrySelect(JSON.stringify(dataCountries[0]))
    // } else {
    //   setCountrySelect(0)
    // }
    return () => setCountrySelect('')
  }, [propsData, dataCountries])
  console.log(auctionSelect)

  useEffect(() => {
    // console.log('auctionSelect',auctionSelect)
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

          dispatch(showLoder({ locations: 0 }))
        })
        .catch((err) => {
          //state.createNotification('Успешно обновлено!', 'error')
          dispatch(showLoder({ locations: 0, status: err.status }))
        })
    } else {
      setLocationsArray([])
    }
    // console.log('setLocationsArray',locationsArray)
    return () => {}
  }, [auctionSelect])

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
    carrierArray.length > 0 &&
      carrierArray.map(
        (elem) =>
          elem.code === 'aec' &&
          // elem.code === 'test'
          setCurrentUrlId(elem.id)
      )
  }, [carrierArray])

  useEffect(() => {
    if (destinationsArray.length > 0) {
      setDestinationsSelect(
        propsData.destination_id
          ? propsData.destination_id
          : destinationsArray[0]['id']
      )
    }
  }, [destinationsArray, propsData])

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
  }, [locationsArray, locationsSelect, destinationsSelect])

  useEffect(() => {
    dispatch(showLoder({ type: 1 }))
    getRequest('/api/v1/transport-type', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setTransportTypeArray(res.transportTypes)
        // setTransportTypeSelect(JSON.stringify(res.transportTypes[0]))
        dispatch(showLoder({ type: 0 }))
      })
      .catch((err) => {
        setTransportTypeArray([])
        dispatch(showLoder({ type: 0, status: err.status }))
        //state.createNotification('Успешно обновлено!', 'error')
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
      setTransportSizeSelect('')
    }
  }, [transportTypeSelect])

  useEffect(() => {
    if (auctionSelect && credentialsArray[JSON.parse(auctionSelect).code]) {
      let resultArray = []
      let absoluteArray = []

      absoluteArray = credentialsArray[JSON.parse(auctionSelect).code]

      resultArray = credentialsArray[JSON.parse(auctionSelect).code].filter(
        (elem) => elem.users.length > 0
      )
      if (absoluteArray.length > 0) setAbsoluteArray(absoluteArray)
      if (resultArray.length > 0) setUsersArray(resultArray)
    } else return null
    return () => {
      setAbsoluteArray([])
      setUsersArray([])
    }
  }, [auctionSelect, credentialsArray, countrySelect])

  useEffect(() => {
    getBuyArray()
    return () => {
      setBuyArray([])
      setBuySelect(0)
    }
  }, [auctionSelect, countrySelect, usersArray, propsData])

  useEffect(() => {
    getListArray()

    return () => {
      setListArray([])
      setlistSelect(0)
    }
  }, [auctionSelect, buySelect, countrySelect, usersArray, propsData])

  useEffect(() => {
    getCodeArray()
    return () => {
      setCodeArray([])
      setCodeSelect(0)
    }
  }, [
    auctionSelect,
    buySelect,
    countrySelect,
    listSelect,
    absoluteArray,
    propsData,
  ])

  const getBuyArray = () => {
    if (usersArray.length > 0) {
      let usersContain = []

      usersArray.map((elem) => {
        return elem.users.map((elemChaild) =>
          usersContain.push(
            JSON.stringify({
              userRoleId: elemChaild.userRoleId,
              userRoleName: elemChaild.userRoleName,
            })
          )
        )
      })

      let upDatePropsFilter = [...new Set(usersContain)].filter(
        (elem) => JSON.parse(elem).userRoleId == propsData.buyer_role_id
      )

      setBuyArray([...new Set(usersContain)])

      setBuySelect(
        propsData.buyer_role_id && upDatePropsFilter.length > 0
          ? upDatePropsFilter[0]
          : [...new Set(usersContain)][0]
      )
    }
  }

  const getListArray = () => {
    if (JSON.parse(buySelect).userRoleName) {
      let listContain = []

      usersArray.map((elem) => {
        return elem.users.map(({ CashAccountAuction, ...elemChaild }) => {
          elemChaild.userRoleName == JSON.parse(buySelect).userRoleName &&
            listContain.push(JSON.stringify(elemChaild))
        })
      })

      let upDatePropsFilter = [...new Set(listContain)].filter(
        (elem) => JSON.parse(elem).user_id == propsData.buyer_user_id
      )

      setListArray([...new Set(listContain)])

      setlistSelect(
        propsData.buyer_user_id && upDatePropsFilter.length > 0
          ? upDatePropsFilter[0]
          : listContain[0]
      )
    }
  }

  const getCodeArray = () => {
    if (auctionSelect && buySelect && absoluteArray.length > 0 && listSelect) {
      let codeArrayFist = []

      absoluteArray.map((elem) =>
        elem.users.map((elemChaild) =>
          elemChaild.userRoleName === JSON.parse(buySelect).userRoleName &&
          elemChaild.email === JSON.parse(listSelect).email
            ? codeArrayFist.push({
                titleItem:
                  elem.auction_name + '-' + elem.login + '-' + elem.buyerCode,
                credential_id: elem.id,
              })
            : null
        )
      )

      let upDatePropsFilter = codeArrayFist.filter(
        (elem) => elem.credential_id == propsData.credential_id
      )

      codeArrayFist.map((elem) =>
        setCodeSelect(
          propsData.credential_id && upDatePropsFilter.length > 0
            ? upDatePropsFilter[0].credential_id
            : elem.credential_id
        )
      )

      setCodeArray(codeArrayFist)
    }
  }

  const parseFunction = () => {
    dispatch(showLoder({ parseFunction: 1 }))
    // setStatusLoader(true)
    postRequest('/api/v1/pre-bid/parsing', {
      lot: numberLot,
      auction_id: JSON.parse(auctionSelect).id,
    })
      .then((res) => {
        setDataParse({
          fuel: res.fuel,
          highlight: res.highlight,
          keys: res.keys,
          location: res.location,
          odometer: res.odometer,
          transmission: res.transmission,
        })

        setNameAuto(res.name)
        setYear(res.year)
        setGetFieldParse(res)

        state.createNotification('Успешно найдено!', 'success')
        dispatch(showLoder({ parseFunction: 0 }))
      })
      .catch((err) => {
        state.createNotification('Не найдено!', 'error')
        dispatch(showLoder({ parseFunction: 0, status: err.status }))
      })
  }
  const setGetFieldParse = ({ location }) => {
    const result = locationsArray.find(
      (el) =>
        String(el.copart_name).toUpperCase() === String(location).toUpperCase()
    )

    result && setLocationsSelect(result.id)
  }

  const setGetInfoId = ({ transport_name }) =>
    transport_name && setNameAuto(transport_name)

  const getInfoByVin = () => {
    dispatch(showLoder({ getInfoByVin: 1 }))

    postRequest(`/api/v1/order/transport-auto/get-info-by-vin`, { vin })
      .then((res) => {
        setGetInfoId(res.info)

        state.createNotification('Авто выполнено!', 'success')
        dispatch(showLoder({ getInfoByVin: 0 }))
      })
      .catch((err) => {
        state.createNotification('Не найдено!', 'error')
        dispatch(showLoder({ getInfoByVin: 0, status: err.status }))
      })
  }

  let fillDataArray = ({
    transport_size_id,
    lot,
    location_id,
    outside,
    transport_name,
    vin,
    price,
  }) => {
    const filter = transportTypeArray.find((el) =>
      el.transportSizes.find((elChaild) => elChaild.id === transport_size_id)
    )

    setNumberLot(String(lot))
    setLocationsSelect(location_id)
    setCurrentValueToggle(outside === 0 ? false : true)

    setNameAuto(String(transport_name))
    setVin(String(vin))

    setPriceValue(String(price))

    filter && setTransportTypeSelect(JSON.stringify(filter))
  }

  let params = {
    status_order_id:
      pathCurrent.split('/')[1] === 'auction-transportNotAll' ? 1 : 2,
    status_finance_id: 1,
    status_shipping_id: 1,
    auction_id: auctionSelect && JSON.parse(auctionSelect).id,
    country_id: countrySelect && JSON.parse(countrySelect).id,
    lot: numberLot,
    location_id: locationsSelect,
    outside: currentValueToggle,
    destination_id: destinationsSelect,
    place_destination_id: placeDestinationsSelect,
    transport_size_id: transportSizeSelect,
    transport_name: nameAuto,
    vin,
    doc_fee_id: docFeesValue,
    price: priceValue,
    buyer_role_id: buySelect && JSON.parse(buySelect).userRoleId,
    buyer_user_id: listSelect && JSON.parse(listSelect).user_id,
    credential_id: codeSelect,
    port_id: portNameSelect,
    year,
  }

  const editAuctionTransport = (e) => {
    if (
      (auctionSelect && JSON.parse(auctionSelect).name === 'Default') ||
      (listSelect && JSON.parse(listSelect).name_ru === 'Default') ||
      (transportTypeSelect &&
        JSON.parse(transportTypeSelect).name === 'Default')
    ) {
      setOpen(true)
    } else {
      if (vin.length === 17) {
        if (numberLot.length === 8) {
          dispatch(showLoder({ editAuctionTransport: 1 }))
          putRequest(`/api/v1/order/transport-auto/${propsId}`, {
            ...params,
            ...dataParse,
          })
            .then(() => {
              state.createNotification('Успешно обновлено!', 'success')
              dispatch(showLoder({ editAuctionTransport: 0 }))
            })
            .catch((err) => {
              state.createNotification('Что-то пошло не так!', 'error')
              dispatch(
                showLoder({ editAuctionTransport: 0, status: err.status })
              )
            })
        } else {
          state.createNotification('Лот должен содержать 8 символов!', 'error')
        }
      } else {
        // refFocus.current.focus()
        // refFocus.current.style.outline = 'none'
        // refFocus.current.style.border = 'solid'
        // refFocus.current.style.borderWidth = '1px'
        // refFocus.current.style.borderColor = 'red'
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
        // if (fieldName === 'lot') {
        //   refFocusLot.current.style.outline = 'none'
        //   refFocusLot.current.style.border = 'solid'
        //   refFocusLot.current.style.borderWidth = '1px'
        //   refFocusLot.current.style.borderColor = 'green'
        // } else if (fieldName === 'vin') {
        //   refFocus.current.style.outline = 'none'
        //   refFocus.current.style.border = 'solid'
        //   refFocus.current.style.borderWidth = '1px'
        //   refFocus.current.style.borderColor = 'green'
        // }
        dispatch(showLoder({ verification: 0 }))
        // setStatusSearchLot(true)
      })
      .catch((err) => {
        state.createNotification(textError, 'error')

        // if (fieldName === 'lot') {
        //   refFocusLot.current.style.outline = 'none'
        //   refFocusLot.current.style.border = 'solid'
        //   refFocusLot.current.style.borderWidth = '1px'
        //   refFocusLot.current.style.borderColor = 'red'
        // } else if (fieldName === 'vin') {
        //   refFocus.current.style.outline = 'none'
        //   refFocus.current.style.border = 'solid'
        //   refFocus.current.style.borderWidth = '1px'
        //   refFocus.current.style.borderColor = 'red'
        // }
        dispatch(showLoder({ verification: 0, status: err.status }))
        // setStatusSearchLot(false)
      })
  }
  const throughAuto = (e) => {
    if (
      JSON.parse(auctionSelect).name === 'Default' ||
      JSON.parse(listSelect).name_ru === 'Default' ||
      JSON.parse(transportTypeSelect).name === 'Default'
    ) {
      setOpen(true)
    } else {
      dispatch(showLoder({ throughAuto: 1 }))
      putRequest(`/api/v1/order/transport-auto/updateDismantled/${propsId}`)
        .then(() => {
          state.createNotification('Авто переведенно!', 'success')
          navigate('/auctions-transportsNotAll')
          dispatch(showLoder({ throughAuto: 0 }))
        })
        .catch((err) => {
          state.createNotification('Что-то пошло не так!', 'error')
          dispatch(showLoder({ throughAuto: 0, status: err.status }))
        })
    }
  }

  const unsorted = () =>
    pathCurrent.split('/')[1] === 'auction-transportNotAll' &&
    (JSON.parse(window.sessionStorage.getItem('role')).code === 'office' ||
      JSON.parse(window.sessionStorage.getItem('role')).code === 'dealer')

  const consrolDisabled = () => {
    let bool = false

    if (!viewBlock(41)) bool = true
    if (
      pathCurrent.split('/')[1] === 'archiveTransport' ||
      pathCurrent.split('/')[1] === 'removedTransport'
    )
      bool = true

    return bool
  }

  return (
    <React.Fragment>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Modal.Header>
            <Modal.Title>Обновление автомобиля</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Измените данные по автомобилю,значения не должны быть равные
            Default!
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success"
              onClick={() => setOpen(false)}
              appearance="subtle"
            >
              Понятно
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="contentBlockTop">
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
                required={viewBlock(41)}
                disabled={consrolDisabled()}
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
              <span>Нет данных</span>
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
              // onBlur={(e) => {
              // 	parseFunction()
              // 	verification('lot', e.target.value)
              // }}
              // ref={refFocusLot}
              placeholder="Лот"
              required={viewBlock(41)}
              disabled={consrolDisabled()}
            />

            <div
              className="helpParse"
              onClick={(e) => {
                parseFunction()
                verification('lot', e.target.value)
              }}
              style={{ display: consrolDisabled() ? 'none' : 'flex' }}
            >
              <Search />
            </div>
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
                disabled={consrolDisabled()}
                loading={!locationsArray.length}
              />
            ) : (
              'Нет данных'
            )}

            {/* <div className="helpGroupInput">
              <div className="toggleCheck">
                <Toggle
                  checkedChildren={<Check />}
                  unCheckedChildren={<Close />}
                  disabled={consrolDisabled()}
                  onChange={(value) => {
                    setCurrentValueToggle(value)
                  }}
                />
              </div>
            </div> */}
          </div>
          <label>
            <span>Offsite</span>

            <div className="helpGroupInput">
              <Toggle
                checkedChildren={<Check />}
                unCheckedChildren={<Close />}
                disabled={consrolDisabled()}
                checked={currentValueToggle}
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
                disabled={consrolDisabled()}
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
              <span>Нет данных</span>
            )}
          </label>

          <label>
            <span>Порт назначения</span>

            {destinationsArray.length > 0 ? (
              <select
                value={destinationsSelect}
                onChange={(event) => setDestinationsSelect(event.target.value)}
                required={viewBlock(41)}
                disabled={consrolDisabled()}
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
                required={viewBlock(41)}
                disabled={consrolDisabled()}
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
                  required={viewBlock(41)}
                  disabled={consrolDisabled()}
                >
                  {buyArray.map((elem, i) => {
                    return (
                      <option key={JSON.parse(elem).userRoleName} value={elem}>
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
                  required={viewBlock(41)}
                  disabled={consrolDisabled()}
                >
                  {listArray.map((elem, i) => {
                    return (
                      <option key={i} value={elem}>
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
                  required={viewBlock(41)}
                  disabled={consrolDisabled()}
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

          {/* {statusOrder !== 3 && pathCurrent.split('/')[1] !== 'auction-transportNotAll' && (
						<button
							type='submit'
							className='btn-success-preBid btn-auto'
							style={{ display: 'flex', width: 'fit-content' }}
							onClick={() => chooseItem('Аукцион')}
						>
							<span>Выставить на аукцион</span>
						</button>
					)} */}
        </div>

        <div className="dropBlockContent">
          <h2>Данные по лоту</h2>

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
                required={viewBlock(41)}
                disabled={consrolDisabled()}
                // ref={refFocus}
              />
            </label>
            <div
              className="helpParse"
              style={{
                display: consrolDisabled() ? 'none' : 'flex',
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
              required={viewBlock(41)}
              disabled={consrolDisabled()}
            />
          </label>

          <label>
            <span>Тип средства</span>

            {transportTypeArray.length > 0 ? (
              <select
                value={transportTypeSelect}
                onChange={(event) => setTransportTypeSelect(event.target.value)}
                required={viewBlock(41)}
                disabled={consrolDisabled()}
              >
                {transportTypeArray.map((elem, i) => {
                  return (
                    <option key={elem.id} value={JSON.stringify(elem)}>
                      {elem.name}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных</span>
            )}
          </label>
          <label>
            <span>Размер транспорта</span>

            {transportSizeArray.length > 0 ? (
              <select
                value={transportSizeSelect}
                onChange={(event) => setTransportSizeSelect(event.target.value)}
                required={viewBlock(41)}
                disabled={consrolDisabled()}
              >
                {transportSizeArray.map((elem) => {
                  return (
                    <option key={elem.id} value={elem.id}>
                      {elem.name}
                    </option>
                  )
                })}
              </select>
            ) : (
              <span>Нет данных</span>
            )}
          </label>

          <label>
            <span>Тип документа</span>

            {docFeesArray.length > 0 ? (
              <select
                value={docFeesValue}
                onChange={(event) => setDocFeesValue(event.target.value)}
                required={viewBlock(41)}
                disabled={consrolDisabled()}
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
              <span>Нет данных</span>
            )}
          </label>

          <label>
            <span>Цена на торгах с учетом сбора</span>
            <input
              // type="number"
              placeholder="Цена на торгах с учетом сбора"
              value={priceValue}
              type="text"
              onChange={(e) => setPriceValue(controlNumber(e.target.value))}
              required={viewBlock(41)}
              disabled={consrolDisabled()}
            />
          </label>
        </div>
      </div>
      <div
        style={{
          display: consrolDisabled() ? 'none' : 'flex',
          margin: '0 auto',
          alignItems: 'center',
        }}
      >
        {viewBlock(41) && (
          <input
            type="button"
            onClick={() => editAuctionTransport()}
            className="btn-success-preBid btn-auto"
            value={propsId ? 'Обновить' : 'Сохранить'}
          />
        )}
        {unsorted() && (
          <button
            className="btn-throughAuto "
            onClick={() => throughAuto()}
            style={{
              background: 'yellow',
            }}
          >
            В разобранные
          </button>
        )}
      </div>
    </React.Fragment>
  )
}

AuctionTransportAutoEdit.propTypes = {
  propsData: PropTypes.any,
  propsId: PropTypes.string,
  viewBlock: PropTypes.func,
}

export default memo(AuctionTransportAutoEdit)
