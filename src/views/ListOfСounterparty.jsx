import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import 'rsuite-table/dist/css/rsuite-table.css'
import { Modal } from 'rsuite'
import 'react-toastify/dist/ReactToastify.css'

import { getRequest, deleteRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import { useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import { typeList } from '../const'
import { clickToLink, getAllData } from '../helper'

import { SelectPicker } from 'rsuite'

const ListOfСounterparty = (props) => {
  const [dataPartners, setDataPartners] = useState([])
  const [dataCarters, setDataCarters] = useState([])

  const [idEdit, setIdEdit] = useState('')
  const [isModalRemove, setIsModalRemove] = useState(false)
  // const [viewControler, setViewControler] = useState([])
  const { state, dispatch } = useContext(ContextApp)
  const [dataCountries, setDataCountries] = useState([])
  const [selectCountries, setSelectCountries] = useState('')

  const [dataAgents, setDataAgents] = useState([])
  const [dataCarriers, setDataCarriers] = useState([])

  const [dataAll, setDataAll] = useState([])
  const [dataType, setDataType] = useState(0)
  const navigate = useNavigate()

  const remove = (id) => {
    setIsModalRemove(false)
    dispatch(showLoder({ remove: 1 }))

    deleteRequest(`/api/v1/partners/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('успешно удалено!', 'success')
          getArray()
          getCarters()

          dispatch(showLoder({ remove: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0, status: err.status }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/partners`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPartners(res.partners)

        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getArray: 0, status: err.status }))
        setDataPartners([])
      })
  }

  const getCarters = () => {
    dispatch(showLoder({ getCarters: 1 }))
    getRequest(`/api/v1/carters`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataCarters(res.carters)

        dispatch(showLoder({ getCarters: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getCarters: 0, status: err.status }))
        setDataCarters([])
      })
  }

  const getAgents = () => {
    dispatch(showLoder({ getCarters: 1 }))
    getRequest(`/api/v1/agents`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataAgents(res.agents)

        dispatch(showLoder({ getCarters: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getCarters: 0, status: err.status }))
        setDataAgents([])
      })
  }
  const getCarriers = () => {
    dispatch(showLoder({ getCarters: 1 }))
    getRequest(`/api/v1/carriers`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const replaceArray = JSON.parse(
          JSON.stringify(res.carriers).replaceAll('title', 'name')
        ).filter(({ code }) => code !== 'aglogistic')

        replaceArray.length > 0 && setDataCarriers(replaceArray)

        dispatch(showLoder({ getCarters: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getCarters: 0, status: err.status }))
        setDataCarriers([])
      })
  }

  useEffect(() => {
    getArray()
    getCarters()
    getAgents()
    getCarriers()
  }, [])

  useEffect(() => {
    const data = getAllData(dataAgents, dataCarters, dataPartners, dataCarriers)
    if (data && data.length > 0) setDataAll(data)
  }, [dataAgents, dataCarters, dataPartners, dataCarriers])

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

  useEffect(() => {
    if (selectCountries || dataType) {
      getSearchСountries()
    } else {
      getСountries()
    }
  }, [selectCountries, dataType])

  const getSearchСountries = () => {
    dispatch(showLoder({ getSearchСountries: 1 }))
    getRequest(`/api/v1/countries/search?limit=${1000}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataCountries(res.countries)
        dispatch(showLoder({ getSearchСountries: 0 }))
      })
      .catch((err) =>
        dispatch(showLoder({ getSearchСountries: 0, status: err.status }))
      )
  }

  const getСountries = () => {
    dispatch(showLoder({ getСountries: 1 }))
    getRequest(`/api/v1/countries?limit=${1000}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataCountries(res.countries)

        dispatch(showLoder({ getСountries: 0 }))
      })
      .catch((err) =>
        dispatch(showLoder({ getСountries: 0, status: err.status }))
      )
  }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        {/* <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={() => setIsModalRemove(false)}
        >
          <Modal.Header>
            <Modal.Title>Удаление партнера</Modal.Title>
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
        </Modal> */}
      </div>

      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{ paddingLeft: state.width, justifyContent: 'space-between' }}
        >
          <div className="groupSearch">
            {/* <div className="customCheckPicker"> */}
            {/* <label htmlFor="selectCustomId">Название площадки</label> */}
            {/* <SelectPicker
                id="selectCustomId"
                data={dataCountries}
                valueKey="id"
                labelKey="name_ru"
                value={selectCountries}
                onChange={setSelectCountries}
                placeholder="Выберите страну"
              />
            </div> */}
            <div className="customCheckPicker">
              {/* <label htmlFor="selectCustomId">Название площадки</label> */}
              <SelectPicker
                id="selectCustomId"
                data={typeList}
                valueKey="id"
                labelKey="name"
                value={dataType}
                onChange={setDataType}
                placeholder="Выберите тип"
              />
            </div>
          </div>

          <div className="btnTransport">
            {/* {viewBlock(101) && ( */}
            <button
              className="btnInfo"
              onClick={() => navigate('/agentCarrierAddProfile')}
            >
              <span>Добавить</span>
            </button>
            {/* )} */}
          </div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          {dataPartners.length > 0 || dataCarters.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={dataAll}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Наименование</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            clickToLink(rowData) &&
                            navigate(clickToLink(rowData))
                          }
                        >
                          {<span>{rowData.name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Тип</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            clickToLink(rowData) &&
                            navigate(clickToLink(rowData))
                          }
                        >
                          {<span>{rowData.type ? rowData.type : '-'}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                {/* <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Страна</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            // viewBlock(102) &&
                            clickToLink(rowData) &&
                            navigate(clickToLink(rowData))
                          }
                        >
                          {
                            <span>
                              {rowData.country ? rowData.country : '-'}
                            </span>
                          }
                        </span>
                      )
                    }}
                  </Cell>
                </Column> */}

                {/* {(viewBlock(102) || viewBlock(103)) && (
                  <Column align="center" flexGrow={1}>
                    <HeaderCell>Действие</HeaderCell>
                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <div>
                            <div className="Dropdown">
                              <div className="DropdownShow">
                                {viewBlock(102) && (
                                  <button
                                    onClick={() =>
                                      navigate(`/agentProfile/${rowData.id}`)
                                    }
                                  >
                                    <Edit />
                                  </button>
                                )}

                                {viewBlock(103) && (
                                  <button
                                    onClick={() => {
                                      setIdEdit(rowData.id)
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
                )} */}
              </Table>
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
export default ListOfСounterparty
