import React, { useState, useEffect, useContext, memo } from 'react'
import { useParams } from 'react-router-dom'

import { getRequest } from '../base/api-request'

import AuctionTransportCreate from '../components/AuctionTransportCreate'
import AuctionTransportEdit from '../components/AuctionTransportEdit'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp'
import PropTypes from 'prop-types'

const AuctionsTransportsTransort = ({
  viewBlock,
  getShortInfo,
  destinationsArray,
  carrierArray,
}) => {
  const { id, idShipping } = useParams()
  const [fillDataProps, setFillDataProps] = useState([])

  const [fillContainer, setFillContainer] = useState({})
  const [clickGetDataInfoStatus, setClickGetDataInfoStatus] = useState(false)
  const { dispatch, state } = useContext(ContextApp)

  useEffect(() => {
    idShipping && getDataInfo()
    return () => {
      setFillDataProps([])
    }
  }, [])
  useEffect(() => {
    getInfoAec()
  }, [])

  const getDataInfo = () => {
    dispatch(showLoder({ shippingInfo: 1 }))
    getRequest(`/api/v1/order/shipping/${id}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFillDataProps(res.shipping_information)
        setClickGetDataInfoStatus(false)
        dispatch(showLoder({ shippingInfo: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ shippingInfo: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  const getInfoAec = () => {
    dispatch(showLoder({ startInfo: 1 }))

    getRequest(`/api/v1/order/shipping/${id}/start-info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFillContainer(res)
        dispatch(showLoder({ startInfo: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ startInfo: 0 }))
      })
  }

  const viewCreateOrEdit = (idShipping) =>
    idShipping ? (
      <AuctionTransportEdit
        dataProps={fillDataProps}
        getDataInfo={getDataInfo}
        viewBlock={viewBlock}
        getShortInfo={getShortInfo}
        destinationsArray={destinationsArray}
        getInfoAec={getInfoAec}
        carrierArray={carrierArray}
        notificationTitle={
          fillContainer.hasOwnProperty('notification')
            ? fillContainer.notification.name
            : ''
        }
        clickGetDataInfoStatus={clickGetDataInfoStatus}
        setClickGetDataInfoStatus={setClickGetDataInfoStatus}
        fillContainer={fillContainer}
      />
    ) : (
      <AuctionTransportCreate
        getDataInfo={getDataInfo}
        viewBlock={viewBlock}
        fillContainer={fillContainer}
        getShortInfo={getShortInfo}
        destinationsArray={destinationsArray}
        carrierArray={carrierArray}
      />
    )
  const dropBlockContentStyleCustom = {
    width: '100%',
    background: 'none',
    display: 'flex',
    borderRadius: 'none',
    margin: 'none',
    padding: 0,
  }

  const itemShippingStyleCustom = {
    padding: '16px',
    height: 'fit-content',
    margin: '0 20px',
  }

  return (
    <div className="dropBlockContent" style={dropBlockContentStyleCustom}>
      {viewCreateOrEdit(idShipping)}
      {fillContainer.notification && (
        <div className="itemShipping" style={itemShippingStyleCustom}>
          <p>{fillContainer.notification.text}</p>
        </div>
      )}
    </div>
  )
}

AuctionsTransportsTransort.propTypes = {
  viewBlock: PropTypes.func,
  getShortInfo: PropTypes.func,
}
export default memo(AuctionsTransportsTransort)
