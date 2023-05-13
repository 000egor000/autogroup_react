import React, { useState, useContext, useEffect, memo } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../base/api-request'

import AuctionTransportPayAddPay from '../components/AuctionTransportPayAddPay'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

import AuctionTransportPayTable from '../components/AuctionTransportPayTable'

import AuctionTransportPayEnd from './AuctionTransportPayEnd'
import PropTypes from 'prop-types'
import { btnShowPay } from '../const.js'

const AuctionTransportPay = ({
  viewBlock,
  carrierArray,
  credentialsArray,
  auctionArray,
}) => {
  const [dataInfo, setDataInfo] = useState({})
  const [dataContainer, setDataContainer] = useState([])
  const { id } = useParams()

  const [financeDateArray, setFinanceDateArray] = useState([])
  const [dataPayArray, setDataPayArray] = useState([])
  const [fullSumLot, setFullSumLot] = useState(0)
  const [fullSumShipping, setFullSumShipping] = useState(0)
  const [dataArrayProp, setDataArrayProp] = useState([])
  const [priceСarrier, setPriceСarrier] = useState(0)

  const { state, dispatch } = useContext(ContextApp)
  const pathCurrent = window.location.pathname
  const [btnShowBlock, setBtnShowBlock] = useState(
    btnShowPay.filter((el) =>
      pathCurrent.split('/')[1] === 'archiveTransport' ||
      pathCurrent.split('/')[1] === 'removedTransport'
        ? el.id === 'Платежи Совершенные'
        : el.id
    )
  )

  const chooseItemBlock = (id) => {
    if (dataContainer.includes(id)) {
      const newArr = btnShowBlock.map((item) =>
        item.id === id ? { ...item, status: false } : { ...item, status: false }
      )
      setBtnShowBlock(newArr)
      setDataContainer([])
    } else {
      setDataContainer([id])
      const newArr = btnShowBlock.map((item) =>
        item.id === id ? { ...item, status: true } : { ...item, status: false }
      )
      setBtnShowBlock(newArr)
    }
  }

  const viewComponents = (val) => {
    switch (val.id) {
      case 'Добавить Оплату':
        return (
          <AuctionTransportPayAddPay
            itemStatus={val.status}
            propsId={id}
            getPaymentArray={getPaymentArray}
            financeDateArray={financeDateArray}
            dataArrayProp={dataArrayProp}
            dataInfo={dataInfo}
            viewBlockProp={viewBlock}
            carrierArray={carrierArray}
            credentialsArray={credentialsArray}
            auctionArray={auctionArray}
          />
        )

      case 'Платежи Совершенные':
        return (
          <AuctionTransportPayEnd
            itemStatus={val.status}
            dataPayArray={dataPayArray}
          />
        )

      default:
        return console.log('incorrect value')
    }
  }

  useEffect(() => {
    dispatch(showLoder({ transport: 1 }))
    getRequest(`/api/v1/order/transport-auto?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        let filterData = res.general_information.filter(
          (el) => el.id === +id
        )[0]
        setDataInfo(filterData)
        setDataArrayProp(res.general_information)

        dispatch(showLoder({ transport: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ transport: 0 }))
      })
  }, [])

  const priseAllСarrier = ({ usa_finance, ag_finance }) => {
    const { children } = JSON.parse(usa_finance)
    const { resultPrice } = JSON.parse(ag_finance)
    const resultPriceVal = resultPrice ? resultPrice : 0
    const childrenVal =
      children && children.length > 0 ? children.at(-1).finalPriceAg : 0

    setPriceСarrier((+resultPriceVal + childrenVal).toFixed(2))
  }

  useEffect(() => {
    dispatch(showLoder({ finance: 1 }))
    getRequest(`/api/v1/order/finance/${id}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFinanceDateArray(res.finance_information)
        priseAllСarrier(...res.finance_information)
        dispatch(showLoder({ finance: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ finance: 0 }))
      })
  }, [])

  useEffect(() => {
    getPaymentArray()
  }, [])

  const getPaymentArray = () => {
    dispatch(showLoder({ getPaymentArray: 1 }))
    getRequest(`/api/v1/order/payment/${id}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPayArray(res.payment_information)

        setFullSumLot(res.fullSumLot)
        setFullSumShipping(res.fullSumShipping)
        dispatch(showLoder({ getPaymentArray: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ getPaymentArray: 0 }))
      })
  }

  return (
    <React.Fragment>
      <div className="dropBlockContent" style={{ width: '100%' }}>
        <div className="blockInfoPrice">
          <h3> Лот</h3>
          <p>
            <span>Оплата: </span>
            <span>{(fullSumLot ? fullSumLot : 0.0).toFixed(2) + ' $'}</span>
          </p>
          <p>
            <span>Цена лота: </span>
            <span>
              {(financeDateArray.length > 0 && financeDateArray.at(-1).pay_info
                ? Number(
                    JSON.parse(financeDateArray.at(-1).pay_info).currentResTop
                  )
                : 0
              ).toFixed(2) + ' $'}
            </span>
          </p>

          <p>
            <span>Результат по сделке: </span>
            <span>
              {(financeDateArray.length > 0 && financeDateArray.at(-1).pay_info
                ? Number(fullSumLot) -
                  Number(
                    JSON.parse(financeDateArray.at(-1).pay_info).currentResTop
                  )
                : 0
              ).toFixed(2) + ' $'}
            </span>
          </p>
        </div>
        <AuctionTransportPayTable
          dataArray={dataPayArray[0] ? dataPayArray[0] : []}
          getPaymentArray={getPaymentArray}
          viewBlockProp={viewBlock}
        />
      </div>

      <div className="dropBlockContent" style={{ width: '100%' }}>
        <div className="blockInfoPrice">
          <h3> Доставка</h3>
          <p>
            <span>Оплата: </span>
            <span>
              {(fullSumShipping ? fullSumShipping : 0.0).toFixed(2) + ' $'}
            </span>
          </p>
          <p>
            <span>Цена доставки: </span>
            <span>{priceСarrier + ' $'}</span>
          </p>

          <p>
            <span>Результат по сделке: </span>

            <span>
              {(financeDateArray.length > 0
                ? +fullSumShipping - priceСarrier
                : 0.0
              ).toFixed(2) + ' $'}
            </span>
          </p>
        </div>

        <AuctionTransportPayTable
          dataArray={dataPayArray[1] ? dataPayArray[1] : []}
          getPaymentArray={getPaymentArray}
          viewBlockProp={viewBlock}
        />
      </div>

      {btnShowBlock.map((item) => (
        <React.Fragment key={item.id}>
          <div
            className="dropBlock"
            onClick={() => chooseItemBlock(item.id)}
            style={{
              background: item.status ? '#735ba7' : '#fff',
              color: item.status ? '#fff' : 'black',
            }}
          >
            <span>{item.id}</span>
          </div>
          {viewComponents(item)}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

AuctionTransportPay.propTypes = {
  viewBlock: PropTypes.func,
}
export default memo(AuctionTransportPay)
