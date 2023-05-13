import React, { useState, useEffect, useContext, memo } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../base/api-request'
// import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'

import AuctionTransportAutoCreate from '../components/AuctionTransportAutoCreate'
import AuctionTransportAutoEdit from '../components/AuctionTransportAutoEdit'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp'
import PropTypes from 'prop-types'

const AuctionsTransportsAuto = ({
  viewBlock,
  chooseItem,
  carrierArray,
  constolViewAgFree,
  destinationsArray,
  credentialsArray,
  // auctionArray,
}) => {
  const { id } = useParams()
  const [fillDataProps, setFillDataProps] = useState([])
  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    id && getDataInfo()
    return () => setFillDataProps([])
  }, [id])

  const getDataInfo = () => {
    dispatch(showLoder({ getDataInfo: 1 }))
    getRequest(`/api/v1/order/transport-auto/${id}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFillDataProps(res)
        dispatch(showLoder({ getDataInfo: 0 }))
      })

      .catch((err) => {
        dispatch(showLoder({ getDataInfo: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const viewCreateOrEdit = (id) =>
    id ? (
      <AuctionTransportAutoEdit
        propsData={fillDataProps}
        propsId={id}
        viewBlock={viewBlock}
        chooseItem={chooseItem}
        constolViewAgFree={constolViewAgFree}
        carrierArray={carrierArray}
        destinationsArray={destinationsArray}
        credentialsArray={credentialsArray}
        // auctionArray={auctionArray}
      />
    ) : (
      <AuctionTransportAutoCreate
        viewBlock={viewBlock}
        carrierArray={carrierArray}
        destinationsArray={destinationsArray}
        credentialsArray={credentialsArray}
        // auctionArray={auctionArray}
      />
    )

  return viewCreateOrEdit(id)
}
AuctionsTransportsAuto.propTypes = {
  viewBlock: PropTypes.func,
}

export default memo(AuctionsTransportsAuto)
