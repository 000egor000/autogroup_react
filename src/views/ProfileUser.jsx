import React, { useState, useContext, useEffect } from 'react'

import { useParams } from 'react-router-dom'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import { Send } from '@rsuite/icons'
import { btnShowBlockProfile, walletsVariant } from '../const'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Pagination } from 'rsuite'
import { getRequest } from '../base/api-request'
import { PieChart } from '@rsuite/charts'

import NoData from '../components/NoData'

const ProfileUser = () => {
  const [btnShowBlock, setBtnShowBlock] = useState(btnShowBlockProfile)
  const { idUsers } = useParams()
  const { state, dispatch } = useContext(ContextApp)
  const [dataContainer, setDataContainer] = useState([])
  const [filterUserActive, setFilterUserActive] = useState([])
  const [cashArray, setCashArray] = useState([])
  const [cashArrayDefault, setCashArrayDefault] = useState([])
  const [carrierArray, setCarrierArray] = useState([])
  const [carrierArrayDefault, setCarrierArrayDefault] = useState([])
  const [btnShow, setBtnShow] = useState(walletsVariant)
  const [currentValue, setCurrentValue] = useState(walletsVariant[0]['name'])
  const [currentBlock, setCurrentBlock] = useState('')

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState(0)

  const { birthday, name_ru, phone, second_name_ru, telegram } = JSON.parse(
    window.sessionStorage.getItem('client')
  )
  let { email } = JSON.parse(window.sessionStorage.getItem('user'))

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  const controlViewBtn = (val) => {
    let bool = true
    // if (val == '+ Добавить новый доступ') {
    //   bool = viewBlock(96) ? true : false
    // }
    // if (val == '+ Назначить доступ пользователю') {
    //   if (!filterUserActive.length > 0 || !dataUser.length > 0) {
    //     bool = false
    //   } else {
    //     bool = viewBlock(98) ? true : false
    //   }
    // }

    return bool
  }
  const chooseItem = (id) => {
    const newArr = btnShow.map((item) => {
      return item.name === id
        ? { ...item, status: true }
        : { ...item, status: false }
    })
    setBtnShow(newArr)
  }

  const chooseItemBlock = (id) => {
    setCurrentBlock(id)
    setPage(1)
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
  }

  useEffect(() => {
    if (btnShow.length > 0) {
      const result = btnShow.find((elem) => elem.status)
      setPage(1)
      setCurrentValue(result.name)
    }
  }, [btnShow])

  const resetStylemasterCreate = {
    position: 'none',
    top: 0,
    marginBottom: '10px',
  }

  const getUserActive = (credentials) => {
    dispatch(showLoder({ credentials: 1 }))
    getRequest(`/api/v1/credentials?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then(({ credentials }) => {
        if (credentials) {
          let valueAccess = []
          for (const key in credentials) {
            credentials[key].map((el) => {
              if (el.active) valueAccess.push(el)
            })
          }

          if (valueAccess.length > 0) {
            setFilterUserActive(
              valueAccess.slice(limit * (page - 1), limit * page)
            )
            setPaginationValue(valueAccess.length)
          } else {
            setFilterUserActive([])
            setPaginationValue(0)
          }
        }
        dispatch(showLoder({ credentials: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ credentials: 0 ,status: err.status}))
      })
  }
  const resetArray = () => {
    setCarrierArrayDefault([])
    setCashArrayDefault([])
  }
  useEffect(() => {
    switch (currentBlock) {
      case ' Данные Пользователя':
        return
      case 'Доступы':
        return getUserActive()
      case 'Кошельки':
        resetArray()
        return currentValue === 'Аукцион'
          ? arrayCashAuction()
          : arrayCashCarrier()
      case 'Пользовательские соглашения':
        return

      default:
        break
    }
  }, [currentValue, page, currentBlock])

  const arrayCashAuction = () => {
    dispatch(showLoder({ arrayCashAuction: 1 }))
    getRequest(`/api/v1/cash-account/auction?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const defaultparams = []
        res.cash_account_auction.map((el) => {
          defaultparams.push([el.credential.buyerCode, el.cash])
        })
        setCashArrayDefault(defaultparams)
        setCashArray(
          res.cash_account_auction.slice(limit * (page - 1), limit * page)
        )
        setPaginationValue(res.cash_account_auction.length)
        dispatch(showLoder({ arrayCashAuction: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ arrayCashAuction: 0,status: err.status }))
        setCashArray([])
      })
  }

  const arrayCashCarrier = () => {
    dispatch(showLoder({ carrier: 1 }))
    getRequest(`/api/v1/cash-account/carrier?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const defaultparams = []

        res.cash_account_carrier.map((el) =>
          defaultparams.push([el.name, el.cash])
        )

        setCarrierArrayDefault(defaultparams)
        setCarrierArray(
          res.cash_account_carrier.slice(limit * (page - 1), limit * page)
        )
        setPaginationValue(res.cash_account_carrier.length)

        dispatch(showLoder({ carrier: 0 }))
      })
      .catch((err) => {
        setCarrierArray([])

        dispatch(showLoder({ carrier: 0,status: err.status }))
      })
  }

  const controlBlock = (val) => {
    switch (val) {
      case 'Аукцион':
        return cashArray.length > 0 && currentValue === 'Аукцион' ? (
          <div className="TableCustom">
            <Table
              autoHeight
              cellBordered={true}
              hover={true}
              bordered={true}
              data={cashArray}

              // loading={loadingShow}
            >
              <Column align="center" flexGrow={1}>
                <HeaderCell>Аукцион</HeaderCell>

                <Cell>
                  {(rowData, rowIndex) => {
                    return <span>{String(rowData.name).split('_')[0]}</span>
                  }}
                </Cell>
              </Column>

              <Column align="center" flexGrow={1}>
                <HeaderCell>Buyer Code</HeaderCell>

                <Cell>
                  {(rowData, rowIndex) => {
                    return (
                      <span>
                        {rowData.credential ? rowData.credential.buyerCode : ''}
                      </span>
                    )
                  }}
                </Cell>
              </Column>
              <Column align="center" flexGrow={1}>
                <HeaderCell>Баланс</HeaderCell>

                <Cell>
                  {(rowData, rowIndex) => {
                    return <span>{rowData.cash + ' $'}</span>
                  }}
                </Cell>
              </Column>
            </Table>
          </div>
        ) : (
          <NoData />
        )

      case 'Перевозка':
        return carrierArray.length > 0 && currentValue === 'Перевозка' ? (
          <div className="TableCustom">
            <Table
              autoHeight
              cellBordered={true}
              hover={true}
              bordered={true}
              data={carrierArray}
            >
              <Column align="center" flexGrow={1}>
                <HeaderCell>Перевозчик</HeaderCell>

                <Cell>
                  {(rowData, rowIndex) => {
                    return (
                      <span>
                        {rowData.carrier ? rowData.carrier.title : ''}
                      </span>
                    )
                  }}
                </Cell>
              </Column>

              <Column align="center" flexGrow={1}>
                <HeaderCell>Баланс</HeaderCell>

                <Cell>
                  {(rowData, rowIndex) => {
                    return <span>{rowData.cash + ' $'}</span>
                  }}
                </Cell>
              </Column>
            </Table>
          </div>
        ) : (
          <NoData />
        )

      default:
        return <NoData />
    }
  }

  const viewBlockContent = (title, status) => {
    switch (title) {
      // Данные Пользователя
      case btnShowBlockProfile[0]['id']:
        return (
          <div
            className="itemBlock"
            style={{
              display: status ? 'block' : 'none',
            }}
          >
            <div className="masterCreate--inner" style={resetStylemasterCreate}>
              <div className="topItem">
                <div className="leftItemElement">
                  <h2>Информация</h2>
                  <div className="helpItem">
                    <div className="fistPies">
                      <label>
                        <span>Фамилия</span>
                        <input
                          type="text"
                          placeholder="Фамилия"
                          value={second_name_ru}
                          disabled
                        />
                      </label>
                      <label>
                        <span>Имя</span>
                        <input
                          type="text"
                          placeholder="Имя"
                          value={name_ru}
                          disabled
                        />
                      </label>
                      <label>
                        <span>Дата рождения</span>
                        <input
                          type="date"
                          placeholder="Дата рождения"
                          value={birthday}
                          disabled
                          max="2999-12-31"
                        />
                      </label>
                    </div>
                    <div className="secondPies">
                      <div></div>
                      <label>
                        <span>Email</span>
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          disabled
                        />
                      </label>
                      <label>
                        <span>Телефон</span>
                        <input
                          type="text"
                          placeholder="Телефон"
                          value={phone}
                          disabled
                        />
                      </label>
                      <label>
                        <div className="helpTelegramBlock">
                          <Send />
                          <span>Telegram</span>
                          <input
                            type="checkbox"
                            checked={telegram === phone}
                            disabled
                          />
                          <span>тот же</span>
                        </div>

                        <input
                          type="text"
                          placeholder="Telegram"
                          value={telegram}
                          disabled
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      // Доступы
      case btnShowBlockProfile[1]['id']:
        return (
          <div
            className="itemBlock"
            style={{
              display: status ? 'block' : 'none',
            }}
          >
            {filterUserActive.length > 0 ? (
              <React.Fragment>
                <div className="TableCustom">
                  <Table
                    autoHeight
                    cellBordered={true}
                    hover={true}
                    bordered={true}
                    data={filterUserActive}
                  >
                    <Column align="center" fixed flexGrow={1}>
                      <HeaderCell>Принадлежность</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return <span>{rowData.auction_name}</span>
                        }}
                      </Cell>
                    </Column>

                    <Column align="center" fixed flexGrow={1}>
                      <HeaderCell>Log in / Buyer Code</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return <span>{rowData.buyerCode}</span>
                        }}
                      </Cell>
                    </Column>
                  </Table>
                </div>
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
              <NoData />
            )}
          </div>
        )
      // Кошельки
      case btnShowBlockProfile[2]['id']:
        return (
          <div
            className="itemBlock"
            style={{
              display: status ? 'block' : 'none',
            }}
          >
            {(cashArrayDefault.length > 0 ||
              carrierArrayDefault.length > 0) && (
              <PieChart
                data={
                  currentValue === 'Аукцион'
                    ? cashArrayDefault
                    : carrierArrayDefault
                }
                legend={false}
                startAngle={210}
              />
            )}

            <div className="top-item">
              <div className="groupInput">
                <div
                  className="switcher-btn"
                  style={{ display: btnShow.length > 0 ? 'flex' : 'none' }}
                >
                  {btnShow.map((item) => {
                    return (
                      <span
                        key={item.id}
                        onClick={() => chooseItem(item.name)}
                        className={item.status ? 'active' : item.name}
                      >
                        {item.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
            {controlBlock(currentValue)}
            {(carrierArray.length > 0 || cashArray.length > 0) && (
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
            )}
          </div>
        )

      default:
        break
    }
  }
  return (
    <div className="noticeTransport">
      <div className="itemContainer">
        <div className="itemContainer-inner">
          <div
            className="top-item "
            style={{ paddingLeft: state.width, justifyContent: 'right' }}
          >
            <div className="btnTransport"></div>
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
    </div>
  )
}
export default ProfileUser
