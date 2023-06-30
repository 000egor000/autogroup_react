import React, { useState, useContext, useEffect, memo } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { ArrowRightLine, ArrowDownLine } from '@rsuite/icons'

import { getRequest, postRequest } from '../base/api-request'
import WalletsInner from '../components/WalletsInner'

import ContextApp from '../context/contextApp'
import { Pagination, SelectPicker } from 'rsuite'
import { useParams } from 'react-router-dom'
// import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { showLoder } from '../reducers/actions'
// import nextId from 'react-id-generator'
// import { activeUsers } from '../const.js'

const TransactionsCustom = (props) => {
  const { state, dispatch } = useContext(ContextApp)
  const [titleRates, setTitleRates] = useState('')

  const [cashArray, setCashArray] = useState([])
  const [customCashArray, setCustomCashArray] = useState([])

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
    name && getInfo(name)
    return () => {
      setCashArray([])
      setPaginationValue(0)
      setPartnerArray([])
      setPaginationValuePar(0)
    }
  }, [name, page])

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

      default:
        break
    }
    // if (val === 'auctions') {
    //   setTitleRates('Кошельки: Аукцион')
    //   arrayCashAuction()
    // } else if (val === 'shipping') {
    //   setTitleRates('Кошельки: Перевозка')
    //   arrayCashCarrier()
    // } else if (val === 'agent') {
    //   setTitleRates('Кошельки: Посредники')
    //   arrayCashAgent()
    // } else if (val === 'cashAll') {
    //   setTitleRates('Кошельки: Наличные')
    //   arrayCashAll()
    // } else {
    //   return console.log('incorrect url')
    // }
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
        dispatch(showLoder({ arrayCashAuction: 0, status: err.status }))
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
        dispatch(showLoder({ carrier: 0, status: err.status }))
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
        dispatch(showLoder({ partner: 0, status: err.status }))
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
        dispatch(showLoder({ money: 0, status: err.status }))
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
        dispatch(showLoder({ money: 0, status: err.status }))
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

          dispatch(showLoder({ searchRequest: 0, status: err.status }))
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
        dispatch(showLoder({ auctions: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ carriers: 1 }))
    getRequest('/api/v1/carriers', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCarrierArray(res.carriers)
        dispatch(showLoder({ carriers: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ carriers: 0, status: err.status }))
      })
  }, [])
  useEffect(() => {
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
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ credentials: 0, status: err.status }))
      })
  }, [])

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  // useEffect(() => controlBlock(), [cashArray, partnerArray])

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

  return (
    <div className="itemContainer">
      <div className="itemContainer-inner">
        <div
          className="bottom-itemFooter"
          style={{
            paddingLeft: state.width,
          }}
        >
          <div className="overFlowBlock">
            <table>
              <thead>
                <tr>
                  <th>Название</th>

                  <th>Сумма</th>
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
        </div>
      </div>
    </div>
  )
}
export default memo(TransactionsCustom)
