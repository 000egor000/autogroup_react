import React, { useState, useEffect, useContext, memo } from 'react'
import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
import { Pagination } from 'rsuite'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { showLoder } from '../reducers/actions'
import { getDateFunc } from '../helper.js'
import NoData from './NoData'
import ContextApp from '../context/contextApp'
import { putRequest } from '../base/api-request'
import PropTypes from 'prop-types'

const ContainerInner = ({
  dataAray,
  indicator,
  dataClick,
  dataAllInitial,
  statutsModalNow,
  currentClick,
}) => {
  const [mainArray, setMainArray] = useState([])
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState(0)
  const [accessRights, setAccessRights] = useState([])
  const { state, dispatch } = useContext(ContextApp)
  const navigate = useNavigate()

  useEffect(() => {
    if (dataClick) {
      let resAllClick = []
      if (dataClick.transport_auto_information) {
        dataClick.transport_auto_information.general_information.map((elem) => {
          resAllClick.push(elem.id)
        })
        setAccessRights(resAllClick)
      }
    }
  }, [dataClick])

  useEffect(() => {
    if (dataAray) {
      setMainArray(
        dataAray.general_information.slice(limit * (page - 1), limit * page)
      )
      setPaginationValue(dataAray.general_information.length)
    }
  }, [page, dataAray, limit])

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  // const getDateFunc = (val) => {
  //   let date = new Date(val)
  //   let year = String(date.toLocaleDateString()).split('.')[2]
  //   let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  //   let dayRes = String(date.toLocaleDateString()).split('.')[0]
  //   return dayRes + '-' + mouthRes + '-' + year
  // }

  const controlUrl = (val) => {
    // sessionStorage.removeItem('curLink')

    if (currentClick === 'Неразобранные') {
      return navigate(
        val.status_shipping.id && val.id && val.shippingInformation
          ? `/auction-transportNotAll/edit/${val.id}/editTransport/${val.shippingInformation.id}`
          : `/auction-transportNotAll/edit/${val.id}`
      )
    } else {
      return navigate(
        val.status_shipping.id && val.id && val.shippingInformation
          ? `/auction-transport/edit/${val.id}/editTransport/${val.shippingInformation.id}`
          : `/auction-transport/edit/${val.id}`
      )
    }
  }

  const updateContainer = () => {
    dispatch(showLoder({ updateContainer: 1 }))
    let params = {
      container_status_id: dataClick.container_status.id,
      port_id: dataClick.port.id,
      sea_line_id: dataClick.sea_line.id,
      number: dataClick.number,
      general_information_id: accessRights,
    }

    return putRequest(`/api/v1/containers/${dataClick.id}`, params)
      .then((res) => {
        statutsModalNow(false)

        // getInfo()
        state.createNotification('Успешно выполнено!', 'success')
        dataAllInitial()
        dispatch(showLoder({ updateContainer: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ updateContainer: 0 }))
      })
  }

  return mainArray.length > 0 ? (
    <React.Fragment>
      <Table
        autoHeight
        cellBordered={true}
        hover={true}
        bordered={true}
        data={mainArray}
      >
        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>Дата</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {<span>{getDateFunc(rowData.created_at)}</span>}
                </span>
              )
            }}
          </Cell>
        </Column>

        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>Марка/Модель</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {<span>{rowData.transport_name}</span>}
                </span>
              )
            }}
          </Cell>
        </Column>

        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>VIN</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {rowData.vin.slice(11)}
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
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {rowData.buyer_role.title}
                </span>
              )
            }}
          </Cell>
        </Column>
        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>Имя Фамилия</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {rowData.user[0].name_ru +
                    ' ' +
                    rowData.user[0].second_name_ru}
                </span>
              )
            }}
          </Cell>
        </Column>
        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>Аукцион</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {rowData.auction.name}
                </span>
              )
            }}
          </Cell>
        </Column>
        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>Buyer</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {rowData.credential.buyerCode}
                </span>
              )
            }}
          </Cell>
        </Column>

        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>Лот</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {rowData.lot}
                </span>
              )
            }}
          </Cell>
        </Column>

        <Column align="center" fixed flexGrow={1}>
          <HeaderCell>Порт</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <span
                  onClick={() => controlUrl(rowData)}
                  style={{ cursor: 'pointer' }}
                >
                  {rowData.port.name}
                </span>
              )
            }}
          </Cell>
        </Column>
      </Table>
      <div
        className="paginationBlock"
        style={{
          justifyContent: indicator ? 'space-between' : 'flex-end',
        }}
      >
        {indicator && (
          <button
            className="btn-success "
            onClick={() => updateContainer()}
            appearance="primary"
          >
            Добавить
          </button>
        )}
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
    </React.Fragment>
  ) : (
    <NoData />
  )
}

ContainerInner.propTypes = {
  dataAray: PropTypes.object,
  indicator: PropTypes.string,
  dataClick: PropTypes.array,
  dataAllInitial: PropTypes.func,
  statutsModalNow: PropTypes.func,
  currentClick: PropTypes.any,
}
export default memo(ContainerInner)
