import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Trash, CloseOutline, CheckOutline } from '@rsuite/icons'

import { Pagination, Modal, Tooltip, Whisper, Checkbox } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'

import NoData from '../components/NoData'

import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const ListOfPorts = (props) => {
  // params
  const [dataPorts, setDataPorts] = useState([])
  const [data, setData] = useState([])
  const [dataMaster, setDataMaster] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [dataCountries, setDataCountries] = useState([])
  const [countrySelect, setCountrySelect] = useState(0)
  const [itemIsRemove, setItemIsRemove] = useState('')
  const [idUser, setIdUser] = useState('')
  const [open, setOpen] = useState(false)
  const [showActive, setShowActive] = useState(false)
  const [active, setActive] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)

  // pagination

  // modal
  const [isModalShow, setIsModalShow] = useState(false)

  const { state, dispatch } = useContext(ContextApp)

  const getCountries = () => {
    dispatch(showLoder({ offices: 1 }))
    getRequest('/api/v1/countries', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterAray = res.countries.filter((item) => item.is_buyed)

        setDataCountries(res.countries)

        setCountrySelect(JSON.stringify(res.countries[0]))
        dispatch(showLoder({ offices: 0 }))
      })
      .catch((err) => dispatch(showLoder({ offices: 0, status: err.status })))
  }
  const getPorts = () => {
    dispatch(showLoder({ getPorts: 1 }))
    getRequest(`/api/v1/ports?page=1&limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPorts(res.ports)

        dispatch(showLoder({ getPorts: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')

        dispatch(showLoder({ getPorts: 0, status: err.status }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/destinations?page=1&limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataMaster(res.destinations)
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataMaster([])
        dispatch(showLoder({ getArray: 0, status: err.status }))
      })
  }
  useEffect(() => {
    getPorts()
    getArray()
    getCountries()
  }, [])

  // useEffect(() => {
  //   let unit = []
  //   let res = [...dataPorts, ...dataMaster]
  //   let result = res.filter((n, i, a) => {

  //     if (unit.includes(n.code)) return false
  //     else {
  //       unit.push(n.code)
  //       return true
  //     }
  //   })

  //   setData(result)
  // }, [dataPorts, dataMaster])

  useEffect(() => {
    const newDataMaster = JSON.parse(
      JSON.stringify(dataMaster).replaceAll('"title"', '"name"')
    )

    const res = newDataMaster.filter(
      ({ code }) => !dataPorts.find((i) => i.code === code)
    )

    setData(res.length > 0 ? dataPorts.concat(res) : dataPorts)
  }, [dataPorts, dataMaster])

  const params = {
    name,
    code,
    country_id: JSON.parse(countrySelect).id,
    active,
  }

  const createPorts = (e) => {
    dispatch(showLoder({ createLocation: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/ports', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getPorts()
        getArray()
        getCountries()
        close()
        dispatch(showLoder({ createLocation: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте данные!', 'error')
        dispatch(showLoder({ createLocation: 0, status: err.status }))
      })
  }
  const updatePorts = (e) => {
    dispatch(showLoder({ updatePorts: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    putRequest(`/api/v1/ports/${idUser}`, params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getPorts()
        getArray()
        getCountries()
        close()
        dispatch(showLoder({ updatePorts: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте данные!', 'error')
        dispatch(showLoder({ updatePorts: 0, status: err.status }))
      })
  }

  const close = () => {
    setIsModalShow(false)
    setName('')
    setCode('')
    setCountrySelect(0)
    setActive(false)
    setIdUser('')

    setOpen(false)
    setShowActive(false)
    setIsModalShowEdit(false)
  }

  // useEffect(
  //   () =>
  //     window.sessionStorage.getItem('access_rights') !== 'null' &&
  //     controlRoleView(),
  //   [window.sessionStorage.getItem('access_rights')]
  // )

  // let controlRoleView = () => {
  //   if (
  //     Object.keys(
  //       JSON.parse(window.sessionStorage.getItem('access_rights'))
  //     ).includes('location')
  //   ) {
  //     let initialValue = JSON.parse(
  //       window.sessionStorage.getItem('access_rights')
  //     ).location.access_rights

  //     setViewControler(initialValue)
  //   }
  // }

  // let viewBlock = (id) => {
  //   let bool = false
  //   viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
  //   return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
  //     ? true
  //     : bool
  // }
  const styleTopItem = {
    paddingLeft: state.width,
    justifyContent: 'right',
    alignItems: 'inherit',
    marginRight: '10px',
  }
  const styleBottomItemFooter = {
    paddingLeft: state.width,
    color: 'black',
  }

  const activationOrUnactivation = (id) => {
    setShowActive(false)
    dispatch(showLoder({ activationOrUnactivation: 1 }))
    postRequest('/api/v1/ports/active', { port_id: id })
      .then((res) => {
        getArray()

        state.createNotification('Успешно выполнено!', 'success')
        dispatch(showLoder({ activationOrUnactivation: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ activationOrUnactivation: 0, status: err.status }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const remove = (id) => {
    setOpen(false)
    dispatch(showLoder({ remove: 1 }))
    deleteRequest(`/api/v1/ports/${id}`)
      .then((res) => {
        state.createNotification('Порт успешно удален!', 'success')
        getArray()
        dispatch(showLoder({ remove: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0, status: err.status }))
      })
  }

  const showEditCountry = ({ id, name, code, country, active }) => {
    const countryValue = dataCountries.find((item) => item.id === country.id)

    setIsModalShowEdit(true)
    setName(name)
    setCode(code)

    setCountrySelect(countryValue.id ? JSON.stringify(countryValue) : 0)
    setActive(active)
    setIdUser(id)
  }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShow}
          onClose={close}
        >
          <Modal.Header>
            <Modal.Title>Добавить порт</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createPorts}>
              {/* <h2>Добавить порт назначения</h2> */}

              <label>
                <span>Порт </span>
                <input
                  className=""
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Порт погрузки"
                  required
                />
              </label>
              <label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>
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

              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Активность</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={active}
                  checked={active}
                  onChange={(e) => {
                    setActive(!active)
                  }}
                />
              </div>

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
          open={isModalShowEdit}
          onClose={close}
        >
          <Modal.Header>
            <Modal.Title>Редактировать порт</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={updatePorts}>
              {/* <h2>Добавить порт назначения</h2> */}

              <label>
                <span>Порт</span>
                <input
                  className=""
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Порт"
                  required
                />
              </label>
              <label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>
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

              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Активность</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={active}
                  checked={active}
                  onChange={(e) => {
                    setActive(!active)
                  }}
                />
              </div>

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
          open={open}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title> Удаление порта</Modal.Title>
          </Modal.Header>

          <Modal.Body>Вы действительно хотите удалить?</Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => remove(itemIsRemove)}
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => close()}
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
          open={showActive}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Активация/деактивация порта</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Вы действительно хотите совершить это дейтвие?
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => activationOrUnactivation(idUser)}
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => close()}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="itemContainer-inner">
        <div className="top-item " style={styleTopItem}>
          <div className="btnTransport">
            <button
              className="btnInfo"
              onClick={() => setIsModalShow(!isModalShow)}
            >
              <span>Добавить</span>
            </button>
          </div>
        </div>
        <div className="bottom-itemFooter" style={styleBottomItemFooter}>
          {data.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={data}
                loading={!data.length > 0}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Порт</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span onClick={() => showEditCountry(rowData)}>
                          {rowData.title ? rowData.title : rowData.name}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Код</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span onClick={() => showEditCountry(rowData)}>
                          {rowData.code}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Страна</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span onClick={() => showEditCountry(rowData)}>
                          {rowData.country.name_ru}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Активность</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span onClick={() => showEditCountry(rowData)}>
                          {rowData.active ? 'Активен' : 'Не активен'}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Действия</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div className="Dropdown">
                          <div className="DropdownShow">
                            <Whisper
                              followCursor
                              placement="left"
                              speaker={
                                <Tooltip>
                                  {rowData.active
                                    ? 'Деактивировать'
                                    : 'Активировать'}
                                </Tooltip>
                              }
                            >
                              <button
                                onClick={() => {
                                  setIdUser(rowData.id)
                                  setShowActive(true)
                                }}
                              >
                                {rowData.active ? (
                                  <CloseOutline />
                                ) : (
                                  <CheckOutline />
                                )}
                              </button>
                            </Whisper>
                            <Whisper
                              followCursor
                              placement="left"
                              speaker={<Tooltip>Удаление</Tooltip>}
                            >
                              <button
                                onClick={() => {
                                  setItemIsRemove(rowData.id)
                                  setOpen(true)
                                }}
                              >
                                <Trash />
                              </button>
                            </Whisper>
                          </div>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
              </Table>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default ListOfPorts
