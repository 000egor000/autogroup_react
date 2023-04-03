import React, {useState, useContext, useEffect} from 'react'

import {Table, Column, HeaderCell, Cell} from 'rsuite-table'

import 'rsuite-table/dist/css/rsuite-table.css'

import {deleteRequest, getRequest, postRequest, putRequest} from '../base/api-request'

import {showLoder} from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import NoData from './NoData'
import {Edit, Trash} from "@rsuite/icons";
import {toast, ToastContainer} from "react-toastify";
import {Modal, SelectPicker} from "rsuite";

const ListAuctions = () => {
    const {state, dispatch} = useContext(ContextApp)
    const [countrySelect, setCountrySelect] = useState('')
    const [dataCountries, setDataCountries] = useState([])
    const [auctionArray, seAuctionArray] = useState([])
    const [idEdit, setIdEdit] = useState('')
    const [isModalShowEdit, setIsModalShowEdit] = useState(false)
    const [itemIsRemove, setItemIsRemove] = useState('')
    const [loadingShow, setLoadingShow] = useState(true)
    const [isModalShow, setIsModalShow] = useState(false)
    const [isModalRemove, setIsModalRemove] = useState(false)
    const [auctionName, setAuctionName] = useState('')

    useEffect(() => {
        dispatch(showLoder({countries: 1}))
        getRequest('/api/v1/countries', {
            Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
        })
            .then((res) => {
                setDataCountries(res.countries)
                dispatch(showLoder({countries: 0}))
            })
            .catch(() => dispatch(showLoder({countries: 0})))
    }, [])

    const remove = (id) => {
        dispatch(showLoder({removaAuction: 1}))
        setIsModalRemove(false)

        deleteRequest(`/api/v1/auction/${id}`)
            .then((res) => {
                if (res.status === 'success') {
                    toast.success('Аукцион успешно удален!')
                    getArray()
                    dispatch(showLoder({removaAuction: 0}))
                }
            })
            .catch((err) => {
                toast.error('Что-то пошло не так!')
                dispatch(showLoder({removaAuction: 0}))
            })
    }
    const getArray = () => {
        dispatch(showLoder({auctions: 1}))
        getRequest('/api/v1/auctions', {
            Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
        })
            .then((res) => {
                seAuctionArray(res.auction)

                dispatch(showLoder({auctions: 0}))
            })
            .catch((err) => {
                dispatch(showLoder({auctions: 0}))
            })
    }
    useEffect(() => {
        dispatch(showLoder({auctions: 1}))
        getRequest('/api/v1/auctions', {
            Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
        })
            .then((res) => {
                seAuctionArray(res.auction)

                dispatch(showLoder({auctions: 0}))
            })
            .catch((err) => {
                dispatch(showLoder({auctions: 0}))
            })
    }, [])

    let params = {
        name: auctionName,
        country_id: countrySelect,
    }

    let paramsEdit = {
        name: auctionName,
        country_id: countrySelect,
    }

    const createAuction = (e) => {
        dispatch(showLoder({createAuction: 1}))
        e.preventDefault()
        setIsModalShow(false)
        postRequest('/api/v1/auctions', params)
            .then(() => {
                toast.success('Аукцион успешно добавлена!')
                getArray()
                close()

                dispatch(showLoder({createAuction: 0}))
            })
            .catch((err) => {
                toast.error('Проверьте веденные данные!')
                dispatch(showLoder({createAuction: 0}))
            })
    }
    const editAuction = (e) => {
        dispatch(showLoder({editAuction: 1}))
        e.preventDefault()
        setIsModalShowEdit(false)
        putRequest(`/api/v1/auctions/${idEdit}`, paramsEdit)
            .then(() => {
                toast.success('Аукцион успешно изменена!')
                getArray()
                close()
                dispatch(showLoder({editAuction: 0}))
            })
            .catch((err) => {
                toast.error('Проверьте веденные данные!')
                dispatch(showLoder({editCostsDestination: 0}))
            })
    }
    const close = () => {
        setIsModalRemove(false)
        setIsModalShowEdit(false)
        setIsModalShow(false)
        setAuctionName('')
    }
    const showIdAuction = (name, id, country_id) => {
        setAuctionName(name ? name : '')
        setCountrySelect(country_id)

        setIdEdit(id ? id : '')
        setIsModalShowEdit(!isModalShowEdit)
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
                        <Modal.Title>Удаление аукциона </Modal.Title>
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
                        <Modal.Title>Редактировать аукцион</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={editAuction}>

                            <label>
                                <span>Аукцион </span>
                                <input
                                    className=""
                                    type="text"
                                    value={auctionName}
                                    onChange={(e) => setAuctionName(e.target.value)}
                                    placeholder="Аукцион"
                                    required
                                />
                            </label>
                            {dataCountries.length > 0 ? (
                                <label>
                                    <span>Страна</span>
                                    <SelectPicker
                                        id="selectCustomId"
                                        data={dataCountries}
                                        valueKey="id"
                                        labelKey="name_ru"
                                        value={countrySelect}
                                        onChange={setCountrySelect}
                                        placeholder="Выберите страну"
                                        loading={!dataCountries.length}
                                        style={{width: '60%'}}
                                        required
                                    />
                                </label>
                            ) : ('Нет данных')}

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
                        <Modal.Title>Добавить аукцион</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={createAuction}>

                            <label>
                                <span>Аукцион</span>
                                <input
                                    className=""
                                    type="text"
                                    value={auctionName}
                                    onChange={(e) => setAuctionName(e.target.value)}
                                    placeholder="Аукцион"
                                    required
                                />
                            </label>
                            <label>
                                <span>Страна</span>
                                {dataCountries.length > 0 ? (
                                    <SelectPicker
                                        id="selectCustomId"
                                        data={dataCountries}
                                        valueKey="id"
                                        labelKey="name_ru"
                                        value={countrySelect}
                                        onChange={setCountrySelect}
                                        placeholder="Выберите страну"
                                        loading={!dataCountries.length}
                                        style={{width: '60%'}}
                                    />
                                ) : ('Нет данных')}
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
                    className="top-item "
                    style={{
                        paddingLeft: state.width,
                        justifyContent: 'space-between',
                        alignItems: 'inherit',
                    }}
                >
                    <div className="btnTransport"></div>
                </div>
                <div
                    className="bottom-itemFooter"
                    style={{paddingLeft: state.width, color: 'black'}}
                >
                    {auctionArray.length > 0 ? (
                        <div className="Table">
                            <Table
                                autoHeight
                                cellBordered={true}
                                hover={true}
                                bordered={true}
                                data={auctionArray}
                            >
                                <Column align="center" fixed>
                                    <HeaderCell></HeaderCell>
                                    <Cell>
                                        {(rowData, rowIndex) => {
                                            return <span>{rowIndex + 1}</span>
                                        }}
                                    </Cell>
                                </Column>
                                <Column align="center" fixed flexGrow={0.5}>
                                    <HeaderCell>Аукцион</HeaderCell>
                                    <Cell>
                                        {(rowData, rowIndex) => {
                                            return <span>{rowData.name}</span>
                                        }}
                                    </Cell>
                                </Column>
                                <Column align="center" fixed flexGrow={0.5}>
                                    <HeaderCell>Страна</HeaderCell>
                                    <Cell>
                                        {(rowData, rowIndex) => {
                                            return <span>{rowData.country.name_ru}</span>
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
                                                            <button
                                                                onClick={() => {
                                                                    showIdAuction(
                                                                        rowData.name,
                                                                        rowData.id,
                                                                        rowData.country_id,
                                                                    )
                                                                }}
                                                            >
                                                                <Edit/>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    // remove(rowData.id)
                                                                    setItemIsRemove(rowData.id)
                                                                    setIsModalRemove(true)
                                                                }}
                                                            >
                                                                <Trash/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </div>
                    ) : (
                        <NoData/>
                    )}
                </div>
            </div>
        </div>
    )
}
export default ListAuctions
