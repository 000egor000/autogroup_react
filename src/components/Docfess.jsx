import React, { useState, useContext, useEffect, memo } from 'react'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'

import { Edit, Trash } from '@rsuite/icons'

import { Pagination, Modal } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'
import NoData from './NoData'

import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import PropTypes from 'prop-types'

const Docfess = ({ currentRates, viewBlock, dataArray }) => {
  const [currentUrlId, setCurrentUrlId] = useState('')
  const [dataArrayDoc, setDataArrayDoc] = useState([])
  const [idEdit, setIdEdit] = useState('')
  const [itemIsRemove, setItemIsRemove] = useState('')
  const { state, dispatch } = useContext(ContextApp)

  //modalShowHide
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)

  //modalAdd
  const [nameDoc, setNameDoc] = useState('')
  const [priceDoc, setPriceDoc] = useState('')
  // const [descriptionDoc, setDescriptionDoc] = useState('')
  // const [colorBorder, setColorBorder] = useState('')
  // const [addDescriptionDoc, setAddDescriptionDoc] = useState('')
  //
  //modalEdit
  const [nameDocEdit, setNameDocEdit] = useState('')
  const [priceDocEdit, setPriceDocEdit] = useState('')
  // const [descriptionDocEdit, setDescriptionDocEdit] = useState('')
  // const [colorBorderEdit, setColorBorderEdit] = useState('')
  // const [addDescriptionDocEdit, setAddDescriptionDocEdit] = useState('')
  //
  //pagination
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState([])
  //

  const paramsAdd = {
    title: nameDoc,
    price: priceDoc,
    // description: descriptionDoc,
    // color: colorBorder,
    // additional: addDescriptionDoc,
    carrier_id: currentUrlId,
  }
  const paramsEdit = {
    title: nameDocEdit,
    price: priceDocEdit,
    // description: descriptionDocEdit,
    // color: colorBorderEdit,
    // additional: addDescriptionDocEdit,
    carrier_id: currentUrlId,
  }

  // useEffect(() => {
  //   dispatch(showLoder({ carriers: 1 }))
  //   getRequest('/api/v1/carriers', {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       res.carriers.map(({ code, id }) => {
  //         if (
  //           code === currentRates
  //           // ||
  //           // (currentRates === 'aec' && code == 'test')
  //         ) {
  //           setCurrentUrlId(id)
  //           getArray(id)
  //         }
  //       })
  //       dispatch(showLoder({ carriers: 0 }))
  //     })

  //     .catch((err) => {
  //       dispatch(showLoder({ carriers: 0 }))
  //     })
  // }, [page, currentRates])

  useEffect(() => {
    if (dataArray.length > 0) {
      // const idCarrier = dataArray.find((elem) => elem.value == currentRates)

      setCurrentUrlId(currentRates)
      getArray(currentRates)
    } else {
      setCurrentUrlId('')
      setDataArrayDoc([])
    }
  }, [page, currentRates, dataArray])

  const remove = (id) => {
    dispatch(showLoder({ remove: 1 }))
    deleteRequest(`/api/v1/rates-fees/doc-fees/${id}`)
      .then((res) => {
        state.createNotification('Успешно удалено!', 'success')
        getArray()
        setIsModalRemove(false)
        dispatch(showLoder({ remove: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0 }))
      })
  }

  const getArray = (val) => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(
      `/api/v1/rates-fees/doc-fees?carrier_id=${
        val ? val : currentUrlId
      }&page=${page}`,
      {
        Authorization: `Bearer ${window.sessionStorage.getItem(
          'access_token'
        )}`,
      }
    )
      .then((res) => {
        setDataArrayDoc(res.docFees)
        setPaginationValue(res.pagination)
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataArrayDoc([])
        dispatch(showLoder({ getArray: 0 }))
      })
  }

  const editLocation = (e) => {
    dispatch(showLoder({ editLocation: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    putRequest(`/api/v1/rates-fees/doc-fees/${idEdit}`, paramsEdit)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')
        getArray()
        dispatch(showLoder({ editLocation: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editLocation: 0 }))
      })
  }

  const showIdLocation = ({
    title,
    price,
    // description,
    // color,
    // additional,
    id,
  }) => {
    setNameDocEdit(title)
    setPriceDocEdit(price)
    // setDescriptionDocEdit(description)
    // setColorBorderEdit(color)
    // setAddDescriptionDocEdit(additional)
    setIdEdit(id)
    setIsModalShowEdit(true)
  }

  const reset = () => {
    //add
    setNameDoc('')
    setPriceDoc('')
    // setDescriptionDoc('')
    // setColorBorder('')
    // setAddDescriptionDoc('')
    //edit
    setNameDocEdit('')
    setPriceDocEdit('')
    // setDescriptionDocEdit('')
    // setColorBorderEdit('')
    // setAddDescriptionDocEdit('')
  }

  const createDoc = (e) => {
    e.preventDefault()
    dispatch(showLoder({ createDoc: 1 }))
    postRequest('/api/v1/rates-fees/doc-fees', paramsAdd)
      .then(() => {
        reset()
        getArray()
        setIsModalShow(false)
        dispatch(showLoder({ createDoc: 0 }))
        state.createNotification('Успешно выполнено!', 'success')
      })
      .catch((err) => {
        dispatch(showLoder({ createDoc: 0 }))
        state.createNotification('Проверьте веденные данные!', 'error')
      })
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  const controlBlock = () => {
    let bool = false

    if (viewBlock(81) && currentRates === 'aec') {
      return (bool = true)
    }

    if (viewBlock(83) && currentRates === 'auto_universe') {
      return (bool = true)
    }
    if (viewBlock(85) && currentRates === 'aglogistic') {
      return (bool = true)
    }

    return bool
  }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShow}
          onClose={() => {
            setIsModalShow(false)
            reset()
          }}
        >
          <Modal.Header>
            <Modal.Title>Добавить</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createDoc}>
              {/* <h2>Добавить локацию</h2> */}

              <label>
                <span> Название документа</span>
                <input
                  className=""
                  type="text"
                  value={nameDoc}
                  onChange={(e) => setNameDoc(e.target.value)}
                  placeholder=" Название документа"
                  required
                />
              </label>
              <label>
                <span> Цена документа</span>
                <input
                  className=""
                  type="text"
                  value={priceDoc}
                  onChange={(e) => setPriceDoc(e.target.value)}
                  placeholder="Цена документа"
                  required
                />
              </label>
              {/* <label>
								<span> Описание документа</span>
								<input
									className=''
									type='text'
									value={descriptionDoc}
									onChange={(e) => setDescriptionDoc(e.target.value)}
									placeholder='Описание документа'
								/>
							</label> */}
              {/* <label>
								<span> Цвет рамки документа</span>
								<input
									className=''
									type='text'
									value={colorBorder}
									onChange={(e) => setColorBorder(e.target.value)}
									placeholder='Цвет рамки документа'
								/>
							</label> */}
              {/* <label>
								<span> Доп. описание документа</span>
								<input
									className=''
									type='text'
									value={addDescriptionDoc}
									onChange={(e) => setAddDescriptionDoc(e.target.value)}
									placeholder='Доп. описание документа'
								/>
							</label> */}

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
          open={isModalRemove}
          onClose={() => setIsModalRemove(false)}
        >
          <Modal.Header>
            <Modal.Title>Удаление </Modal.Title>
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
          onClose={() => {
            setIsModalShowEdit(false)
            reset()
          }}
        >
          <Modal.Header>
            <Modal.Title>Редактировать </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editLocation}>
              <label>
                <span> Название документа</span>
                <input
                  className=""
                  type="text"
                  value={nameDocEdit}
                  onChange={(e) => setNameDocEdit(e.target.value)}
                  placeholder=" Название документа"
                  required
                />
              </label>
              <label>
                <span> Цена документа</span>
                <input
                  className=""
                  type="text"
                  value={priceDocEdit}
                  onChange={(e) => setPriceDocEdit(e.target.value)}
                  placeholder="Цена документа"
                  required
                />
              </label>
              {/* <label>
                <span> Описание документа</span>
                <input
                  className=""
                  type="text"
                  value={descriptionDocEdit}
                  onChange={(e) => setDescriptionDocEdit(e.target.value)}
                  placeholder="Описание документа"
                />
              </label> */}
              {/* <label>
                <span> Цвет рамки документа</span>
                <input
                  className=""
                  type="text"
                  value={colorBorderEdit}
                  onChange={(e) => setColorBorderEdit(e.target.value)}
                  placeholder="Цвет рамки документа"
                />
              </label> */}
              {/* <label>
                <span> Доп. описание документа</span>
                <input
                  className=""
                  type="text"
                  value={addDescriptionDocEdit}
                  onChange={(e) => setAddDescriptionDocEdit(e.target.value)}
                  placeholder="Доп. описание документа"
                />
              </label> */}

              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      {currentUrlId && dataArrayDoc.length > 0 ? (
        <>
          <div className="itemContainer-inner">
            <div className="top-item " style={{ paddingLeft: state.width }}>
              <div className="btnTransport">
                {/* <h1 className='titleInfo'>{titleRates}</h1> */}
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
              {dataArrayDoc.length > 0 && (
                <div className="Table">
                  <Table
                    autoHeight
                    cellBordered={true}
                    hover={true}
                    bordered={true}
                    data={dataArrayDoc}
                  >
                    <Column align="center" fixed flexGrow={0.2}>
                      <HeaderCell>№</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <span
                              onClick={() => {
                                showIdLocation(rowData)
                              }}
                            >
                              {<span>{rowIndex + 1}</span>}
                            </span>
                          )
                        }}
                      </Cell>
                    </Column>
                    <Column align="center" flexGrow={1}>
                      <HeaderCell>Название документа</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <span
                              onClick={() => {
                                showIdLocation(rowData)
                              }}
                            >
                              {<span>{rowData.title}</span>}
                            </span>
                          )
                        }}
                      </Cell>
                    </Column>
                    <Column align="center" flexGrow={1}>
                      <HeaderCell> Цена документа</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <span
                              onClick={() => {
                                showIdLocation(rowData)
                              }}
                            >
                              {rowData.price}
                            </span>
                          )
                        }}
                      </Cell>
                    </Column>
                    {/* <Column align='center' fixed flexGrow={1.5}>
									<HeaderCell> Описание документа</HeaderCell>
									<Cell>
										{(rowData, rowIndex) => {
											return (
												<span
													style={{ overflow: 'hidden' }}
													onClick={() => {
														showIdLocation(rowData)
													}}
												>
													{rowData.description}
												</span>
											)
										}}
									</Cell>
								</Column> */}
                    {/* <Column align='center' fixed flexGrow={0.5}>
									<HeaderCell> Цвет рамки документа</HeaderCell>
									<Cell>
										{(rowData, rowIndex) => {
											return (
												<span
													onClick={() => {
														showIdLocation(rowData)
													}}
												>
													{rowData.color}
												</span>
											)
										}}
									</Cell>
								</Column> */}
                    {/* <Column align='center' fixed flexGrow={2}>
									<HeaderCell> Доп. описание документа</HeaderCell>
									<Cell>
										{(rowData, rowIndex) => {
											return (
												<span
													onClick={() => {
														showIdLocation(rowData)
													}}
												>
													{rowData.additional}
												</span>
											)
										}}
									</Cell>
								</Column> */}
                    {controlBlock() && (
                      <Column align="center" flexGrow={1}>
                        <HeaderCell>Действие</HeaderCell>
                        <Cell>
                          {(rowData, rowIndex) => {
                            return (
                              <div>
                                <div className="Dropdown">
                                  <div className="DropdownShow">
                                    <button
                                      onClick={() => {
                                        showIdLocation(rowData)
                                      }}
                                    >
                                      <Edit />
                                    </button>

                                    <button
                                      onClick={() => {
                                        // remove(rowData.id)
                                        setItemIsRemove(rowData.id)
                                        setIsModalRemove(true)
                                      }}
                                    >
                                      <Trash />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          }}
                        </Cell>
                      </Column>
                    )}
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
                      layout={['total', 'pager']}
                      total={paginationValue.total_results}
                      limitOptions={[5, 10]}
                      limit={limit}
                      activePage={page}
                      onChangePage={setPage}
                      onChangeLimit={handleChangeLimit}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <NoData />
      )}
    </div>
  )
}

Docfess.propTypes = {
  currentRates: PropTypes.string,
  viewBlock: PropTypes.func,
}
export default memo(Docfess)
