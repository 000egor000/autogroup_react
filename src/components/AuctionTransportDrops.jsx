import React, { useState, useContext, memo } from 'react'

import { useParams } from 'react-router-dom'
import { getRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import AuctionTransportDropsAnotherDoc from '../components/AuctionTransportDropsAnotherDoc'
// import AuctionTransportDropsPay from '../components/AuctionTransportDropsPay'
import AuctionTransportDocumentsDoc from '../components/AuctionTransportDocumentsDoc'
import AuctionTransportPayEnd from '../components/AuctionTransportPayEnd'
import { useEffect } from 'react'
import PropTypes from 'prop-types'

import { btnInfoInvoice } from '../const.js'

const AuctionTransportDrops = ({ viewBlock }) => {
  const [dataContainer, setDataContainer] = useState([])
  const { state, dispatch } = useContext(ContextApp)
  const pathCurrent = window.location.pathname
  const [dataPayArray, setDataPayArray] = useState([])
  const [btnShowBlock, setBtnShowBlock] = useState(
    btnInfoInvoice.filter((el) =>
      pathCurrent.split('/')[1] === 'archiveTransport' ||
      pathCurrent.split('/')[1] === 'removedTransport'
        ? el.id !== 'Доп.доки'
        : el.id
    )
  )

  let { id } = useParams()

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

        dispatch(showLoder({ getPaymentArray: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getPaymentArray: 0, status: err.status }))
      })
  }

  const viewComponents = (val) => {
    switch (val.id) {
      case 'Инвойсы':
        return (
          <AuctionTransportDocumentsDoc itemStatus={val.status} idItem={id} />
        )
      case 'Платежи':
        return (
          <AuctionTransportPayEnd
            itemStatus={val.status}
            propsId={id}
            getPaymentArray={getPaymentArray}
            dataPayArray={dataPayArray}
          />
        )

      case 'Доп.доки':
        return (
          <AuctionTransportDropsAnotherDoc
            itemStatus={val.status}
            propsId={+id}
            viewBlockProp={viewBlock}
          />
        )

      default:
        return console.log('incorrect value')
    }
  }

  return (
    <React.Fragment>
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

AuctionTransportDrops.propTypes = {
  viewBlock: PropTypes.func,
}
export default memo(AuctionTransportDrops)
