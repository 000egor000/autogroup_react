import React, { useState, useContext, useEffect } from 'react'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'

import { ArrowRightLine, ArrowDownLine } from '@rsuite/icons'

import { getRequest, postRequest } from '../base/api-request'
import WalletsInner from '../components/WalletsInner'

import ContextApp from '../context/contextApp'
import { Pagination, SelectPicker } from 'rsuite'
import { useParams } from 'react-router-dom'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { showLoder } from '../reducers/actions'
import nextId from 'react-id-generator'
import { activeUsers } from '../const.js'
import NoData from '../components/NoData'

const WalletsAuctions = ({ nameProps, carterId, dataAray }) => {
  const { state, dispatch } = useContext(ContextApp)
  const [titleRates, setTitleRates] = useState('')

  const [cashArray, setCashArray] = useState([])
  // const [customCashArray, setCustomCashArray] = useState([])

  const [carterArray, setCarterArray] = useState([])

  const [dataCredential, setDataCredential] = useState([])
  const [dataCredentialFilter, setDataCredentialFilter] = useState([])
  const [getPriseAll, setGetPriseAll] = useState('')

  const [getPriseAllPlus, setGetPriseAllPlus] = useState('')
  const [partnerArray, setPartnerArray] = useState([])

  const [fio, setFio] = useState('')

  const [email, setEmail] = useState([])
  const [auction, setAuction] = useState([])
  const [auctionArray, setAuctionArray] = useState([])
  const [carrierArray, setCarrierArray] = useState([])
  const [carrier, setCarrier] = useState([])
  const [logBuyerSearchSelect, setLogBuyerSearchSelect] = useState(0)

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState(0)

  const [paginationValuePar, setPaginationValuePar] = useState(0)

  const [dropShow, setDropShow] = useState([])

  const { name } = useParams()

  const [activeUsersSelect, setActiveUsersSelect] = useState(1)

  const [cryptoSearchSelect, setCryptoSearchSelect] = useState('')
  // console.log(cryptoSearchSelect)

  const handleShow = ({ id, max_id, read }) => {
    let filtered = dropShow.filter((e) => id === e)

    if (filtered.length > 0) {
      let removeAccessRights = dropShow.filter((e) => e !== id)
      setDropShow(removeAccessRights)
    } else {
      setDropShow([...dropShow, id])
    }
  }

  const isChecked = (id) => {
    let filtered = dropShow.filter((e) => e === id)

    let bool = filtered.length > 0 ? true : false
    return bool
  }

  useEffect(() => {
    if (nameProps || name) {
      if (nameProps) getInfo(nameProps)
      else if (name) getInfo(name)
    }

    return () => {
      setCashArray([])
      setPaginationValue(0)
      setPartnerArray([])
      setPaginationValuePar(0)
    }
  }, [name, nameProps, page, carterId])

  const reset = () => {
    setFio('')
    setEmail('')
    setCarrier('')
    setAuction(0)
    setLogBuyerSearchSelect(0)
    setActiveUsersSelect(1)
    setDropShow([])
  }

  const getInfo = (val) => {
    switch (val) {
      case 'auctions':
        setTitleRates('Кошельки: Аукцион')
        // getArrayAuctions()
        reset()
        arrayCashAuction()

        break
      case 'shipping':
        setTitleRates('Кошельки: Перевозка')
        reset()
        arrayCashCarrier()
        break

      case 'agent':
        setTitleRates('Кошельки: Посредники')
        reset()
        arrayCashAgent()
        break

      case 'cashAll':
        setTitleRates('Кошельки: Наличные')
        reset()
        arrayCashAll()
        break

      case 'crypto':
        setTitleRates('Кошельки: Крипта')
        reset()
        arrayCashCrypto()
        break
      case 'carter':
        setTitleRates('Кошельки: Перевозчики')
        reset()
        arrayCashCarters()
        break

      default:
        break
    }
  }

  let { title } = JSON.parse(window.sessionStorage.getItem('role'))

  // const controlView = (val) => {
  //   switch (val) {
  //     case 'Дилер':
  //       switch (titleRates) {
  //         case 'Кошельки: Перевозка':
  //           return false
  //         case 'Кошельки: Аукцион':
  //           return false

  //         case 'Кошельки: Наличные':
  //           return true
  //         default:
  //           return true
  //       }

  //     case 'Администратор':
  //     case 'Финансист':
  //       switch (titleRates) {
  //         case 'Кошельки: Наличные':
  //           return true

  //         default:
  //           return false
  //       }

  //     default:
  //       return true
  //   }
  // }

  // partner
  const arrayCashAuction = () => {
    dispatch(showLoder({ arrayCashAuction: 1 }))
    getRequest(`/api/v1/cash-account/auction?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCashArray(
          res.cash_account_auction.slice(limit * (page - 1), limit * page)
        )
        setPaginationValue(res.cash_account_auction.length)
        setGetPriseAll(res.full_sum)
        setGetPriseAllPlus(res.full_plus_sum)
        dispatch(showLoder({ arrayCashAuction: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ arrayCashAuction: 0 }))
        setCashArray([])
        setPaginationValue(0)
      })
  }
  const arrayCashCarrier = () => {
    dispatch(showLoder({ carrier: 1 }))
    getRequest('/api/v1/cash-account/carrier', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCashArray(res.cash_account_carrier)
        setPaginationValue(res.cash_account_carrier.length)
        setGetPriseAll(res.full_sum)
        setGetPriseAllPlus(res.full_plus_sum)
        dispatch(showLoder({ carrier: 0 }))
      })
      .catch((err) => {
        setCashArray([])
        setPaginationValue(0)
        dispatch(showLoder({ carrier: 0 }))
      })
  }

  const arrayCashCarters = () => {
    // const findRes = auctionArray.find((item) => item.code == carterId)
    // console.log(auctionArray)
    // console.log(carterId)
    dispatch(showLoder({ carters: 1 }))
    getRequest(
      `/api/v1/cash-account/carter${carterId ? '?carter_id=' + carterId : ''}`,
      {
        Authorization: `Bearer ${window.sessionStorage.getItem(
          'access_token'
        )}`,
      }
    )
      .then((res) => {
        setCarterArray(res.cashAccountCarter)
        setPaginationValue(res.cashAccountCarter.length)
        dispatch(showLoder({ carters: 0 }))
      })
      .catch((err) => {
        setCarterArray([])
        setPaginationValue(0)
        dispatch(showLoder({ carters: 0 }))
      })
  }

  const arrayCashAgent = () => {
    dispatch(showLoder({ partner: 1 }))
    getRequest('/api/v1/cash-account/partner', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setPartnerArray(res.cashAccountPartner)
        setPaginationValuePar(res.pagination)
        setGetPriseAll(res.full_sum)
        setGetPriseAllPlus(res.full_plus_sum)
        dispatch(showLoder({ partner: 0 }))
      })
      .catch((err) => {
        setPartnerArray([])
        setPaginationValuePar(0)
        dispatch(showLoder({ partner: 0 }))
      })
  }

  // let arrayCashAll = () => {
  // 	getRequest('/api/v1/cash-account/money', {
  // 		Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  // 	})
  // 		.then((res) => {
  // 			setCashArray(res.cash_account_money.slice(limit * (page - 1), limit * page))
  // 			setPaginationValue(res.cash_account_money.length)
  // 			setGetPriseAll(res.full_sum)
  // 			dispatch(hide())
  // 		})
  // 		.catch((err) => {})
  // }

  const arrayCashAll = () => {
    dispatch(showLoder({ money: 1 }))
    getRequest(`/api/v1/cash-account/money?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        // setCashArray(
        //   res.cash_account_money.slice(limit * (page - 1), limit * page)
        // )
        // setPaginationValue(res.cash_account_money.length)
        // setGetPriseAll(res.full_sum)

        setCashArray(res.cash_account_money)
        setPaginationValue(res.pagination)

        setGetPriseAll(res.full_sum ? res.full_sum : '')
        setGetPriseAllPlus(res.full_plus_sum ? res.full_plus_sum : '')
        dispatch(showLoder({ money: 0 }))
      })
      .catch((err) => {
        setPartnerArray([])
        setPaginationValuePar(0)
        dispatch(showLoder({ money: 0 }))
      })
  }

  const arrayCashCrypto = () => {
    dispatch(showLoder({ money: 1 }))
    getRequest(`/api/v1/cash-account/crypto?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        // setCashArray(
        //   res.cash_account_money.slice(limit * (page - 1), limit * page)
        // )
        // setPaginationValue(res.cash_account_money.length)
        // setGetPriseAll(res.full_sum)
        const { cash_account_crypto } = res
        if (cash_account_crypto.length > 0) {
          // const filterArray = cash_account_crypto.map((item) => ({
          //   label: item.name,
          //   value: item.id,
          // }))

          setCashArray(cash_account_crypto)
          // setCustomCashArray(filterArray)
          setPaginationValue(res.pagination)
        }

        setGetPriseAll(res.full_sum ? res.full_sum : '')
        setGetPriseAllPlus(res.full_plus_sum ? res.full_plus_sum : '')
        dispatch(showLoder({ money: 0 }))
      })
      .catch((err) => {
        setPartnerArray([])
        setPaginationValuePar(0)
        dispatch(showLoder({ money: 0 }))
      })
  }

  const searchFunc = (e) => {
    let params = {
      search: {
        fio,
        email,
        auction: JSON.parse(auction).id,
        credential: logBuyerSearchSelect,
        carrier,
        active: activeUsersSelect,
        crypto: cryptoSearchSelect,
      },
    }

    const paramsPath = (name) => {
      switch (name) {
        case 'auctions':
          return 'auction'
        case 'shipping':
          return 'carrier'
        case 'cashAll':
          return 'money'
        case 'crypto':
          return 'crypto'
        // case 'shipping':
        //   return 'partner'

        default:
          return 'money'
      }
    }

    const searchRequest = () => {
      dispatch(showLoder({ searchRequest: 1 }))
      postRequest(`/api/v1/cash-account/${paramsPath(name)}/search`, params)
        .then((res) => {
          if (name === 'auctions') {
            setCashArray(
              res.cash_account_auction.slice(limit * (page - 1), limit * page)
            )
            setPaginationValue(res.cash_account_auction.length)
          } else if (name === 'cashAll') {
            setCashArray(res.cash_account_money)
            setPaginationValue(res.cash_account_money.length)
          } else if (name === 'crypto') {
            setCashArray(res.cash_account_crypto)
            setPaginationValue(res.cash_account_crypto.length)
          } else {
            setCashArray(res.cash_account_carrier)
            setPaginationValue(res.cash_account_carrier.length)
          }
          setGetPriseAll(res.full_sum)
          setGetPriseAllPlus(res.full_plus_sum)
          dispatch(showLoder({ searchRequest: 0 }))
        })
        .catch((err) => {
          setPaginationValue(0)
          setCashArray([])

          dispatch(showLoder({ searchRequest: 0 }))
        })
    }

    if (e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        searchRequest()
      }
    } else {
      searchRequest()
    }
  }

  useEffect(() => {
    if (auctionArray.length > 0) {
      return (
        (carrier || logBuyerSearchSelect || auction || activeUsersSelect,
        cryptoSearchSelect) && searchFunc()
      )
    }
  }, [
    carrier,
    auction,
    auctionArray,
    logBuyerSearchSelect,
    activeUsersSelect,
    cryptoSearchSelect,
  ])

  useEffect(() => {
    getArrayCredentials()
    getArrayCarriers()
    getArrayAuctions()
  }, [])

  const getArrayAuctions = () => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAuctionArray(
          [{ id: 0, name: 'Аукцион' }].concat(
            res.auction.filter((el) => +el.id !== 3)
          )
        )
        setAuction(0)
        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ auctions: 0 }))
      })
  }

  const getArrayCarriers = () => {
    dispatch(showLoder({ carriers: 1 }))
    getRequest('/api/v1/carriers', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCarrierArray(res.carriers)
        dispatch(showLoder({ carriers: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ carriers: 0 }))
      })
  }

  const getArrayCredentials = () => {
    dispatch(showLoder({ credentials: 1 }))
    getRequest(`/api/v1/credentials?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        let credential = []
        for (const key in res.credentials) {
          credential = [...credential, ...res.credentials[key]]
        }

        setDataCredential(credential)
        dispatch(showLoder({ credentials: 0 }))
      })
      .catch((err) => {
        // toast.error('Что-то пошло не так!')
        dispatch(showLoder({ credentials: 0 }))
      })
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  const controlBlock = (title) => {
    switch (title) {
      case 'Кошельки: Аукцион':
      case 'Кошельки: Перевозка':
      case 'Кошельки: Наличные':
        return cashArray && cashArray.length > 0 ? (
          title !== 'Кошельки: Наличные' ? (
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    <React.Fragment>
                      <th>Фамилия Имя</th>
                      <th>E-mail</th>
                      <th>Офис/Дилер</th>
                    </React.Fragment>

                    {title === 'Кошельки: Перевозка' ? (
                      <th>Перевозчик</th>
                    ) : title === 'Кошельки: Аукцион' ? (
                      <React.Fragment>
                        <th>Аукцион</th>
                        <th>Buyer Code</th>
                      </React.Fragment>
                    ) : (
                      ''
                    )}

                    <th> Баланс</th>
                  </tr>
                </thead>

                {cashArray.map((e, i) => {
                  return (
                    <tbody key={e + i}>
                      <tr>
                        <React.Fragment>
                          <td onClick={() => handleShow(e)}>
                            {isChecked(e.id) ? (
                              <ArrowRightLine />
                            ) : (
                              <ArrowDownLine />
                            )}
                            {e.role.second_name_ru + ' ' + e.role.name_ru}
                          </td>
                          <td onClick={() => handleShow(e)}>{e.user.email}</td>
                          <td onClick={() => handleShow(e)}>
                            {e.user_role.title}
                          </td>
                        </React.Fragment>

                        {title === 'Кошельки: Перевозка' ? (
                          <td onClick={() => handleShow(e)}>
                            {e.carrier ? e.carrier.title : ''}
                          </td>
                        ) : title === 'Кошельки: Аукцион' ? (
                          <React.Fragment>
                            <td onClick={() => handleShow(e)}>
                              {String(e.name).split('_')[0]}
                            </td>
                            <td onClick={() => handleShow(e)}>
                              {e.credential ? e.credential.buyerCode : ''}
                            </td>
                          </React.Fragment>
                        ) : (
                          ''
                        )}
                        <td onClick={() => handleShow(e)}>{e.cash + ' $'}</td>
                      </tr>
                      {isChecked(e.id) && (
                        <WalletsInner
                          dataAray={e.trasport_auto_information}
                          resView={isChecked(e.id)}
                          idItem={e.id}
                          nameAndSecondName={
                            e.role.second_name_ru + ' ' + e.role.name_ru
                          }
                          titleRates={title}
                        />
                      )}
                    </tbody>
                  )
                })}
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
            </div>
          ) : (
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    <th>Название</th>

                    <th> Баланс</th>
                  </tr>
                </thead>

                {cashArray.map((e, i) => {
                  return (
                    <tbody key={e + i}>
                      <tr>
                        <td onClick={() => handleShow(e)}>
                          {isChecked(e.id) ? (
                            <ArrowRightLine />
                          ) : (
                            <ArrowDownLine />
                          )}
                          <span>AutoGroupKz</span>
                        </td>
                        <td onClick={() => handleShow(e)}>{e.cash}</td>
                      </tr>
                      {isChecked(e.id) && (
                        <WalletsInner
                          dataAray={e.trasport_auto_information}
                          resView={isChecked(e.id)}
                          idItem={e.id}
                          //   nameAndSecondName={
                          //   e.role.second_name_ru + ' ' + e.role.name_ru
                          // }
                          titleRates={title}
                        />
                      )}
                    </tbody>
                  )
                })}
              </table>
              {/* <div className="paginationBlock">
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
              </div> */}
            </div>
          )
        ) : (
          <NoData />
        )
      case 'Кошельки: Крипта':
        return cashArray && cashArray.length > 0 ? (
          title !== 'Кошельки: Крипта' ? (
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    <React.Fragment>
                      <th>Фамилия Имя</th>
                      <th>E-mail</th>
                      <th>Офис/Дилер</th>
                    </React.Fragment>

                    {title === 'Кошельки: Перевозка' ? (
                      <th>Перевозчик</th>
                    ) : title === 'Кошельки: Аукцион' ? (
                      <React.Fragment>
                        <th>Аукцион</th>
                        <th>Buyer Code</th>
                      </React.Fragment>
                    ) : (
                      ''
                    )}

                    <th> Баланс</th>
                  </tr>
                </thead>

                {cashArray.map((e, i) => {
                  return (
                    <tbody key={e + i}>
                      <tr>
                        <React.Fragment>
                          <td onClick={() => handleShow(e)}>
                            {isChecked(e.id) ? (
                              <ArrowRightLine />
                            ) : (
                              <ArrowDownLine />
                            )}
                            {e.role.second_name_ru + ' ' + e.role.name_ru}
                          </td>
                          <td onClick={() => handleShow(e)}>{e.user.email}</td>
                          <td onClick={() => handleShow(e)}>
                            {e.user_role.title}
                          </td>
                        </React.Fragment>

                        {title === 'Кошельки: Перевозка' ? (
                          <td onClick={() => handleShow(e)}>
                            {e.carrier ? e.carrier.title : ''}
                          </td>
                        ) : title === 'Кошельки: Аукцион' ? (
                          <React.Fragment>
                            <td onClick={() => handleShow(e)}>
                              {String(e.name).split('_')[0]}
                            </td>
                            <td onClick={() => handleShow(e)}>
                              {e.credential ? e.credential.buyerCode : ''}
                            </td>
                          </React.Fragment>
                        ) : (
                          ''
                        )}
                        <td onClick={() => handleShow(e)}>{e.cash + ' $'}</td>
                      </tr>
                      {isChecked(e.id) && (
                        <WalletsInner
                          dataAray={e.trasport_auto_information}
                          resView={isChecked(e.id)}
                          idItem={e.id}
                          nameAndSecondName={
                            e.role.second_name_ru + ' ' + e.role.name_ru
                          }
                          titleRates={title}
                        />
                      )}
                    </tbody>
                  )
                })}
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
            </div>
          ) : (
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Крипта</th>

                    <th> Баланс</th>
                    <th> Курс</th>
                    <th> Баланс ($)</th>
                  </tr>
                </thead>

                {cashArray.map((e, i) => {
                  return (
                    <tbody key={e + i}>
                      <tr>
                        <td onClick={() => handleShow(e)}>
                          {isChecked(e.id) ? (
                            <ArrowRightLine />
                          ) : (
                            <ArrowDownLine />
                          )}
                          <span>{e.name}</span>
                        </td>
                        <td onClick={() => handleShow(e)}>
                          {e.crypto.hasOwnProperty('name') && e.crypto.name}
                          {e.crypto.hasOwnProperty('symbol') && e.crypto.symbol}
                        </td>
                        <td onClick={() => handleShow(e)}>{e.cash}</td>
                        <td onClick={() => handleShow(e)}>
                          {e.crypto.usd_price + ' $'}
                        </td>
                        <td onClick={() => handleShow(e)}>
                          {e.cash_usd + ' $'}
                        </td>
                      </tr>
                      {isChecked(e.id) && (
                        <WalletsInner
                          dataAray={e.trasport_auto_information}
                          resView={isChecked(e.id)}
                          idItem={e.id}
                          //   nameAndSecondName={
                          //   e.role.second_name_ru + ' ' + e.role.name_ru
                          // }
                          titleRates={title}
                        />
                      )}
                    </tbody>
                  )
                })}
              </table>
              {/* <div className="paginationBlock">
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
              </div> */}
            </div>
          )
        ) : (
          <NoData />
        )

      case 'Кошельки: Посредники':
        return partnerArray && partnerArray.length > 0 ? (
          <div className="Table">
            <Table
              autoHeight
              cellBordered={true}
              hover={true}
              bordered={true}
              data={partnerArray}
            >
              <Column align="center" fixed flexGrow={1}>
                <HeaderCell>Название</HeaderCell>
                <Cell>
                  {title === 'Кошельки: Посредники'
                    ? (rowData, rowIndex) => {
                        return <span>{rowData.partner.name}</span>
                      }
                    : 'AgLogistic'}
                </Cell>
              </Column>
              <Column align="center" fixed flexGrow={1}>
                <HeaderCell>Баланс</HeaderCell>
                <Cell>
                  {(rowData, rowIndex) => {
                    return <span>{rowData.cash + ' $'}</span>
                  }}
                </Cell>
              </Column>
            </Table>
            <div className="paginationBlock">
              <Pagination
                prev
                next
                ellipsis
                maxButtons={5}
                size="xs"
                layout={['total', 'pager']}
                total={paginationValuePar.total_results}
                limitOptions={[5, 10]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>
          </div>
        ) : (
          <NoData />
        )

      case 'Кошельки: Перевозчики':
        return carterArray && carterArray.length > 0 ? (
          <div className="overFlowBlock">
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>сумма</th>
                </tr>
              </thead>

              {carterArray.map((e, i) => {
                return (
                  <tbody key={e + i}>
                    <tr>
                      <td onClick={() => handleShow(e)}>
                        {isChecked(e.id) ? (
                          <ArrowRightLine />
                        ) : (
                          <ArrowDownLine />
                        )}
                        <span>{e.name}</span>
                      </td>

                      <td onClick={() => handleShow(e)}>{e.cash}</td>
                    </tr>
                    {isChecked(e.id) && (
                      <WalletsInner
                        dataAray={e.trasport_auto_information}
                        resView={isChecked(e.id)}
                        idItem={e.id}
                        //   nameAndSecondName={
                        //   e.role.second_name_ru + ' ' + e.role.name_ru
                        // }
                        titleRates={title}
                      />
                    )}
                  </tbody>
                )
              })}
            </table>
            {/* <div className="paginationBlock">
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
            </div> */}
          </div>
        ) : (
          <NoData />
        )

      default:
        return <NoData />
    }
  }
  useEffect(() => controlBlock(), [cashArray, partnerArray])

  useEffect(() => {
    if (
      titleRates !== 'Кошельки: Наличные' &&
      titleRates !== 'Кошельки: Посредники'
    )
      document.addEventListener('keydown', searchFunc)

    return () => {
      document.removeEventListener('keydown', searchFunc)
    }
  })

  useEffect(() => {
    if (dataCredential.length > 0) {
      let resFilter = []

      dataCredential.map((el) =>
        el.auction_name === JSON.parse(auction).name ? resFilter.push(el) : null
      )

      setDataCredentialFilter(
        [{ id: 0, buyerCode: 'Buyer code' }].concat(resFilter)
      )
      setLogBuyerSearchSelect(0)
    }
  }, [auction, dataCredential])

  const styleTopitem = {
    alignItems: 'baseline',
    justifyContent: 'space-between',
    display:
      // titleRates === 'Кошельки: Наличные' ||
      titleRates === 'Кошельки: Посредники' ||
      titleRates === 'Кошельки: Перевозчики' ||
      titleRates === ''
        ? 'none'
        : 'flex',
  }

  return (
    <div className="itemContainer">
      <ToastContainer />

      <div className="itemContainer-inner">
        <div
          className="top-item"
          style={{
            paddingLeft: state.width,
            ...styleTopitem,
          }}
        >
          <div className="searchGroup groupInput groupInput-auto">
            <form onSubmit={searchFunc} className="formCus">
              {title !== 'Дилер' && name !== 'crypto' && (
                <label>
                  <input
                    className=""
                    type="text"
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
                    placeholder="Имя Фамилия"
                  />
                </label>
              )}
              {title !== 'Дилер' && name !== 'crypto' && (
                <label>
                  <input
                    className=""
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                  />
                </label>
              )}

              {name === 'shipping' && (
                <label>
                  <select
                    onChange={(e) => setCarrier(e.target.value)}
                    value={carrier}
                  >
                    <option key="0" value="0">
                      Перевозчик
                    </option>
                    {carrierArray &&
                      carrierArray.map((e, i) => (
                        <option key={e.id + i} value={e.id}>
                          {e.title}
                        </option>
                      ))}
                  </select>
                </label>
              )}

              {name === 'auctions' && (
                <label>
                  <select
                    onChange={(e) => setAuction(e.target.value)}
                    value={auction}
                  >
                    {auctionArray.length > 0 &&
                      auctionArray.map((e, i) => (
                        <option key={e.id + i} value={JSON.stringify(e)}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </label>
              )}

              {name === 'auctions' && (
                <label>
                  <select
                    onChange={(e) => setLogBuyerSearchSelect(e.target.value)}
                    value={logBuyerSearchSelect}
                  >
                    {dataCredentialFilter &&
                      dataCredentialFilter.map((e, i) => (
                        <option key={nextId() + e.id} value={e.id}>
                          {e.buyerCode}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {(name === 'auctions' || name === 'shipping') && (
                <label>
                  <select
                    onChange={(e) => setActiveUsersSelect(e.target.value)}
                    value={activeUsersSelect}
                  >
                    {activeUsers.map((e, i) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {name == 'crypto' && (
                <SelectPicker
                  data={cashArray}
                  valueKey="id"
                  labelKey="name"
                  value={cryptoSearchSelect}
                  onChange={setCryptoSearchSelect}
                  loading={!cashArray.length}
                />
              )}
            </form>
          </div>
          <div className="btnTransport">
            <input
              className="positiveSum"
              type="button"
              disabled
              value={getPriseAllPlus + ' $'}
            />
            <input type="button" disabled value={getPriseAll + ' $'} />
          </div>
        </div>

        <div
          className="bottom-itemFooter"
          style={{
            paddingLeft: state.width,
          }}
        >
          {controlBlock(titleRates)}
        </div>
      </div>
    </div>
  )
}
export default WalletsAuctions
