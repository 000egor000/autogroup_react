import React, { useState, useContext, useEffect } from 'react'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'

import { Edit, Trash, Check, Close, Unvisible } from '@rsuite/icons'

import 'react-toastify/dist/ReactToastify.css'
import nextId from 'react-id-generator'
import { Pagination, Modal, Checkbox } from 'rsuite'

import { postRequest, getRequest, putRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
// import { CheckIcon, CloseIcon } from '@rsuite/icons'
// import CloseIcon from '@rsuite/icons/Close'
// import MenuIcon from '@rsuite/icons/Menu'
// import { Animation } from 'rsuite'

import {
  // btnShowAuction,
  btnShowBlockCredentials,
} from '../const'

import { controlNumber } from '../helper'

// import UnvisibleIcon from '@rsuite/icons/Unvisible'

const Credentials = (props) => {
  const [dataContainer, setDataContainer] = useState([])
  const [dataContainerData, setDataContainerData] = useState([])
  const [dataMaster, setDataMaster] = useState([])
  const [credentialArray, setCredentialArray] = useState([])
  const [dataTableFilter, setDataTableFilter] = useState([])

  const [dataUser, setDataUser] = useState([])
  const [currentValue, setCurrentValue] = useState('')
  const [idAuctions, setIdAuctions] = useState('')
  const [LogIn, setLogIn] = useState('')
  const [buyer, setBuyer] = useState('')
  const [active, setActive] = useState(false)
  const [carrier_id, setCarrier_id] = useState('')
  const [carrierArray, setCarrierArray] = useState([])

  const [editId, setEditId] = useState('')

  const [selectValueAccess, setSelectValueAccess] = useState(0)
  const [selectValueUser, setSelectValueUser] = useState('')

  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [password, setPassword] = useState('')
  const [paywall, setPaywall] = useState(false)
  const [price_buy, setPrice_buy] = useState('')

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState(0)
  const [viewControler, setViewControler] = useState([])
  const [isModalEnd, setIsModalEnd] = useState(false)
  const [officesArray, setOfficesArray] = useState([])
  const [countryArray, setCountryArray] = useState([])
  const [countrySelect, setCountrySelect] = useState('')
  const [nameCountry, setNameCountry] = useState('')
  const [filterUserActive, setFilterUserActive] = useState([])

  const [nameSecondNameSearch, setNameSecondNameSearch] = useState('')
  const [emailSearch, setEmailSearch] = useState('')

  const [logBuyerSearch, setLogBuyerSearch] = useState('')

  const [auctionArray, setAuctionArray] = useState([])

  const { state, dispatch } = useContext(ContextApp)
  let paramsAccess

  const [btnShow, setBtnShow] = useState([])

  const [btnShowBlock, setBtnShowBlock] = useState(btnShowBlockCredentials)

  //paramsSearch
  const paramsSearch = {
    search: {
      fio: nameSecondNameSearch,
      email: emailSearch,
      credential_id: logBuyerSearch,
    },
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  useEffect(() => {
    if (btnShow.length > 0) {
      const result = btnShow.find((elem) => elem.status)

      result && setCurrentValue(result.code)
    }
  }, [btnShow])

  useEffect(() => {
    dispatch(showLoder({ offices: 1 }))
    getRequest(`/api/v1/offices?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setOfficesArray(res.offices)
        dispatch(showLoder({ offices: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ offices: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    if (officesArray.length > 0) {
      let resAll = []

      officesArray.map((elem) => {
        if (elem.dealers.length > 0) {
          elem.dealers.map((elemChaild) =>
            resAll.push({
              id: elemChaild.user_id,
              email: elemChaild.email,
              fullName: elemChaild.name_ru + ' ' + elemChaild.second_name_ru,
              city: elem.city.name_ru,
            })
          )
        }

        resAll.push({
          id: elem.user_id,
          email: elem.email,
          fullName: elem.name_ru + ' ' + elem.second_name_ru,
          city: elem.city.name_ru,
        })
      })

      setDataUser(resAll)
      setSelectValueUser(resAll[0]['id'])
    }
  }, [officesArray, btnShowBlock])

  useEffect(() => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAuctionArray(res.auction)
        const dataCorrect = res.auction
          .filter((item) => String(item.code).toLocaleUpperCase() !== 'DEFAULT')
          .map((el) => ({
            ...el,
            status: el.id === 1 ? true : false,
          }))
        setBtnShow(dataCorrect)

        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ auctions: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    if (auctionArray.length > 0 && currentValue) {
      const idAuction = auctionArray.find((elem) =>
        elem.code === currentValue ? elem.id : null
      )
      setIdAuctions(idAuction)
    }
  }, [auctionArray, currentValue])

  useEffect(() => {
    dispatch(showLoder({ carriers: 1 }))
    getRequest(`/api/v1/carriers`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCarrierArray(res.carriers)
        setCarrier_id(res.carriers[0].id)

        dispatch(showLoder({ carriers: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ carriers: 0, status: err.status }))
      })
  }, [])

  const reset = () => {
    setLogIn('')
    setBuyer('')
    setPassword('')
    setPrice_buy('')
    setPaywall(false)
    setIsModalShowEdit(false)
    setNameCountry('')
    setCountrySelect(countryArray[0]['id'])
    setActive(false)
    setCarrier_id(carrierArray[0]['id'])
    // setDataCurrnetClick('')
  }

  const chooseItem = (id, country) => {
    const newArr = btnShow.map((item) => {
      return item.name === id && item.country.name_ru === country
        ? { ...item, status: true }
        : { ...item, status: false }
    })
    setBtnShow(newArr)
    reset()

    setBtnShowBlock(btnShowBlockCredentials)
  }

  const chooseItemBlock = (id) => {
    if (dataContainer.includes(id)) {
      const newArr = btnShowBlock.map((item) =>
        item.id === id ? { ...item, status: false } : { ...item, status: false }
      )
      setBtnShowBlock(newArr)
      setDataContainer([])
    } else {
      setDataContainer([id])
      const newArr = btnShowBlock.map((item) =>
        item.id === id ? { ...item, status: true } : { ...item, status: false }
      )
      setBtnShowBlock(newArr)
    }
    reset()
  }

  useEffect(() => {
    getDataTable()
  }, [idAuctions, page])

  const getDataTable = () => {
    let users = []

    dispatch(showLoder({ getDataTable: 1 }))
    getRequest(`/api/v1/credentials?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        for (const key in res.credentials) {
          if (idAuctions.code === key) {
            const filterActive = res.credentials[key].filter((el) => el.active)

            setDataMaster(
              res.credentials[key].length > 0
                ? res.credentials[key].slice(limit * (page - 1), limit * page)
                : []
            )
            setPaginationValue(res.credentials[key].length)
            setCredentialArray(res.credentials[key])

            if (filterActive.length > 0) {
              setFilterUserActive(filterActive)
              setSelectValueAccess(JSON.stringify(filterActive[0]))
            } else {
              setFilterUserActive([])
              setSelectValueAccess(0)
            }

            res.credentials[key].filter((elem) =>
              elem.users.length > 0 ? users.push(elem) : null
            )
          } else {
            setDataTableFilter([])
          }
          setDataTableFilter(users)
        }
        dispatch(showLoder({ getDataTable: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ getDataTable: 0, status: err.status }))
      })
  }

  const createAccessAdd = (e) => {
    paramsAccess = {
      company_name: nameCountry,
      country_id: countrySelect,
      login: LogIn,
      buyerCode:
        idAuctions.code === 'copart' || idAuctions.code === 'copartCanada'
          ? LogIn
          : buyer,
      password: password,
      auction_id: idAuctions.id,
      paywall,
      price_buy,
      active,
      carrier_id,
    }
    e.preventDefault()

    dispatch(showLoder({ createAccessAdd: 1 }))

    postRequest('/api/v1/credentials', paramsAccess)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Доступ успешно добавлен!', 'success')
          reset()
          getDataTable()
          dispatch(showLoder({ createAccessAdd: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ createAccessAdd: 0, status: err.status }))
      })
  }

  const editCredential = (e) => {
    dispatch(showLoder({ editCredential: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    paramsAccess = {
      company_name: nameCountry,
      country_id: countrySelect,
      login: LogIn,
      buyerCode:
        idAuctions.code === 'copart' || idAuctions.code === 'copartCanada'
          ? LogIn
          : buyer,
      password: password,
      auction_id: idAuctions.id,
      paywall,
      price_buy,
      active,
      carrier_id,
    }

    putRequest(`/api/v1/credentials/${editId}`, paramsAccess)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно выполнено!', 'success')
          getDataTable()
          dispatch(showLoder({ editCredential: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editCredential: 0, status: err.status }))
      })
  }

  const remove = (idCred, idUser) => {
    dispatch(showLoder({ remove: 1 }))
    postRequest(`/api/v1/credentials/${idCred}/unlink`, { users: [+idUser] })
      .then((res) => {
        state.createNotification('Доступ успешно отвязан!', 'success')
        getDataTable()
        dispatch(showLoder({ remove: 0 }))
        close()
      })

      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0, status: err.status }))
      })
  }

  const showEditCredential = ({
    company_name,
    country,
    id,
    login,
    buyerCode,
    password,
    paywall,
    price_buy,
    active,
    carrier,
  }) => {
    setNameCountry(company_name)
    setCountrySelect(country.id)
    setEditId(id)
    setIsModalShowEdit(!isModalShowEdit)
    setLogIn(login)
    setBuyer(buyerCode)
    setPassword(password)
    setPaywall(+paywall === 1 ? true : false)
    setPrice_buy(price_buy)
    setActive(+active === 1 ? true : false)

    setCarrier_id(carrier.id)
  }

  const assingAccess = (e) => {
    let controlUsers = []
    e.preventDefault()
    setIsModalShowEdit(false)
    //Проверка пользователя на существование
    const controlArray = dataTableFilter.find(
      (el) => el.id === +JSON.parse(selectValueAccess).id
    )

    if (controlArray) {
      controlUsers = controlArray.users.filter(
        (chaild) => +chaild.user_id === +selectValueUser
      )
    }

    paramsAccess = {
      login: JSON.parse(selectValueAccess).login,
      buyerCode: JSON.parse(selectValueAccess).buyerCode,
      password: JSON.parse(selectValueAccess).password,
      auction_id: idAuctions.id,
      users: [+selectValueUser],
      company_name: JSON.parse(selectValueAccess).company_name,
      country_id: JSON.parse(selectValueAccess).country.id,
      paywall: JSON.parse(selectValueAccess).paywall,
      price_buy: JSON.parse(selectValueAccess).price_buy,
      active: JSON.parse(selectValueAccess).active,
      carrier_id: JSON.parse(selectValueAccess).carrier.id,
    }

    if (controlUsers.length > 0) {
      state.createNotification('Доступ уже был добавлен!', 'error')
    } else {
      dispatch(showLoder({ credentials: 1 }))
      putRequest(
        `/api/v1/credentials/${JSON.parse(selectValueAccess).id}`,
        paramsAccess
      )
        .then((res) => {
          if (res.status === 'success') {
            state.createNotification('Доступ успешно назначен!', 'success')
            getDataTable()
            dispatch(showLoder({ credentials: 0 }))
          }
        })
        .catch((err) => {
          state.createNotification('Проверьте веденные данные!', 'error')
          dispatch(showLoder({ credentials: 0, status: err.status }))
        })
    }
  }

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
      ).includes('credential')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).credential.access_rights

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

  useEffect(() => {
    dispatch(showLoder({ countries: 1 }))
    getRequest(`/api/v1/countries`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCountryArray(res.countries)
        setCountrySelect(res.countries[0].id)

        dispatch(showLoder({ countries: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ countries: 0, status: err.status }))
      })
  }, [])

  // const controlViewBtn = (val) => {
  //   let bool = true
  //   if (val == '+ Добавить новый доступ') return viewBlock(96) ? true : false
  //   if (val == '+ Назначить доступ пользователю')
  //     return viewBlock(98) ? true : false

  //   return bool
  // }

  const controlViewBtn = (val) => {
    let bool = true
    if (val == '+ Добавить новый доступ') {
      bool = viewBlock(96) ? true : false
    }
    if (val == '+ Назначить доступ пользователю') {
      if (!filterUserActive.length > 0 || !dataUser.length > 0) {
        bool = false
      } else {
        bool = viewBlock(98) ? true : false
      }
    }

    return bool
  }

  useEffect(() => {
    let usersBlock = []
    let res

    dataTableFilter.map((elem) => {
      if (+elem.id === +JSON.parse(selectValueAccess).id) {
        elem.users.map((user) => usersBlock.push(user.user_id))
      }
    })

    if (usersBlock.length > 0) {
      res = dataUser.map((elem) =>
        usersBlock.includes(+elem.id) ? { ...elem, dopTitle: 'Назначен' } : elem
      )
    } else {
      res = dataUser
    }

    return setDataUser(res)
  }, [selectValueAccess, dataTableFilter])

  const close = () => {
    setDataContainerData([])
    setIsModalEnd(false)
    setIsModalShowEdit(false)
  }
  const optionValue = ({ email, fullName, city, dopTitle = '' }) =>
    email + ' ' + fullName + ' ' + city + ' ' + dopTitle

  const searchRequest = () => {
    dispatch(showLoder({ searchRequest: 1 }))
    postRequest(`/api/v1/credentials/search`, paramsSearch)
      .then((res) => {
        let users = []
        for (const key in res.credentials) {
          if (idAuctions.code === key) {
            const filterActive = res.credentials[key].filter((el) => el.active)
            if (filterActive.length > 0) {
              setFilterUserActive(filterActive)
              setSelectValueAccess(JSON.stringify(filterActive[0]))
            } else {
              setFilterUserActive([])
              setSelectValueAccess(0)
            }

            setDataMaster(
              res.credentials[key].slice(limit * (page - 1), limit * page)
            )

            setPaginationValue(res.credentials[key].length)

            res.credentials[key].filter((elem) =>
              elem.users.length > 0 ? users.push(elem) : null
            )
          }

          setDataTableFilter(users)
        }
        dispatch(showLoder({ searchRequest: 0 }))
      })
      .catch((err) => {
        state.createNotification('Не найдено!', 'error')
        setDataTableFilter([])
        dispatch(showLoder({ searchRequest: 0, status: err.status }))
      })
  }

  const searchFunc = (e) => {
    const dataView = btnShowBlock.find((el) => el.id == 'Доступы в работе')

    if (e && dataView && dataView.status) {
      if (e.key === 'Enter') {
        e.preventDefault()
        searchRequest()
      }
    } else {
      searchRequest()
    }
  }

  useEffect(() => {
    searchFunc()
  }, [logBuyerSearch])

  const resetSearch = () => {
    setNameSecondNameSearch('')
    setEmailSearch('')
    setLogBuyerSearch(0)
  }

  useEffect(() => {
    const dataView = btnShowBlock.find((el) => el.id == 'Доступы в работе')
    if (!(dataView && dataView.status)) {
      if (nameSecondNameSearch || emailSearch | logBuyerSearch) resetSearch()
    }
  }, [btnShowBlock])

  // const getTitleBelong = (id) => {
  //   if (id) {
  //     const findTitle = carrierArray.find((el) => +el.id === +id)
  //     return findTitle ? findTitle.title : '-'
  //   } else {
  //     return '-'
  //   }
  // }

  const reloadUser = () => {}
  const viewBlockContent = (title, status) => {
    switch (title) {
      case btnShowBlock[0]['id']:
        return (
          <div
            className="accessUsers"
            style={{ display: status ? 'block' : 'none' }}
          >
            <div className="dropBlockContent dropBlockContent--cred">
              <form onSubmit={createAccessAdd}>
                {/* IAAI */}

                <label>
                  <span>Страна</span>
                  <select
                    value={countrySelect}
                    onChange={(event) => setCountrySelect(event.target.value)}
                    required
                  >
                    {countryArray.map((elem, i) => (
                      <option key={elem.id} value={elem.id}>
                        {elem.name_ru}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Название компании</span>
                  <input
                    type="text"
                    placeholder="Название компании"
                    value={nameCountry}
                    onChange={(e) => setNameCountry(e.target.value)}
                    required
                  />
                </label>
                {(idAuctions.code === 'copart' ||
                  idAuctions.code === 'copartCanada') && (
                  <React.Fragment>
                    <label>
                      <span>Log In / Buyer Code</span>
                      <input
                        type="text"
                        placeholder="Log In / Buyer Code"
                        value={LogIn}
                        onChange={(e) => setLogIn(e.target.value)}
                        required
                      />
                    </label>
                  </React.Fragment>
                )}
                {(idAuctions.code === 'iaai' ||
                  idAuctions.code === 'iaaiCanada') && (
                  <React.Fragment>
                    <label>
                      <span>Log In</span>
                      <input
                        type="text"
                        placeholder="Log In"
                        value={LogIn}
                        onChange={(e) => setLogIn(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Buyer Code</span>
                      <input
                        type="text"
                        placeholder="Buyer Code"
                        value={buyer}
                        onChange={(e) => setBuyer(e.target.value)}
                        required
                      />
                    </label>
                  </React.Fragment>
                )}

                <label>
                  <span>Password</span>
                  <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                <label>
                  <span>Принадлежность</span>
                  <select
                    value={carrier_id}
                    onChange={(event) => setCarrier_id(event.target.value)}
                    required
                  >
                    {carrierArray.map((elem, i) => (
                      <option key={elem.id} value={elem.id}>
                        {elem.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Цена покупки</span>
                  <input
                    type="text"
                    placeholder="Цена покупки"
                    value={price_buy}
                    onChange={(e) =>
                      setPrice_buy(controlNumber(e.target.value))
                    }
                    required
                  />
                </label>
                <div className="customCheckbox">
                  <label htmlFor="paywall">
                    <span>Платный доступ</span>
                  </label>

                  <Checkbox
                    id="paywall"
                    value={paywall}
                    checked={paywall}
                    onChange={(e) => {
                      setPaywall(!paywall)
                    }}
                  />
                </div>
                <div className="customCheckbox">
                  <label htmlFor="active">
                    <span>Активность</span>
                  </label>
                  <Checkbox
                    id="active"
                    value={active}
                    checked={active}
                    onChange={(e) => {
                      setActive(!active)
                    }}
                  />
                </div>

                <button className="btn--black" type="submit">
                  Добавить Доступ
                </button>
              </form>
            </div>
          </div>
        )
      case btnShowBlock[1]['id']:
        return (
          <div
            style={{
              display: status ? 'block' : 'none',
            }}
          >
            {dataMaster.length > 0 ? (
              <div className="TableCustom">
                <Table
                  autoHeight
                  cellBordered={true}
                  hover={true}
                  bordered={true}
                  data={dataMaster}
                  // loading={loadingShow}
                >
                  <Column align="center" flexGrow={0.7}>
                    <HeaderCell>Страна</HeaderCell>

                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <span
                            onClick={() =>
                              viewBlock(97) && showEditCredential(rowData)
                            }
                          >
                            {rowData.country.name_ru}
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>

                  <Column align="center" flexGrow={0.5}>
                    <HeaderCell>Название компании</HeaderCell>

                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <span
                            onClick={() =>
                              viewBlock(97) && showEditCredential(rowData)
                            }
                          >
                            {rowData.company_name}
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>
                  {idAuctions.code === 'copart' && (
                    <React.Fragment>
                      <Column align="center" fixed flexGrow={0.7}>
                        <HeaderCell>Log In / Buyer Code</HeaderCell>
                        <Cell>
                          {(rowData, rowIndex) => {
                            return (
                              <span
                                onClick={() =>
                                  viewBlock(97) && showEditCredential(rowData)
                                }
                              >
                                {rowData.login}
                              </span>
                            )
                          }}
                        </Cell>
                      </Column>
                    </React.Fragment>
                  )}
                  {idAuctions.code === 'iaai' && (
                    <React.Fragment>
                      <Column align="center" fixed flexGrow={0.7}>
                        <HeaderCell>Log In </HeaderCell>
                        <Cell>
                          {(rowData, rowIndex) => {
                            return (
                              <span
                                onClick={() =>
                                  viewBlock(97) && showEditCredential(rowData)
                                }
                              >
                                {rowData.login}
                              </span>
                            )
                          }}
                        </Cell>
                      </Column>
                      <Column align="center" fixed flexGrow={0.7}>
                        <HeaderCell>Buyer Code</HeaderCell>
                        <Cell>
                          {(rowData, rowIndex) => {
                            return (
                              <span
                                onClick={() =>
                                  viewBlock(97) && showEditCredential(rowData)
                                }
                              >
                                {rowData.buyerCode}
                              </span>
                            )
                          }}
                        </Cell>
                      </Column>
                    </React.Fragment>
                  )}

                  <Column align="center" flexGrow={0.3}>
                    <HeaderCell>Password</HeaderCell>

                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <span
                            onClick={() =>
                              viewBlock(97) && showEditCredential(rowData)
                            }
                          >
                            <Unvisible />
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>
                  <Column align="center" flexGrow={0.5}>
                    <HeaderCell>Принадлежность</HeaderCell>

                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          // <div
                          //   className="menuDrop"
                          //   onClick={(e) => {
                          //     setDataCurrnetClick({
                          //       data: rowData,
                          //       index: e.target
                          //         .closest('div[aria-rowindex]')
                          //         .getAttribute('aria-rowindex'),
                          //     })
                          //     setShowBlockDrop(!showBlockDrop)
                          //   }}
                          // >
                          //   <MenuIcon />
                          // </div>

                          <span
                            onClick={() =>
                              viewBlock(97) && showEditCredential(rowData)
                            }
                          >
                            {rowData.carrier.title}
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>

                  <Column align="center" flexGrow={0.7}>
                    <HeaderCell>Цена покупки</HeaderCell>

                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <span
                            onClick={() =>
                              viewBlock(97) && showEditCredential(rowData)
                            }
                          >
                            {rowData.price_buy}
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>

                  <Column align="center" flexGrow={0.5}>
                    <HeaderCell>Платный доступ</HeaderCell>

                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <span
                            onClick={() =>
                              viewBlock(97) && showEditCredential(rowData)
                            }
                          >
                            {rowData.paywall ? <Check /> : <Close />}
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>

                  {viewBlock(97) ||
                    (viewBlock(99) && (
                      <Column align="center" flexGrow={1}>
                        <HeaderCell>Действие</HeaderCell>
                        <Cell>
                          {(rowData, rowIndex) => {
                            return (
                              <div>
                                <div className="Dropdown">
                                  <div className="DropdownShow">
                                    {viewBlock(97) && (
                                      <button
                                        onClick={() =>
                                          showEditCredential(rowData)
                                        }
                                      >
                                        <Edit />
                                      </button>
                                    )}
                                    {viewBlock(99) && (
                                      <button
                                        onClick={() => reloadUser(rowData.id)}
                                      >
                                        <Trash />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          }}
                        </Cell>
                      </Column>
                    ))}

                  <Column align="center" flexGrow={0.5}>
                    <HeaderCell>Активность</HeaderCell>

                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <span
                            onClick={() =>
                              viewBlock(97) && showEditCredential(rowData)
                            }
                          >
                            {rowData.active ? <Check /> : <Close />}
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>
                </Table>
                <div className="paginationBlock">
                  <Pagination
                    prev
                    next
                    // first
                    // last
                    ellipsis
                    // boundaryLinks
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
              </div>
            ) : (
              'Нет данных!'
            )}
          </div>
        )
      case btnShowBlock[2]['id']:
        return (
          <div
            className="accessUsers"
            style={{ display: status ? 'block' : 'none' }}
          >
            {dataMaster.length > 0 ? (
              <form onSubmit={assingAccess}>
                <label>
                  <span>Доступ</span>
                  {filterUserActive.length > 0 ? (
                    <select
                      value={selectValueAccess}
                      onChange={(event) =>
                        setSelectValueAccess(event.target.value)
                      }
                    >
                      {filterUserActive.map((elem, i) => (
                        <option
                          value={JSON.stringify(elem)}
                          key={i + elem.buyerCode}
                        >
                          {elem.auction_name + '-' + elem.buyerCode}
                        </option>
                      ))}
                    </select>
                  ) : (
                    'Нет даных'
                  )}
                </label>
                <label>
                  <span>Пользователь</span>
                  {dataUser.length > 0 ? (
                    <select
                      value={selectValueUser}
                      onChange={(event) =>
                        setSelectValueUser(event.target.value)
                      }
                    >
                      {dataUser.map((elem) => {
                        return (
                          <option value={elem.id} key={elem.id + elem.email}>
                            {optionValue(elem)}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    'Пользователей нет!'
                  )}
                </label>
                {filterUserActive.length > 0 && (
                  <button className="btn--black" type="submit">
                    Назначить доступ
                  </button>
                )}
              </form>
            ) : (
              'Нет пользователей!'
            )}
          </div>
        )

      case btnShowBlock[3]['id']:
        return (
          <div
            style={{ display: status ? 'block' : 'none' }}
            className="overFlowBlock overFlowBlock--cred"
          >
            <div className="searchGroup groupInput groupInput-auto">
              <form
                onSubmit={searchFunc}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                {/* name */}
                <label>
                  <input
                    type="text"
                    value={nameSecondNameSearch}
                    onChange={(e) => setNameSecondNameSearch(e.target.value)}
                    placeholder="Имя Фамилия"
                  />
                </label>
                {/* email */}
                <label>
                  <input
                    type="text"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    placeholder="E-mail"
                  />
                </label>
                {/* LogBuyer */}
                <label>
                  <select
                    onChange={(e) => setLogBuyerSearch(e.target.value)}
                    value={logBuyerSearch}
                  >
                    <option key="0" value="0">
                      Buyer Code
                    </option>
                    {credentialArray &&
                      credentialArray.map((e, i) => (
                        <option key={nextId() + e.id} value={e.id}>
                          {e.buyerCode}
                        </option>
                      ))}
                  </select>
                </label>
              </form>
            </div>
            {dataTableFilter.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Имя Фамилия</th>
                    <th>Email</th>
                    <th>Офис / Дилер</th>
                    <th>Город</th>
                    {idAuctions.code === 'copart' && (
                      <th>Log in / Buyer Code</th>
                    )}
                    {idAuctions.code === 'iaai' && (
                      <React.Fragment>
                        <th>Log in</th>
                        <th>Buyer Code</th>
                      </React.Fragment>
                    )}

                    <th>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTableFilter.map((elem) => {
                    return elem.users.map((elemChaild, i) => (
                      <tr key={elemChaild.name_ru + i}>
                        <td>
                          {elemChaild.name_ru + ' ' + elemChaild.second_name_ru}
                        </td>
                        <td>{elemChaild.email}</td>
                        <td>{elemChaild.userRoleName}</td>

                        <td>{elemChaild.city_name}</td>

                        {idAuctions.code === 'copart' && <td>{elem.login}</td>}
                        {idAuctions.code === 'iaai' && (
                          <React.Fragment>
                            <td>{elem.login}</td>
                            <td>{elem.buyerCode}</td>
                          </React.Fragment>
                        )}
                        <td>
                          <div>
                            <div className="Dropdown">
                              {viewBlock(100) && (
                                <div className="DropdownShow">
                                  <Trash
                                    onClick={() => {
                                      setIsModalEnd(true)

                                      setDataContainerData({
                                        idCred: elem.id,
                                        idUser: elemChaild.user_id,
                                      })
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  })}
                </tbody>
              </table>
            ) : (
              <span style={{ fontSize: '14px' }}>Нет даных!</span>
            )}
          </div>
        )

      default:
        break
    }
  }

  useEffect(() => {
    const dataView = btnShowBlock.find((el) => el.id == btnShowBlock[3]['id'])

    if (dataView && dataView.status)
      document.addEventListener('keydown', searchFunc)

    return () => {
      document.removeEventListener('keydown', searchFunc)
    }
  })

  // const valuePosition = (val) => {
  //   let res
  //   let boll = 265

  //   if (val) {
  //     res = val * 45.5 + boll
  //   } else {
  //     res = 190
  //   }
  //   return res
  // }

  // const Panel = React.forwardRef(({ ...props }, ref) => (
  //   <div
  //     {...props}
  //     ref={ref}
  //     style={{
  //       position: 'absolute',
  //       top: '10px',
  //       right: '10px',
  //       color: '#fff',
  //       zIndex: 100,
  //     }}
  //   >
  //     {dataCurrnetClick && (
  //       <div
  //         className="bottomItem bottomItem--drop"
  //         style={{
  //           width: 'fit-content',
  //           top: valuePosition(+dataCurrnetClick.index),
  //           right:
  //             btnShow.find((el) => el.status).id === 'Copart'
  //               ? '640px'
  //               : '550px',
  //         }}
  //         onMouseLeave={() => setShowBlockDrop(!showBlockDrop)}
  //       >
  //         <div
  //           className="itemElement"
  //           style={{ borderBottom: '1px solid #e9ecef' }}
  //         >
  //           <p
  //             style={{ cursor: 'pointer' }}
  //             onClick={belong({ val: 1, id: dataCurrnetClick.data.id })}
  //           >
  //             AGLogist
  //           </p>
  //           <p
  //             style={{ cursor: 'pointer' }}
  //             onClick={belong({ val: 2, id: dataCurrnetClick.data.id })}
  //           >
  //             AEC
  //           </p>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // ))

  return (
    <div className="itemContainer">
      {/* <Animation.Slide
        unmountOnExit
        transitionAppear
        timeout={300}
        in={showBlockDrop}
        placement={'bottom'}
      >
        {(props, ref) => <Panel {...props} ref={ref} />}
      </Animation.Slide> */}
      <div className="itemContainer-inner">
        <div className="modal-container">
          <Modal
            backdrop={'static'}
            keyboard={false}
            open={isModalShowEdit}
            onClose={() => close()}
          >
            <Modal.Header>
              <Modal.Title>Редактировать локацию</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="dropBlockContent ">
                <form onSubmit={editCredential}>
                  {/* IAAI */}
                  <label>
                    <span>Страна</span>
                    <select
                      value={countrySelect}
                      onChange={(event) => setCountrySelect(event.target.value)}
                      required
                    >
                      {countryArray.map((elem, i) => (
                        <option key={elem.id} value={elem.id}>
                          {elem.name_ru}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Название компании</span>
                    <input
                      type="text"
                      placeholder="Название компании"
                      value={nameCountry}
                      onChange={(e) => setNameCountry(e.target.value)}
                      required
                    />
                  </label>
                  {idAuctions.code === 'copart' && (
                    <React.Fragment>
                      <label>
                        <span>Log In / Buyer Code</span>
                        <input
                          type="text"
                          placeholder="Log In / Buyer Code"
                          value={LogIn}
                          onChange={(e) => setLogIn(e.target.value)}
                          required
                        />
                      </label>
                    </React.Fragment>
                  )}
                  {idAuctions.code === 'iaai' && (
                    <React.Fragment>
                      <label>
                        <span>Log In</span>
                        <input
                          type="text"
                          placeholder="Log In"
                          value={LogIn}
                          onChange={(e) => setLogIn(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        <span>Buyer Code</span>
                        <input
                          type="text"
                          placeholder="Buyer Code"
                          value={buyer}
                          onChange={(e) => setBuyer(e.target.value)}
                          required
                        />
                      </label>
                    </React.Fragment>
                  )}
                  <label>
                    <span>Password</span>
                    <input
                      type="text"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    <span>Принадлежность</span>
                    <select
                      value={carrier_id}
                      onChange={(event) => setCarrier_id(event.target.value)}
                      required
                    >
                      {carrierArray.map((elem, i) => (
                        <option key={elem.id} value={elem.id}>
                          {elem.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Цена покупки</span>
                    <input
                      type="number"
                      placeholder="Цена покупки"
                      value={price_buy}
                      onChange={(e) => setPrice_buy(e.target.value)}
                      required
                    />
                  </label>

                  <div className="customCheckbox">
                    <label htmlFor="paywall" style={{ justifyContent: 'left' }}>
                      <span>Платный доступ</span>
                    </label>

                    <Checkbox
                      id="paywall"
                      value={paywall}
                      onChange={() => setPaywall(!paywall)}
                      checked={paywall}
                    />
                  </div>
                  <div className="customCheckbox">
                    <label htmlFor="active" style={{ justifyContent: 'left' }}>
                      <span>Активность</span>
                    </label>
                    <Checkbox
                      id="active"
                      value={active}
                      checked={active}
                      onChange={(e) => setActive(!active)}
                    />
                  </div>

                  <button className="btn--black" type="submit">
                    Редактировать элемент
                  </button>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <div className="modal-container">
          <Modal
            backdrop={'static'}
            keyboard={false}
            open={isModalEnd}
            onClose={() => close()}
          >
            <Modal.Header>
              <Modal.Title>Отвязование доступа</Modal.Title>
            </Modal.Header>

            <Modal.Body>Вы действительно хотите отвязать доступ?</Modal.Body>
            <Modal.Footer>
              <button
                className="btn-success "
                onClick={() =>
                  remove(dataContainerData.idCred, dataContainerData.idUser)
                }
                appearance="primary"
              >
                Да
              </button>
              <button
                className="btn-danger"
                onClick={() => setIsModalEnd(false)}
                appearance="subtle"
              >
                Нет
              </button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="top-item" style={{ paddingLeft: state.width }}>
          <form>
            <div className="btnTransport">
              {/* <h1 className='titleInfo'>Назначение доступов</h1> */}
            </div>
            <div className="groupInput">
              <div
                className="switcher-btn"
                style={{ display: btnShow.length > 0 ? 'flex' : 'none' }}
              >
                {btnShow.map(({ id, name, country, status }) => {
                  return (
                    <span
                      key={id}
                      onClick={() => chooseItem(name, country.name_ru)}
                      className={status ? 'active' : name}
                    >
                      {name + ' / ' + country.name_ru}
                    </span>
                  )
                })}
              </div>
            </div>
          </form>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          <div className="blockShowOrHide">
            <div className="dropBlock--inner">
              {btnShowBlock.map((item) => {
                return (
                  <React.Fragment key={item.id}>
                    {controlViewBtn(item.id) && (
                      <div
                        className="dropBlock"
                        onClick={() => chooseItemBlock(item.id)}
                        style={{
                          background: item.status ? '#735ba7' : '#fff',
                          color: item.status ? '#fff' : 'black',
                        }}
                      >
                        <span>{item.id}</span>
                      </div>
                    )}
                    {viewBlockContent(item.id, item.status)}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Credentials
