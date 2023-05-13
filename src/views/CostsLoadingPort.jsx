import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import { Pagination, SelectPicker, CheckPicker, Modal, Checkbox } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'
import { viewPorts } from './../helper'
import NoData from '../components/NoData'
import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const CostsLoadingPort = (props) => {
  const [dataMaster, setDataMaster] = useState([])
  const partsLimit = [20, 50, 100]
  const [active, setActive] = useState(false)
  const [archive, setArchive] = useState(false)
  const [CostsLoadingPortEditValue, setCostsLoadingPortEditValue] = useState('')
  const [idEdit, setIdEdit] = useState('')

  const [paginationValue, setPaginationValue] = useState([])
  const [loadingShow, setLoadingShow] = useState(true)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [CostsLoadingPortValue, setCostsLoadingPortValue] = useState('')
  const [CostsLoadingPortsArray, setCostsLoadingPortsArray] = useState([])

  const [viewControler, setViewControler] = useState([])

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [itemIsRemove, setItemIsRemove] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ removeCostsLoadingPorts: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/costs/loading-port/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удалено!', 'success')
          getArray()
          dispatch(showLoder({ removeCostsLoadingPorts: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ removeCostsLoadingPorts: 0 }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/costs/loading-port?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataMaster(res.CostLoadingPorts)
        setPaginationValue(res.pagination)
        setLoadingShow(false)
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataMaster([])
        dispatch(showLoder({ getArray: 0 }))
      })
  }
  const getAllArray = () => {
    dispatch(showLoder({ getAllArray: 1 }))
    getRequest(`/api/v1/costs/loading-port?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCostsLoadingPortsArray(res.CostLoadingPorts)
        dispatch(showLoder({ getAllArray: 0 }))
      })
      .catch((err) => {
        setCostsLoadingPortsArray([])
        dispatch(showLoder({ getAllArray: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  useEffect(() => {
    getArray()
    getAllArray()
  }, [page, limit])

  const showIdCostsLoadingPort = ({ title, id, active, archive }) => {
    setCostsLoadingPortEditValue(title ? title : '')

    setIdEdit(id ? id : '')
    setActive(active)
    setArchive(archive)
    setIsModalShowEdit(!isModalShowEdit)
  }

  let params = {
    title: CostsLoadingPortValue,
    active,
    archive,
  }

  let paramsEdit = {
    title: CostsLoadingPortEditValue,
    active,
    archive,
  }

  const createCostsLoadingPort = (e) => {
    dispatch(showLoder({ createCostsLoadingPort: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/costs/loading-port', params)
      .then(() => {
        state.createNotification('Успешно добавлено!', 'success')
        getArray()
        close()

        dispatch(showLoder({ createCostsLoadingPort: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ createCostsLoadingPort: 0 }))
      })
  }
  const editCostsLoadingPort = (e) => {
    dispatch(showLoder({ editCostsLoadingPort: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    putRequest(`/api/v1/costs/loading-port/${idEdit}`, paramsEdit)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')
        getArray()
        close()
        dispatch(showLoder({ editCostsLoadingPort: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editCostsLoadingPort: 0 }))
      })
  }
  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }
  const close = () => {
    setIsModalRemove(false)
    setIsModalShowEdit(false)
    setIsModalShow(false)
    setCostsLoadingPortValue('')
    setActive(false)
  }

  let viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Удаление затраты порта загрузки</Modal.Title>
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
              onClick={() => setIsModalRemove(false)}
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
          open={isModalShowEdit}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Редактировать затрату порта загрузки</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editCostsLoadingPort}>
              {/* <h2>Редактировать затрату порта загрузки</h2> */}

              <label>
                <span>Затрата порта загрузки</span>
                <input
                  className=""
                  type="text"
                  value={CostsLoadingPortEditValue}
                  onChange={(e) => setCostsLoadingPortEditValue(e.target.value)}
                  placeholder="Затрата порта загрузки"
                  required
                />
              </label>
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
          open={isModalShow}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Добавить затрату порта загрузки</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createCostsLoadingPort}>
              {/* <h2>Добавить затрату порта загрузки</h2> */}

              <label>
                <span>Затрата порта загрузки</span>
                <input
                  className=""
                  type="text"
                  value={CostsLoadingPortValue}
                  onChange={(e) => setCostsLoadingPortValue(e.target.value)}
                  placeholder="Затрата порта загрузки"
                  required
                />
              </label>
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

              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>

      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{
            paddingLeft: state.width,
            justifyContent: 'space-between',
            alignItems: 'inherit',
          }}
        >
          <div className="btnTransport" style={{ marginTop: '10px' }}>
            <button
              className="btnInfo"
              onClick={() => setIsModalShow(!isModalShow)}
            >
              <span>Добавить</span>
            </button>
          </div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          {dataMaster.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={dataMaster}
                loading={loadingShow}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Затрата порта загрузки</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdCostsLoadingPort(rowData)
                          }}
                        >
                          {<span>{rowData.title}</span>}
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
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdCostsLoadingPort(rowData)
                          }}
                        >
                          {
                            <span>
                              {rowData.active ? 'Активен' : 'Не активен'}
                            </span>
                          }
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                {/* <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Архив</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdCostsLoadingPort(rowData)
                          }}
                        >
                          {
                            <span>
                              {rowData.archive ? 'В архиве' : 'Не в архиве'}
                            </span>
                          }
                        </span>
                      )
                    }}
                  </Cell>
                </Column> */}

                <Column align="center" flexGrow={1}>
                  <HeaderCell>Действие</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <div className="Dropdown">
                            <div className="DropdownShow">
                              {viewBlock(109) && (
                                <button
                                  onClick={() => {
                                    showIdCostsLoadingPort(rowData)
                                  }}
                                >
                                  <Edit />
                                </button>
                              )}
                              {viewBlock(110) && (
                                <button
                                  onClick={() => {
                                    // remove(rowData.id)
                                    setItemIsRemove(rowData.id)
                                    setIsModalRemove(true)
                                  }}
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
                  layout={['total', 'pager', 'limit']}
                  total={paginationValue.total_results}
                  limitOptions={partsLimit}
                  limit={limit}
                  activePage={page}
                  onChangePage={setPage}
                  onChangeLimit={handleChangeLimit}
                />
              </div>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default CostsLoadingPort
