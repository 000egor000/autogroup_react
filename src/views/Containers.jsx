import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  ArrowRightLine,
  ArrowDownLine,
  Trash,
  CloseOutline,
  AddOutline,
  MoveDown,
  List,
  InfoOutline,
} from '@rsuite/icons'

import { Pagination, Modal, Tooltip, Whisper, Toggle } from 'rsuite'

import ContextApp from '../context/contextApp'
import ContainerInner from '../components/ContainerInner'

// import ModalContainerAdd from '../components/ModalContainerAdd'
import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'
import { showLoder } from '../reducers/actions'
import { dataInfoCon } from '../const'

const Containers = () => {
  const [vin, setVin] = useState('')
  const [port, setPort] = useState('')
  const { state, dispatch } = useContext(ContextApp)
  const [dropShow, setDropShow] = useState([])
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  // const [paginationValue, setPaginationValue] = useState()
  const [showModalCreate, setShowModalCreate] = useState(false)
  const [showModalDisband, setShowModalDisband] = useState(false)
  const [showModalRemove, setShowModalRemove] = useState(false)
  // const [isModalShowContainer, setIsModalShowContainer] = useState(false)

  const [numberContainer, setNumberContainer] = useState('')
  const [sealineArray, setSealineArray] = useState([])
  const [sealineSelect, setSealineSelect] = useState('')

  const [dateLoading, setDateLoading] = useState('')
  const [dateKlaipeda, setDateKlaipeda] = useState('')

  const [portsArray, setPortsArray] = useState([])
  const [selectPortsArray, setSelectPortsArray] = useState('')
  const [portsSearchArray, setPortsSearchArray] = useState([])
  const [currentClick, setCurrentClick] = useState('')
  const [currentContainer, setCurrentContainer] = useState('')
  const [totalUnConfirmCount, setTotalUnConfirmCount] = useState(0)

  // const [transportArray, setTransportArray] = useState([])
  // const [containerCurrent, setContainerCurrent] = useState([])
  // let [totalResults, setTotalResults] = useState(false)
  // let [statusClick, setStatusClick] = useState('')
  let [showModalDownContainer, setShowModalDownContainer] = useState(false)
  let [currentValueToggleFist, setCurrentValueToggleFist] = useState(false)

  const [viewControler, setViewControler] = useState([])
  let [containerArray, setContainerArray] = useState([])

  let navigate = useNavigate()

  let [fistInfo, setFistInfo] = useState(dataInfoCon)

  useEffect(() => {
    dispatch(showLoder({ lines: 1 }))
    getRequest('/api/v1/sea-lines', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setSealineArray(res.seaLines)
        setSealineSelect(res.seaLines[0]['id'])
        dispatch(showLoder({ lines: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ lines: 0 }))
        // toast.error('Что-то пошло не так!')
      })
  }, [])

  useEffect(() => {
    getNumberContainer()

    return () => {
      setNumberContainer('')
    }
  }, [numberContainer])

  useEffect(() => {
    getContainerList()
    // getTransportArray()
  }, [fistInfo, page, limit])

  // useEffect(() => {
  // 	dispatch(show())
  // 	getRequest('/api/v1/containers/unconfirm', {
  // 		Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  // 	})
  // 		.then((res) => {
  // 			dispatch(hide())
  // 			setTotalResults(res.pagination.total_results ? true : false)
  // 		})
  // 		.catch((err) => {
  // 			setContainerArray([])
  // 			dispatch(hide())
  // 			// toast.error('Что-то пошло не так!')
  // 		})
  // }, [])
  useEffect(() => {
    dispatch(showLoder({ unconfirm: 1 }))
    getRequest('/api/v1/containers/unconfirm-count', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        dispatch(showLoder({ unconfirm: 0 }))
        setTotalUnConfirmCount(res.countContainers)
      })
      .catch((err) => {
        dispatch(showLoder({ unconfirm: 0 }))
        // toast.error('Что-то пошло не так!')
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ ports: 1 }))
    getRequest('/api/v1/ports', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setPortsArray(res.ports)
        setPortsSearchArray([{ id: 0, name: 'Порт' }].concat(res.ports))
        setSelectPortsArray(res.ports[0]['id'])

        dispatch(showLoder({ ports: 0 }))
      })
      .catch((err) => {
        // toast.error('Что-то пошло не так!')
        dispatch(showLoder({ ports: 0 }))
      })
  }, [])

  const close = () => {
    setShowModalCreate(false)
    setShowModalDisband(false)
    setShowModalRemove(false)
    // setIsModalShowContainer(false)
    setShowModalDownContainer(false)

    //params modalContainer
    setNumberContainer('')
    setSealineSelect(sealineArray[0]['id'])
    setSelectPortsArray(portsArray[0]['id'])
    setDateLoading('')
    setDateKlaipeda('')
  }

  const chooseItem = (id) => {
    let newArr = dataInfoCon.map((item) =>
      item.id === id ? { ...item, status: true } : { ...item, status: false }
    )
    setFistInfo(newArr)
  }

  const handleShow = ({ id, max_id, read }) => {
    let filtered = dropShow.filter((e) => id === e)
    // setStatusClick('')

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

  const getNumberContainer = () => {
    if (numberContainer.length > 4) {
      let letters = numberContainer.substring(0, 4)

      let string = (letters += numberContainer
        .substring(4, 11)
        .replace(/\D/g, ''))
      setNumberContainer(string)
    } else {
      setNumberContainer(numberContainer.replace(/[0-9А-ЯЁё]/g, ''))
    }
  }

  const getContainerList = () => {
    let nameUrlAdress

    fistInfo.map((e) => {
      if (e.status) {
        setCurrentClick(e.id)
        switch (e.id) {
          case 'Погрузка':
            return (nameUrlAdress = '/api/v1/containers')
          case 'Контейнера':
            return (nameUrlAdress = '/api/v1/containers/confirm')
          case 'Неразобранные':
            return (nameUrlAdress = '/api/v1/containers/unconfirm')

          case 'Архив':
            return (nameUrlAdress = '/api/v1/containers/archive')

          default:
            break
        }
      }
    })

    if (nameUrlAdress) {
      dispatch(showLoder({ containers: 1 }))
      getRequest(nameUrlAdress, {
        Authorization: `Bearer ${window.sessionStorage.getItem(
          'access_token'
        )}`,
      })
        .then((res) => {
          setContainerArray(res.containers)
          dispatch(showLoder({ containers: 0 }))
          // setContainerArray(res.containers)
        })
        .catch((err) => {
          setContainerArray([])
          dispatch(showLoder({ containers: 0 }))
          setContainerArray([])
          // toast.error('Что-то пошло не так!')
        })
    }
  }

  // const getTransportArray = () => {
  // 	dispatch(show())
  // 	let params
  // 	params = {
  // 		search: {
  // 			port_id: port,
  // 			arrival_warehouse: 'arrival_warehouse',
  // 			documents_received: 1,
  // 			number_container: 'container_number',
  // 			status_order_id: 2,
  // 		},
  // 	}
  // 	postRequest(`/api/v1/order/transport-auto/search?page=${page}&limit=${limit}`, params)
  // 		.then((res) => {
  // 			setTransportArray(res)

  // 			// setPaginationValue(res.pagination)
  // 			dispatch(hide())
  // 		})
  // 		.catch(() => {
  // 			// toast.error('Что-то пошло не так!')
  // 			dispatch(hide())
  // 			setTransportArray([])
  // 			// setPaginationValue([])
  // 		})
  // }

  // const statutsModalNow = (val) => {
  // 	return setIsModalShowContainer(val)
  // }

  // const modalAdd = () => {
  // 	return (
  // 		// <div className='itemContainer'>
  // 		<div className='top-item' style={{ paddingLeft: 0 }}>
  // 			<div className='itemContainer-inner'>
  // 				<div
  // 					className='bottom-itemFooter'
  // 					style={{
  // 						padding: '0 10px',
  // 					}}
  // 				>
  // 					<div className='addContainer'>
  // 						<ContainerInner
  // 							dataAray={transportArray}
  // 							indicator='true'
  // 							dataClick={containerCurrent}
  // 							dataAllInitial={getContainerList}
  // 							statutsModalNow={statutsModalNow}
  // 						/>
  // 					</div>
  // 				</div>
  // 			</div>
  // 		</div>
  // 		// </div>
  // 	)
  // }

  const createContainer = (e) => {
    e.preventDefault()
    dispatch(showLoder({ createContainer: 1 }))
    const params = {
      port_id: selectPortsArray,
    }
    postRequest('/api/v1/containers', params)
      .then(() => {
        toast.success('Лист погрузки успешно добавлена!')
        dispatch(showLoder({ createContainer: 0 }))
        getContainerList()
        close()
      })
      .catch((err) => {
        toast.error('Проверьте веденные данные!')
        dispatch(showLoder({ createContainer: 0 }))
      })
  }

  const editContainer = (e) => {
    e.preventDefault()
    dispatch(showLoder({ editContainer: 1 }))
    let params = {
      number: numberContainer,
      port_id: selectPortsArray,
      sea_line_id: sealineSelect,
      l_date: dateLoading,
      pod: dateKlaipeda,
    }

    putRequest(`/api/v1/containers/${currentContainer.id}/confirm`, params)
      .then((res) => {
        getContainerList()
        setShowModalDisband(false)
        dispatch(showLoder({ editContainer: 0 }))
      })
      .catch((err) => {
        setShowModalDisband(false)
        // toast.error('Что-то пошло не так!')
        dispatch(showLoder({ editContainer: 0 }))
      })
  }
  const removeContainer = (e) => {
    dispatch(showLoder({ removeContainer: 1 }))
    deleteRequest(`/api/v1/containers/${currentContainer.id}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setShowModalRemove(false)
        getContainerList()
        dispatch(showLoder({ removeContainer: 0 }))
      })
      .catch((err) => {
        setShowModalRemove(false)
        // toast.error('Что-то пошло не так!')
        dispatch(showLoder({ removeContainer: 0 }))
      })
  }

  const searchFunction = (e) => {
    if (e.keyCode === 13) {
      dispatch(showLoder({ searchFunction: 1 }))
      e.preventDefault()
      let container_status
      if (currentClick === 'Погрузка') container_status = 1
      if (currentClick === 'Контейнера') container_status = 2
      if (currentClick === 'Неразобранные') container_status = 3
      if (currentClick === 'Архив') container_status = 4
      let paramsSearch = {
        container_status_id: container_status,
        search: {
          port_id: port,
          vin: vin,
        },
      }

      postRequest('/api/v1/containers/search', paramsSearch)
        .then((res) => {
          setContainerArray(res.containers)
          dispatch(showLoder({ searchFunction: 0 }))
        })
        .catch(() => {
          dispatch(showLoder({ searchFunction: 0 }))
          setContainerArray([])
          // toast.error('Что-то пошло не так!')
        })
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', searchFunction)
    return () => {
      document.removeEventListener('keydown', searchFunction)
    }
  })

  // const reset = () => {
  // 	setPort('')
  // 	setVin('')
  // 	getContainerList()
  // }

  // useEffect(() => {
  // 	switch (window.location.pathname.split('/')[2]) {
  // 		case 'container':
  // 			return updateLink('Контейнера')
  // 		case 'loading':
  // 			return updateLink('Погрузка')
  // 		case 'archive':
  // 			return updateLink('Архив')

  // 		case 'unconfirm':
  // 			return updateLink('Неразобранные')

  // 		default:
  // 			return null
  // 	}
  // }, [])
  // const updateLink = (val) => {
  // 	chooseItem(val)
  // getContainerList()
  // }

  const controlBlock = (val) => {
    switch (val.id) {
      case 'Контейнера':
        return (
          <Link to={val.link} onClick={() => chooseItem(val.id)}>
            <div className="noteContainer">
              <button className={val.status ? 'btn btn--active' : 'btn '}>
                {val.id}
              </button>
            </div>
          </Link>
        )

      case 'Неразобранные':
        return null

      default:
        return (
          val.id !== 'Неразобранные' && (
            <Link to={val.link} onClick={() => chooseItem(val.id)}>
              <button className={val.status ? 'btn btn--active' : 'btn '}>
                {val.id}
              </button>
            </Link>
          )
        )
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
      ).includes('container')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).container.access_rights

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

  const downContainer = () => {
    dispatch(showLoder({ containersConfirm: 1 }))
    const params = {
      consolidation: +currentValueToggleFist,
    }

    putRequest(`/api/v1/containers/${currentContainer.id}/confirm`, params)
      .then((res) => {
        getContainerList()
        setShowModalDisband(false)
        dispatch(showLoder({ containersConfirm: 0 }))
      })
      .catch((err) => {
        setShowModalDisband(false)
        // toast.error('Что-то пошло не так!')
        dispatch(showLoder({ containersConfirm: 0 }))
      })

    close()
  }
  let urlPath = window.location.pathname.split('/')[2]

  const contolUrl = ({ id }) => {
    return navigate(
      urlPath === 'unconfirm'
        ? `/uncontainers/${id}/info`
        : `/containers/${id}/info`
    )
  }
  // useEffect(() => setIsModalShowContainer(true), [])

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={showModalCreate}
          onClose={() => {
            close()
          }}
        >
          <Modal.Header>
            <Modal.Title>Добавить контейнер</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createContainer}>
              {/* <h2>Добавить локацию</h2> */}

              <label>
                <span>Филиал перевозчика</span>

                {portsArray.length > 0 ? (
                  <select
                    value={selectPortsArray}
                    onChange={(event) =>
                      setSelectPortsArray(event.target.value)
                    }
                    // required={viewBlock(41)}
                    // disabled={!viewBlock(41)}
                  >
                    {portsArray.map((elem) => {
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

              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={showModalDisband}
          onClose={() => {
            close()
          }}
        >
          <Modal.Header>
            <Modal.Title>Редактировать контейнер</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editContainer}>
              <label>
                <span>Номер контенера</span>
                <input
                  type="text"
                  placeholder="ABCD1234567"
                  pattern="^[A-Z]{4}[0-9]{7}$"
                  value={numberContainer}
                  required
                  onChange={(e) =>
                    setNumberContainer(String(e.target.value).toUpperCase())
                  }
                />
              </label>

              <label>
                <span>Морская линия</span>
                <select
                  value={sealineSelect}
                  onChange={(event) => setSealineSelect(event.target.value)}
                  required
                >
                  {sealineArray.map((elem, i) => (
                    <option key={elem.id} value={elem.id}>
                      {elem.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Порт погрузки</span>

                {portsArray.length > 0 ? (
                  <select
                    value={selectPortsArray}
                    onChange={(event) =>
                      setSelectPortsArray(event.target.value)
                    }
                    required
                    // required={viewBlock(41)}
                    // disabled={!viewBlock(41)}
                  >
                    {portsArray.map((elem) => {
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
                <span>Дата погрузки</span>
                <input
                  type="date"
                  value={dateLoading}
                  onChange={(e) => setDateLoading(e.target.value)}
                  required
                />
              </label>
              <label>
                <span>Дата доставки</span>
                <input
                  type="date"
                  value={dateKlaipeda}
                  onChange={(e) => setDateKlaipeda(e.target.value)}
                  min={dateLoading}
                  required
                />
              </label>

              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={showModalRemove}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Расформировать лист погрузки</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Вы действительно хотите расформировать данный лист погрузки?
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => removeContainer()}
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => setShowModalRemove(false)}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={showModalDownContainer}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Действие с контейнером</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <label
              style={{
                justifyContent: 'space-between',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              <span>Консолидирован:</span>

              <Toggle
                // checkedChildren={<CheckIcon />}
                // unCheckedChildren={<CloseIcon />}
                onChange={(value) => {
                  setCurrentValueToggleFist(value)
                }}
              />

              <span>Полный контейнер:</span>
            </label>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => downContainer()}
              appearance="primary"
            >
              Сохранить
            </button>
            <button
              className="btn-danger"
              onClick={() => setShowModalDownContainer(false)}
              appearance="subtle"
            >
              Отменить
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* <ModalContainerAdd
				isVisible={isModalShowContainer}
				onClose={() => setIsModalShowContainer(false)}
				dataArray={modalAdd()}
			/> */}

      <div className="itemContainer-inner">
        <div
          className="top-item"
          style={{
            paddingLeft: state.width,
            marginBottom: '20px',
            flexDirection: 'column',
            flexWrap: 'wrap',
          }}
        >
          <div
            className=" groupInput-containers-between"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div
              className="groupInput groupInput-containers"
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {fistInfo.map((e) => (
                <React.Fragment key={e.id}>{controlBlock(e)}</React.Fragment>
              ))}
            </div>
            <div className="btnTransport">
              {currentClick === 'Погрузка' && viewBlock(89) && (
                <button
                  className="btnInfo"
                  onClick={() => setShowModalCreate(true)}
                >
                  Новый лист погрузки
                </button>
              )}
              {totalUnConfirmCount > 0 && (
                <Whisper
                  followCursor
                  placement="left"
                  speaker={<Tooltip>Неразобранные автомобили</Tooltip>}
                >
                  <div
                    onClick={() => chooseItem('Неразобранные')}
                    className="btn-transport_not_all"
                    style={{
                      textAlign: 'center',
                      marginRight: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    <Link to="/containers/unconfirm">
                      {totalUnConfirmCount}
                    </Link>
                  </div>
                </Whisper>
              )}
            </div>
          </div>

          <form onSubmit={searchFunction} className="formCus">
            <div className="searchInput">
              {portsSearchArray.length > 0 ? (
                <select
                  style={{ color: 'black' }}
                  value={port}
                  onChange={(event) => setPort(event.target.value)}
                  // required={viewBlock(41)}
                  // disabled={!viewBlock(41)}"
                >
                  {portsSearchArray.map((elem, i) => {
                    return (
                      <option key={elem.id + i} value={elem.id}>
                        {elem.name}
                      </option>
                    )
                  })}
                </select>
              ) : (
                'Нет данных!'
              )}

              <input
                className=""
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="Vin"
              />
            </div>
          </form>
        </div>
        <div
          className="bottom-itemFooter"
          style={{
            paddingLeft: state.width,
          }}
        >
          {containerArray.length > 0 ? (
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    <th>Номер контейнера</th>
                    <React.Fragment>
                      {currentClick !== 'Погрузка' && <th>Линия</th>}
                      <th> POL</th>
                      {currentClick !== 'Погрузка' && <th> L Date</th>}
                      {currentClick !== 'Погрузка' && <th> POD</th>}
                      <th> Кол-во ТС</th>
                      {(currentClick === 'Погрузка' ||
                        currentClick === 'Контейнера') && <th> Действие</th>}
                      <th>Дополнительная информация</th>
                    </React.Fragment>
                  </tr>
                </thead>

                {containerArray.length > 0 &&
                  containerArray.map((e, i) => {
                    return (
                      <tbody key={e.id}>
                        <tr>
                          <td>
                            {isChecked(e.id) ? (
                              <ArrowDownLine />
                            ) : (
                              <ArrowRightLine />
                            )}
                            {e.number}
                          </td>

                          <React.Fragment>
                            {currentClick !== 'Погрузка' && (
                              <td>{e.sea_line.title}</td>
                            )}

                            <td>{e.port.name}</td>
                            {currentClick !== 'Погрузка' && (
                              <td>{String(e.l_date).split(' ')[0]}</td>
                            )}
                            {currentClick !== 'Погрузка' && (
                              <td>{String(e.pod).split(' ')[0]}</td>
                            )}
                            <td>{e.transport_auto_information_count}</td>
                            {(currentClick === 'Погрузка' ||
                              currentClick === 'Контейнера') &&
                              (viewBlock(106) ||
                                viewBlock(107) ||
                                viewBlock(89)) && (
                                <td>
                                  <span className="Dropdown">
                                    <span className="DropdownShow">
                                      {currentClick === 'Погрузка' &&
                                        viewBlock(89) && (
                                          <Whisper
                                            followCursor
                                            placement="left"
                                            speaker={
                                              <Tooltip>Добавление</Tooltip>
                                            }
                                          >
                                            <button
                                              onClick={() => {
                                                // setIsModalShowContainer(true)
                                                // setContainerCurrent(e)
                                                setDropShow([])
                                              }}
                                            >
                                              <AddOutline />
                                            </button>
                                          </Whisper>
                                        )}

                                      {viewBlock(106) &&
                                        currentClick === 'Погрузка' && (
                                          <Whisper
                                            followCursor
                                            placement="top"
                                            speaker={
                                              <Tooltip>Закрытие</Tooltip>
                                            }
                                          >
                                            <button
                                              onClick={() => {
                                                setShowModalDisband(true)
                                                setCurrentContainer(e)
                                              }}
                                            >
                                              <CloseOutline />
                                            </button>
                                          </Whisper>
                                        )}
                                      {viewBlock(107) && (
                                        <Whisper
                                          followCursor
                                          placement="right"
                                          speaker={
                                            <Tooltip>Расформирование</Tooltip>
                                          }
                                        >
                                          <button
                                            onClick={() => {
                                              setShowModalRemove(true)
                                              setCurrentContainer(e)
                                            }}
                                          >
                                            <Trash />
                                          </button>
                                        </Whisper>
                                      )}
                                    </span>
                                  </span>
                                </td>
                              )}
                            <td>
                              <span className="Dropdown">
                                <span className="DropdownShow">
                                  <Whisper
                                    followCursor
                                    placement="left"
                                    speaker={<Tooltip>Лист авто</Tooltip>}
                                  >
                                    <button
                                      onClick={() => {
                                        handleShow(e)
                                        // setStatusClick('list')
                                      }}
                                    >
                                      <List />
                                    </button>
                                  </Whisper>

                                  <Whisper
                                    followCursor
                                    placement="top"
                                    speaker={<Tooltip>Информация</Tooltip>}
                                  >
                                    <button
                                      onClick={() => contolUrl({ id: e.id })}
                                    >
                                      <InfoOutline />
                                    </button>
                                  </Whisper>

                                  {currentClick === 'Неразобранные' && (
                                    <Whisper
                                      followCursor
                                      placement="top"
                                      speaker={<Tooltip>Разобрать</Tooltip>}
                                    >
                                      <button
                                        onClick={() => {
                                          setShowModalDownContainer(true)
                                          setCurrentContainer(e)
                                        }}
                                      >
                                        <MoveDown />
                                      </button>
                                    </Whisper>
                                  )}
                                </span>
                              </span>
                            </td>
                          </React.Fragment>
                        </tr>
                        {isChecked(e.id) && (
                          <td colSpan={20}>
                            <ContainerInner
                              dataAray={e.transport_auto_information}
                              idItem={e.id}
                              currentClick={currentClick}
                              // statusClick={statusClick}
                            />
                          </td>
                        )}
                      </tbody>
                    )
                  })}
              </table>
              {/* <div className='paginationBlock'>
								<Pagination
									prev
									next
									// first
									// last
									ellipsis
									// boundaryLinks
									maxButtons={5}
									size='xs'
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
            'Нет информации'
          )}
        </div>
      </div>
    </div>
  )
}
export default Containers
