import React, {useState, useContext, useEffect} from 'react'

import {Table, Column, HeaderCell, Cell} from 'rsuite-table'
import {Edit, Trash} from '@rsuite/icons'

import {Pagination, SelectPicker, CheckPicker, Modal} from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {viewPorts} from './../helper'

import {
    postRequest,
    getRequest,
    deleteRequest,
    putRequest,
} from '../base/api-request'

import {showLoder} from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const CostsDestination = (props) => {
    const [dataMaster, setDataMaster] = useState([])
    const partsLimit = [20, 50, 100]

    const [CostsDestinationEditValue, setCostsDestinationEditValue] = useState('')
    const [idEdit, setIdEdit] = useState('')

    const [paginationValue, setPaginationValue] = useState([])
    const [loadingShow, setLoadingShow] = useState(true)
    const [isModalShow, setIsModalShow] = useState(false)
    const [isModalShowEdit, setIsModalShowEdit] = useState(false)
    const [isModalRemove, setIsModalRemove] = useState(false)
    const [CostsDestinationValue, setCostsDestinationValue] = useState('')
    const [CostsDestinationsArray, setCostsDestinationsArray] = useState([])

    const [viewControler, setViewControler] = useState([])

    const [limit, setLimit] = useState(20)
    const [page, setPage] = useState(1)
    const [itemIsRemove, setItemIsRemove] = useState('')

    const {state, dispatch} = useContext(ContextApp)

    const remove = (id) => {
        dispatch(showLoder({removeCostsDestinations: 1}))
        setIsModalRemove(false)

        deleteRequest(`/api/v1/costs/destination/${id}`)
            .then((res) => {
                if (res.status === 'success') {
                    toast.success('Затрата места назначения  успешно удален!')
                    getArray()
                    dispatch(showLoder({removeCostsDestinations: 0}))
                }
            })
            .catch((err) => {
                toast.error('Что-то пошло не так!')
                dispatch(showLoder({removeCostsDestinations: 0}))
            })
    }


    const getArray = () => {
        dispatch(showLoder({getArray: 1}))
        getRequest(`/api/v1/costs/destination?page=${page}&limit=${limit}`, {
            Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
        })
            .then((res) => {
                setDataMaster(res.CostDestinations)
                setPaginationValue(res.pagination)
                setLoadingShow(false)
                dispatch(showLoder({getArray: 0}))
            })
            .catch((err) => {
                setDataMaster([])
                dispatch(showLoder({getArray: 0}))
            })
    }
    const getAllArray = () => {
        dispatch(showLoder({getAllArray: 1}))
        getRequest(`/api/v1/costs/destination?limit=1000`, {
            Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
        })
            .then((res) => {
                setCostsDestinationsArray(res.CostDestinations)
                dispatch(showLoder({getAllArray: 0}))
            })
            .catch((err) => {
                setCostsDestinationsArray([])
                dispatch(showLoder({getAllArray: 0}))
                // toast.error('Что-то пошло не так!')
            })
    }


    useEffect(() => {
        getArray()
        getAllArray()
    }, [page, limit])

    const showIdCostsDestination = (name, id,) => {
        setCostsDestinationEditValue(name ? name : '')

        setIdEdit(id ? id : '')
        setIsModalShowEdit(!isModalShowEdit)
    }

    let params = {
        title: CostsDestinationValue,
        active: 1,
        archive: 0,
    }

    let paramsEdit = {
        title: CostsDestinationEditValue,
        active: 1,
        archive: 0,
    }

    const createCostsDestination = (e) => {
        dispatch(showLoder({createCostsDestination: 1}))
        e.preventDefault()
        setIsModalShow(false)
        postRequest('/api/v1/costs/destination', params)
            .then(() => {
                toast.success('Затрата места назначения  успешно добавлена!')
                getArray()
                close()

                dispatch(showLoder({createCostsDestination: 0}))
            })
            .catch((err) => {
                toast.error('Проверьте веденные данные!')
                dispatch(showLoder({createCostsDestination: 0}))
            })
    }
    const editCostsDestination = (e) => {
        dispatch(showLoder({editCostsDestination: 1}))
        e.preventDefault()
        setIsModalShowEdit(false)
        putRequest(`/api/v1/costs/destination/${idEdit}`, paramsEdit)
            .then(() => {
                toast.success('Затрата места назначения  успешно изменена!')
                getArray()
                close()
                dispatch(showLoder({editCostsDestination: 0}))
            })
            .catch((err) => {
                toast.error('Проверьте веденные данные!')
                dispatch(showLoder({editCostsDestination: 0}))
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
        setCostsDestinationValue('')
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
            <ToastContainer/>
            <div className="modal-container">
                <Modal
                    backdrop={'static'}
                    keyboard={false}
                    open={isModalRemove}
                    onClose={() => close()}
                >
                    <Modal.Header>
                        <Modal.Title>Удаление затраты места назначения </Modal.Title>
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
                        <Modal.Title>Редактировать затрату места назначения </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={editCostsDestination}>
                            {/* <h2>Редактировать затрату места назначения </h2> */}

                            <label>
                                <span>Затрата места назначения </span>
                                <input
                                    className=""
                                    type="text"
                                    value={CostsDestinationEditValue}
                                    onChange={(e) => setCostsDestinationEditValue(e.target.value)}
                                    placeholder="Затрата места назначения "
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
                    open={isModalShow}
                    onClose={() => close()}
                >
                    <Modal.Header>
                        <Modal.Title>Добавить затрату места назначения </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={createCostsDestination}>
                            {/* <h2>Добавить затрату места назначения </h2> */}

                            <label>
                                <span>Затрата места назначения </span>
                                <input
                                    className=""
                                    type="text"
                                    value={CostsDestinationValue}
                                    onChange={(e) => setCostsDestinationValue(e.target.value)}
                                    placeholder="Затрата места назначения "
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

            <div className="itemContainer-inner">
                <div
                    className="top-item "
                    style={{
                        paddingLeft: state.width,
                        justifyContent: 'space-between',
                        alignItems: 'inherit',
                    }}
                >
                    <div className="btnTransport" style={{marginTop: '10px'}}>
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
                    style={{paddingLeft: state.width, color: 'black'}}
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
                                    <HeaderCell>Затрата места назначения </HeaderCell>
                                    <Cell>
                                        {(rowData, rowIndex) => {
                                            return (
                                                <span
                                                    onClick={() => {
                                                        viewBlock(109) &&
                                                        showIdCostsDestination(
                                                            rowData.title,
                                                            rowData.id,
                                                        )
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
                                                        showIdCostsDestination(
                                                            rowData.title,
                                                            rowData.id,
                                                        )
                                                    }}
                                                >
                          {<span>{rowData.active ? ('Активен') : ('Не активен')}</span>}
                        </span>
                                            )
                                        }}
                                    </Cell>
                                </Column>
                                <Column align="center" fixed flexGrow={1}>
                                    <HeaderCell>Архив</HeaderCell>
                                    <Cell>
                                        {(rowData, rowIndex) => {
                                            return (
                                                <span
                                                    onClick={() => {
                                                        viewBlock(109) &&
                                                        showIdCostsDestination(
                                                            rowData.title,
                                                            rowData.id,
                                                        )
                                                    }}
                                                >
                          {<span>{rowData.archive ? ('В архиве') : ('Не в архиве')}</span>}
                        </span>
                                            )
                                        }}
                                    </Cell>
                                </Column>

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
                                                                        showIdCostsDestination(
                                                                            rowData.name,
                                                                            rowData.id,
                                                                        )
                                                                    }}
                                                                >
                                                                    <Edit/>
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
                                                                    <Trash/>
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
                            {dataMaster.length >= limit ? (
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
                            ) : (
                                ''
                            )}
                        </div>
                    ) : (
                        'Нет затрат места назначения !'
                    )}
                </div>
            </div>
        </div>
    )
}
export default CostsDestination
