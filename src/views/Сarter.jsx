import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import 'rsuite-table/dist/css/rsuite-table.css'
import { Modal } from 'rsuite'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { getRequest, deleteRequestData } from '../base/api-request'
// import { Pagination } from 'rsuite'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import NoData from '../components/NoData'
import { useNavigate } from 'react-router-dom'
import { connect } from '../helper'

const Сarter = ({ currentRates }) => {
  const [dataCarters, setDataCarters] = useState([])

  const [idEdit, setIdEdit] = useState('')
  const navigate = useNavigate()

  const [isModalRemove, setIsModalRemove] = useState(false)

  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    getArray()
  }, [currentRates])

  const remove = ({ id, pdtArray }) => {
    setIsModalRemove(false)
    dispatch(showLoder({ remove: 1 }))

    deleteRequestData(`/api/v1/carters/${id}`, {
      pd_id_add: pdtArray.split(','),
    })
      .then((res) => {
        if (res.status === 'success') {
          toast.success('успешно удалено!')
          getArray()

          dispatch(showLoder({ remove: 0 }))
        }
      })
      .catch((err) => {
        toast.error('Что-то пошло не так!')
        dispatch(showLoder({ remove: 0 }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/carters`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then(({ carters }) => {
        setDataCarters(
          currentRates
            ? carters.filter(({ id }) => id == currentRates)
            : carters
        )

        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getArray: 0 }))
        setDataCarters([])
      })
  }

  // useEffect(
  //   () =>
  //     window.sessionStorage.getItem('access_rights') !== 'null' &&
  //     controlRoleView(),
  //   [window.sessionStorage.getItem('access_rights')]
  // )

  // const controlRoleView = () => {
  //   if (
  //     Object.keys(
  //       JSON.parse(window.sessionStorage.getItem('access_rights'))
  //     ).includes('partners')
  //   ) {
  //     let initialValue = JSON.parse(
  //       window.sessionStorage.getItem('access_rights')
  //     ).partners.access_rights

  //     setViewControler(initialValue)
  //   }
  // }

  // const viewBlock = (id) => {
  //   let bool = false
  //   viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
  //   return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
  //     ? true
  //     : bool
  // }

  return (
    <div className="itemContainer">
      <ToastContainer />
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={() => setIsModalRemove(false)}
        >
          <Modal.Header>
            <Modal.Title>Удаление перевозчика</Modal.Title>
          </Modal.Header>

          <Modal.Body>Вы действительно хотите удалить?</Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => remove(idEdit)}
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

      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{ paddingLeft: state.width, justifyContent: 'right' }}
        >
          {!currentRates && (
            <div className="btnTransport">
              {/* {viewBlock(101) && ( */}
              <button
                className="btnInfo"
                onClick={() => navigate('/carterAddProfile')}
              >
                <span>Добавить</span>
              </button>
              {/* )} */}
            </div>
          )}
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          {dataCarters.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={dataCarters}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Наименование компании</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            navigate(`/carterProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Адрес регистрации</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            navigate(`/carterProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.address}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Контактное лицо</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            navigate(`/carterProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.contact}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Номер телефона</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            navigate(`/carterProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.phone}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Мессенджер</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            navigate(`/carterProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.messenger}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>E-mail</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            navigate(`/carterProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.email}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Связи</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            navigate(`/carterProfile/${rowData.id}`)
                          }
                        >
                          {
                            <span>
                              {connect(rowData.destinationPlaceDestinations)}
                            </span>
                          }
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                {/* {(viewBlock(102) || viewBlock(103)) && ( */}

                <Column align="center" flexGrow={1}>
                  <HeaderCell>Действие</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <div className="Dropdown">
                            <div className="DropdownShow">
                              {/* {viewBlock(102) && ( */}
                              <button
                                onClick={() =>
                                  navigate(`/carterProfile/${rowData.id}`)
                                }
                              >
                                <Edit />
                              </button>
                              {/* )} */}

                              {/* {viewBlock(103) && ( */}
                              <button
                                onClick={() => {
                                  setIdEdit({
                                    id: rowData.id,
                                    pdtArray: connect(
                                      rowData.destinationPlaceDestinations
                                    ),
                                  })
                                  setIsModalRemove(true)
                                }}
                              >
                                <Trash />
                              </button>
                              {/* )} */}
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
                {/* )} */}
              </Table>
              {/* <div className="paginationBlock">
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
                  total={paginationValue.total_results}
                  limitOptions={[5, 10]}
                  limit={limit}
                  activePage={page}
                  onChangePage={setPage}
                  onChangeLimit={handleChangeLimit}
                />
              </div> */}
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default Сarter
