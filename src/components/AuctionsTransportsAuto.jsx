import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../base/api-request'
// import 'rsuite-table/dist/css/rsuite-table.css'
import { ToastContainer, toast } from 'react-toastify'
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
        toast.error('Что-то пошло не так!')
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

  return (
    <React.Fragment>
      <ToastContainer />
      {viewCreateOrEdit(id)}
    </React.Fragment>
  )
}
AuctionsTransportsAuto.propTypes = {
  viewBlock: PropTypes.func,
}

export default AuctionsTransportsAuto
