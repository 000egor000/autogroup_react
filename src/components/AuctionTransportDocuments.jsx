import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../base/api-request'
import 'react-toastify/dist/ReactToastify.css'

import AuctionTransportDocumentsData from '../components/AuctionTransportDocumentsData'
import AuctionTransportDocumentsCreateInvoice from '../components/AuctionTransportDocumentsCreateInvoice'
import AuctionTransportDocumentsDoc from '../components/AuctionTransportDocumentsDoc'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import PropTypes from 'prop-types'
import { btnInfo } from '../const.js'
import { controlNumber } from '../helper.js'

const AuctionTransportDocuments = ({
  viewBlock,
  carrierArray,
  credentialsArray,
  auctionArray,
  // priseAllСarrier,
}) => {
  const [dataContainer, setDataContainer] = useState([])
  const [financeDateArray, setFinanceDateArray] = useState([])
  const [invoiceInformationId, setInvoiceInformationId] = useState(0)
  const [dataUserArray, setDataUserArray] = useState([])
  const pathCurrent = window.location.pathname

  const { dispatch } = useContext(ContextApp)

  const [btnShowBlock, setBtnShowBlock] = useState(
    btnInfo.filter((el) =>
      pathCurrent.split('/')[1] === 'archiveTransport' ||
      pathCurrent.split('/')[1] === 'removedTransport'
        ? el.id === 'Документы'
        : el.id
    )
  )

  const [dataInfo, setDataInfo] = useState([])
  const [priceСarrier, setPriceСarrier] = useState(0)
  const { id } = useParams()

  useEffect(() => {
    dispatch(showLoder({ auto: 1 }))
    getRequest(`/api/v1/order/transport-auto/${id}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataInfo(res)
        dispatch(showLoder({ auto: 0 }))
      })

      .catch((err) => {
        dispatch(showLoder({ auto: 0 }))
      })
  }, [])
  useState(() => {
    const res = 0
    if (financeDateArray.length > 0) {
      console.log(JSON.parse(financeDateArray.at(-1).usa_finance))
    }
  }, [financeDateArray])

  const priseAllСarrier = ({ usa_finance, ag_finance }) => {
    const { children } = JSON.parse(usa_finance)
    const { resultPrice } = JSON.parse(ag_finance)
    const resultPriceVal = resultPrice ? resultPrice : 0
    const childrenVal =
      children && children.length > 0 ? children.at(-1).finalPriceAg : 0

    setPriceСarrier((+resultPriceVal + childrenVal).toFixed(2))
  }

  useEffect(() => {
    dispatch(showLoder({ info: 1 }))
    getRequest(`/api/v1/order/finance/${id}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFinanceDateArray(res.finance_information)
        priseAllСarrier(...res.finance_information)

        dispatch(showLoder({ info: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ info: 0 }))
      })
  }, [])

  const invoiceId = (val) => setInvoiceInformationId(val)

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
      case 'Данные получателя/плательщика':
        return (
          <AuctionTransportDocumentsData
            dataUserArray={dataUserArray}
            getArrayCustomer={getArrayCustomer}
            itemStatus={val.status}
            idItem={id}
            viewBlock={viewBlock}
          />
        )

      case 'Создания инвойса':
        return (
          <AuctionTransportDocumentsCreateInvoice
            dataUserArray={dataUserArray}
            getArrayCustomer={getArrayCustomer}
            itemStatus={val.status}
            carrierArray={carrierArray}
            idItem={id}
            priseAutoProps={
              financeDateArray.length > 0 ? financeDateArray[0].ag_price : 0
            }
            dataInfo={dataInfo}
            invoiceId={invoiceId}
            // invoiceDataId={invoiceDataId}
            credentialsArray={credentialsArray}
            auctionArray={auctionArray}
          />
        )
      case 'Документы':
        return (
          <AuctionTransportDocumentsDoc
            itemStatus={val.status}
            idItem={id}
            getArrayCustomer={getArrayCustomer}
            invoiceInformationId={invoiceInformationId}
          />
        )

      default:
        return console.log('incorrect value')
    }
  }

  useEffect(() => {
    getArrayCustomer()
    return () => {
      setDataUserArray([])
    }
  }, [])

  const getArrayCustomer = () => {
    dispatch(showLoder({ getArrayCustomer: 1 }))
    getRequest(`/api/v1/order/customer/${id}/info?limit=100`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataUserArray(
          [{ id: 0, name: 'Выбрать из списка' }].concat(
            res.customer_information
          )
        )
        dispatch(showLoder({ getArrayCustomer: 0 }))
      })
      .catch((err) => {
        setDataUserArray([{ id: 0, name: 'Выбрать из списка' }])
        dispatch(showLoder({ getArrayCustomer: 0 }))
      })
  }

  return (
    <React.Fragment>
      <div className="blockInfoPrice">
        <div className="dropBlockContent ">
          <div className="blockInfoPrice ">
            <p>
              <span>
                {(financeDateArray.length > 0 &&
                financeDateArray.at(-1).pay_info
                  ? Number(
                      JSON.parse(financeDateArray.at(-1).pay_info).currentResTop
                    )
                  : 0
                ).toFixed(2) + ' $'}
              </span>
              <span> - цена авто на аукционе с учетом сбора</span>
            </p>
          </div>
        </div>

        <div className="dropBlockContent ">
          <div className="blockInfoPrice">
            <p>
              <span>{priceСarrier + ' $'}</span>

              <span>- цена перевозки ( ждет подтвержения)</span>
            </p>
          </div>
        </div>
      </div>
      {btnShowBlock.map((item) => {
        return (
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
        )
      })}
    </React.Fragment>
  )
}
AuctionTransportDocuments.propTypes = {
  viewBlock: PropTypes.func,
}

export default AuctionTransportDocuments
