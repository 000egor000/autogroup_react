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

const CostsDestinationPort = (props) => {
  const [dataMaster, setDataMaster] = useState([])
  const partsLimit = [20, 50, 100]

  const [CostsDestinationPortEditValue, setCostsDestinationPortEditValue] =
    useState('')
  const [idEdit, setIdEdit] = useState('')
  const [active, setActive] = useState(false)
  const [archive, setArchive] = useState(false)

  const [paginationValue, setPaginationValue] = useState([])
  const [loadingShow, setLoadingShow] = useState(true)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [CostsDestinationPortValue, setCostsDestinationPortValue] = useState('')
  const [CostsDestinationPortsArray, setCostsDestinationPortsArray] = useState(
    []
  )

  const [viewControler, setViewControler] = useState([])

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [itemIsRemove, setItemIsRemove] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ removeCostsDestinationPorts: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/costs/destination-port/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удалено!', 'success')
          getArray()
          dispatch(showLoder({ removeCostsDestinationPorts: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(
          showLoder({ removeCostsDestinationPorts: 0, status: err.status })
        )
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/costs/destination-port?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataMaster(res.CostDestinationPorts)
        setPaginationValue(res.pagination)
        setLoadingShow(false)
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataMaster([])
        dispatch(showLoder({ getArray: 0, status: err.status }))
      })
  }
  const getAllArray = () => {
    dispatch(showLoder({ getAllArray: 1 }))
    getRequest(`/api/v1/costs/destination-port?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCostsDestinationPortsArray(res.CostDestinationPorts)
        dispatch(showLoder({ getAllArray: 0 }))
      })
      .catch((err) => {
        setCostsDestinationPortsArray([])
        dispatch(showLoder({ getAllArray: 0, status: err.status }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  useEffect(() => {
    getArray()
    getAllArray()
  }, [page, limit])

  const showIdCostsDestinationPort = ({ title, id, active, archive }) => {
    setCostsDestinationPortEditValue(title ? title : '')
    setIdEdit(id ? id : '')
    setActive(active)
    setArchive(archive)
    setIsModalShowEdit(!isModalShowEdit)
  }

  let params = {
    title: CostsDestinationPortValue,
    active,
    archive,
  }

  let paramsEdit = {
    title: CostsDestinationPortEditValue,
    active,
    archive,
  }

  const createCostsDestinationPort = (e) => {
    dispatch(showLoder({ createCostsDestinationPort: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/costs/destination-port', params)
      .then(() => {
        state.createNotification('Успешно добавлено!', 'success')
        getArray()
        close()

        dispatch(showLoder({ createCostsDestinationPort: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(
          showLoder({ createCostsDestinationPort: 0, status: err.status })
        )
      })
  }
  const editCostsDestinationPort = (e) => {
    dispatch(showLoder({ editCostsDestinationPort: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    putRequest(`/api/v1/costs/destination-port/${idEdit}`, paramsEdit)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')
        getArray()
        close()
        dispatch(showLoder({ editCostsDestinationPort: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editCostsDestinationPort: 0, status: err.status }))
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
    setCostsDestinationPortValue('')
    setActive(false)
  }

  let viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }
  const styleTopItem = {
    paddingLeft: state.width,
    justifyContent: 'space-between',
    alignItems: 'inherit',
    display: 'block',
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
            <Modal.Title>Удаление затраты порта назначения</Modal.Title>
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
            <Modal.Title>Редактировать затрату порта назначения</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editCostsDestinationPort}>
              {/* <h2>Редактировать затрату порта назначения</h2> */}

              <label>
                <span>Затрата порта назначения</span>
                <input
                  className=""
                  type="text"
                  value={CostsDestinationPortEditValue}
                  onChange={(e) =>
                    setCostsDestinationPortEditValue(e.target.value)
                  }
                  placeholder="Затрата порта назначения"
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
            <Modal.Title>Добавить затрату порта назначения</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createCostsDestinationPort}>
              {/* <h2>Добавить затрату порта назначения</h2> */}

              <label>
                <span>Затрата порта назначения</span>
                <input
                  className=""
                  type="text"
                  value={CostsDestinationPortValue}
                  onChange={(e) => setCostsDestinationPortValue(e.target.value)}
                  placeholder="Затрата порта назначения"
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
        <div className="top-item " style={styleTopItem}>
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
                  <HeaderCell>Затрата порта назначения</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) &&
                              showIdCostsDestinationPort(rowData)
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
                            viewBlock(109) &&
                              showIdCostsDestinationPort(rowData)
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
                            viewBlock(109) &&
                              showIdCostsDestinationPort(rowData)
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
                                    showIdCostsDestinationPort(rowData)
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
export default CostsDestinationPort
