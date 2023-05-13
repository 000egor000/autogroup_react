import React, { useState, useContext, useEffect } from 'react'
import { getRequest, postRequest } from './../../base/api-request'

import 'react-toastify/dist/ReactToastify.css'
import { Pagination, Modal } from 'rsuite'

import { ArrowRightLine, ArrowDownLine } from '@rsuite/icons'

import 'rsuite/dist/rsuite.min.css'

import ContextApp from './../../context/contextApp'
import { showLoder } from '../../reducers/actions'
import PreBidNav from '../../components/PreBidNav'

const ArhivePreBid = () => {
  const { title } = JSON.parse(window.sessionStorage.getItem('role'))
  const [message, setMessage] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  const [dataTable, setDataTable] = useState([])
  const [dropShow, setDropShow] = useState([])
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState(0)

  const [isModalDetail, setIsModalDetail] = useState(false)
  //paramsSearch

  const [lot, setLot] = useState('')

  const [fistValueSelect, setFistValueSelect] = useState('')
  const [dataFistSelect, setDataFistSelect] = useState([])

  const [statusArray, setStatusArray] = useState([])
  const [valueStatusArraySelect, setValueStatusArraySelect] = useState(0)
  //

  //DetailParams
  const [idDetail, setIdDetail] = useState('')
  const [emailDetail, setEmailDetail] = useState('')
  const [cityDetail, setCityDetail] = useState('')
  const [phoneDetail, setPhoneDetail] = useState('')
  const [telegramDetail, setTelegramDetail] = useState('')

  //

  // Получение кол сообещений через вебсокеты (нач)
  const channel = window.Echo.channel(
    'all-info-' + JSON.parse(sessionStorage.user).id
  )
  channel.listen('.checkPreBidNotification', function (data) {
    setMessage(data)
  })

  useEffect(() => {
    const messageSuccess = 'new' || 'process' || 'approval' || 'win'
    const messageFail = 'fail' || 'lose'
    messageSuccess ?? messageFail
      ? messageSuccess
        ? state.createNotification(message.message, 'success')
        : state.createNotification(message.message, 'error')
      : console.log('invalid request')

    getDataTable()

    return () => {}
  }, [message])

  useEffect(() => {
    getDataTable()
  }, [page])

  const getDataTable = () => {
    dispatch(showLoder({ archive: 1 }))
    getRequest('/api/v1/pre-bid/archive', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataTable(res.preBids.slice(limit * (page - 1), limit * page))
        setPaginationValue(res.preBids.length)
        dispatch(showLoder({ archive: 0 }))
      })
      .catch(() => dispatch(showLoder({ archive: 0 })))
  }

  const handleShow = (id) => {
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

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  useEffect(() => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataFistSelect(
          [{ id: 0, name: 'Выбрать из списка' }].concat(res.auction)
        )
        setFistValueSelect(
          [{ id: 0, name: 'Выбрать из списка' }].concat(res.auction)[0]['id']
        )
        dispatch(showLoder({ auctions: 0 }))
      })
      .catch(() => dispatch(showLoder({ auctions: 0 })))
  }, [])

  useEffect(() => {
    dispatch(showLoder({ status: 1 }))
    getRequest('/api/v1/pre-bids/status', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setStatusArray(
          [{ id: 0, title: 'Выбрать из списка' }].concat(res.PreBidStatuses)
        )

        setValueStatusArraySelect(
          [{ id: 0, title: 'Выбрать из списка' }].concat(res.PreBidStatuses)[0][
            'id'
          ]
        )
        dispatch(showLoder({ status: 0 }))
      })
      .catch(() => dispatch(showLoder({ status: 0 })))
  }, [])

  useEffect(() => {
    getDataTable()
  }, [])

  const searchFunction = (e) => {
    if (e.key === 'Enter') {
      dispatch(showLoder({ searchFunction: 1 }))
      e.preventDefault()
      let paramsSerch = {
        search: {
          pre_bid_status_id: valueStatusArraySelect
            ? valueStatusArraySelect
            : null,
          lot: lot ? lot : null,
          auction_id: fistValueSelect ? fistValueSelect : null,
        },
      }

      postRequest('/api/v1/pre-bid/search', paramsSerch)
        .then((res) => {
          setDataTable(res.preBids)
          dispatch(showLoder({ searchFunction: 0 }))
        })
        .catch(() => {
          dispatch(showLoder({ searchFunction: 0 }))
          state.createNotification('Что-то пошло не так!', 'error')
        })
    } else {
      return null
    }
  }
  // const reset = () => {
  // 	setValueStatusArraySelect(0)
  // 	setFistValueSelect(0)
  // 	setLot('')
  // 	getDataTable()
  // }

  const detailUp = (role, currentEmail) => {
    dispatch(showLoder({ role: 1 }))
    getRequest(`/api/v1/${role}s`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        res[`${role}s`].map((elem) => {
          if (elem.email === currentEmail) {
            setIdDetail(elem.id)
            setEmailDetail(elem.email)
            setCityDetail(elem.city.name_ru)
            setPhoneDetail(elem.phone)
            setTelegramDetail(elem.telegram)
          }
        })
        dispatch(showLoder({ role: 0 }))
      })
      .catch(() => dispatch(showLoder({ role: 0 })))
  }

  useEffect(() => {
    document.addEventListener('keydown', searchFunction)
    return () => {
      document.removeEventListener('keydown', searchFunction)
    }
  })

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalDetail}
          onClose={() => {
            setIsModalDetail(false)
          }}
        >
          <Modal.Header>
            <Modal.Title>Детализация участника</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="groupInput ">
              <label>
                <span>id</span>
                <input type="text" value={idDetail} placeholder="id" disabled />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="text"
                  value={emailDetail}
                  placeholder="Email"
                  disabled
                />
              </label>
              <label>
                <span>Город</span>
                <input
                  type="text"
                  value={cityDetail}
                  placeholder="Город"
                  disabled
                />
              </label>
              <label>
                <span>Номер телефона</span>
                <input
                  type="text"
                  value={phoneDetail}
                  placeholder="Номер телефона"
                  disabled
                />
              </label>
              <label>
                <span>Телеграмм</span>
                <input
                  type="text"
                  value={telegramDetail}
                  placeholder="Телеграмм"
                  disabled
                />
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>

      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}>
          <div className="groupInput" style={{}}>
            <PreBidNav id="Архив" />

            <div className="searchGroup">
              <form onSubmit={searchFunction} className="formCus">
                <label style={{ flexDirection: 'column' }}>
                  <span>Аукцион</span>
                  <select
                    onChange={(e) => setFistValueSelect(e.target.value)}
                    value={fistValueSelect}
                  >
                    {dataFistSelect.length > 0 &&
                      dataFistSelect.map((e, i) => (
                        <option key={e.id + i} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label style={{ flexDirection: 'column' }}>
                  <span>Статус:</span>
                  <div className="selectCustom">
                    <select
                      value={valueStatusArraySelect}
                      onChange={(event) =>
                        setValueStatusArraySelect(event.target.value)
                      }
                    >
                      {statusArray.map((elem) => {
                        return (
                          <option key={elem.id} value={elem.id}>
                            {elem.title}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </label>

                <label style={{ flexDirection: 'column' }}>
                  <span>Лот</span>
                  <input
                    className=""
                    type="text"
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    placeholder="Лот"
                  />
                </label>

                {/* <div className='btnGroup'>
									<input className='btn-group' value='Найти' type='submit' />
									<input
										className='btn-group'
										value='Сбросить'
										type='button'
										onClick={() => reset()}
									/>
								</div> */}
              </form>
            </div>
          </div>
        </div>

        <div
          className="bottom-itemFooter"
          style={{
            paddingLeft: state.width,
          }}
        >
          {dataTable.length > 0 ? (
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    <th>Дата и время</th>
                    <th>Аукцион</th>
                    <th>Лот</th>

                    <th>Название авто</th>

                    {title === 'Администратор' && (
                      <th>Cтавка 1 (предмаксимальная ставка)</th>
                    )}

                    {title === 'Администратор' ? (
                      <th>Cтавка 2 (максимальная ставка)</th>
                    ) : (
                      <th>Cтавка </th>
                    )}
                    <th>Статус</th>
                  </tr>
                </thead>

                {dataTable.map((e, i) => {
                  return (
                    <tbody key={e + i}>
                      <tr>
                        <td onClick={() => handleShow(e.id)}>
                          {isChecked(e.id) ? (
                            <ArrowRightLine />
                          ) : (
                            <ArrowDownLine />
                          )}

                          {e.updated_date}
                        </td>
                        <td onClick={() => handleShow(e.id)}>
                          {e.auction_name}
                        </td>

                        <td onClick={() => handleShow(e.id)}>{e.lot}</td>

                        <td onClick={() => handleShow(e.id)}>
                          {e.auto_name ? e.auto_name : '-'}
                        </td>

                        {title === 'Администратор' && (
                          <td onClick={() => handleShow(e.id)}>
                            {e.prev_max_price ? e.prev_max_price + ' $' : '-'}
                          </td>
                        )}

                        <td onClick={() => handleShow(e.id)}>
                          {e.max_price + ' $'}
                        </td>
                        <td
                          className="positonTd"
                          onClick={() => handleShow(e.id)}
                        >
                          <span
                            style={{
                              color:
                                e.status.id === 4
                                  ? 'green'
                                  : e.status.id === 5
                                  ? 'red'
                                  : null,
                              fontWeight:
                                e.status.id === 4
                                  ? '600'
                                  : e.status.id === 5
                                  ? '600'
                                  : null,
                            }}
                          >
                            {e.status.id !== 5 && e.successPrice
                              ? e.status.title + ' ' + e.successPrice + ' $'
                              : e.status.title}
                          </span>
                        </td>
                      </tr>
                      {isChecked(e.id) && (
                        <tr style={{ textAlighn: 'center' }}>
                          <td colSpan="20">
                            <div
                              className="dropD"
                              style={{
                                display: isChecked(e.id) ? 'block' : 'none',
                              }}
                            >
                              <React.Fragment>
                                <table key={i + e.lot + e.max_price}>
                                  <thead key={e.lot + i + e.max_price}>
                                    <tr>
                                      <th>дата и время</th>
                                      <th>сумма</th>
                                      {title === 'Администратор' && (
                                        <th>Кто создал</th>
                                      )}
                                      <th>комментарий</th>
                                    </tr>
                                  </thead>

                                  {e.children.map((elemChild, i) => (
                                    <tbody key={elemChild + i}>
                                      <tr>
                                        <td>{elemChild.created_date}</td>
                                        <td>{elemChild.price + ' $'}</td>
                                        {title === 'Администратор' && (
                                          <td
                                            style={{
                                              cursor:
                                                elemChild.created_user_role !==
                                                'admin'
                                                  ? 'pointer'
                                                  : 'default',
                                            }}
                                            onClick={() => {
                                              elemChild.created_user_role !==
                                                'admin' &&
                                                setIsModalDetail(true)

                                              elemChild.created_user_role !==
                                                'admin' &&
                                                detailUp(
                                                  elemChild.created_user_role,
                                                  elemChild.created_user
                                                )
                                            }}
                                          >
                                            {elemChild.created_user}
                                          </td>
                                        )}
                                        <td>
                                          {elemChild.comment
                                            ? elemChild.comment
                                            : '-'}
                                        </td>
                                      </tr>
                                    </tbody>
                                  ))}
                                </table>
                              </React.Fragment>
                            </div>
                          </td>
                        </tr>
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
            'Данных нет...'
          )}
        </div>
      </div>
    </div>
  )
}
export default ArhivePreBid
