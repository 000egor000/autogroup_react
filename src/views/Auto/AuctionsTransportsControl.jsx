import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// import { currentLink } from '../../reducers/actions'

import ContextApp from '../../context/contextApp'
import AuctionsTransportsTransort from '../../components/AuctionsTransportsTransort'
import AuctionTransportDocuments from '../../components/AuctionTransportDocuments'
import AuctionTransportDrops from '../../components/AuctionTransportDrops'
import AuctionTransportPay from '../../components/AuctionTransportPay'
import AuctionTransportFinanceCreate from '../../components/AuctionTransportFinanceCreate'
import ShortInfoData from '../../components/ShortInfoData'
import AuctionsTransportsAuto from '../../components/AuctionsTransportsAuto'
import AuctionTransportsPictures from '../../components/AuctionTransportsPictures'
import AuctionTransportAuction from '../../components/AuctionTransportAuction'

import { getRequest } from '../../base/api-request'

import { btnShowAuto } from '../../const'

import { showLoder } from '../../reducers/actions'

const AuctionsTransportsControl = () => {
  const { id } = useParams()
  const [currentValue, setCurrentValue] = useState('')
  const [viewControler, setViewControler] = useState([])

  const [shortInfoArray, setShortInfoArray] = useState({})
  const [carrierArray, setCarrierArray] = useState([])
  const [destinationsArray, setDestinationsArray] = useState([])
  const [auctionArray, setAuctionArray] = useState([])
  const { state, dispatch } = useContext(ContextApp)
  const userCurrentRole = JSON.parse(window.sessionStorage.getItem('role')).code
  const [credentialsArray, setCredentialsArray] = useState({})

  const [btnShow, setBtnShow] = useState(
    btnShowAuto.filter((el) =>
      userCurrentRole !== 'admin' ? el.id !== 'Аукцион' : el
    )
  )

  useEffect(() => {
    if (currentValue) {
      chooseItem(currentValue)
    }
  }, [currentValue])

  useEffect(() => {
    let result = btnShow.filter((elem) => elem.status)
    const currentSessionValue = sessionStorage.getItem('curLink')
    if (currentSessionValue) {
      setCurrentValue(currentSessionValue)
    } else {
      setCurrentValue(result[0].id)
    }

    // return () => {}
  }, [])

  useEffect(() => {
    dispatch(showLoder({ destinations: 1 }))
    getRequest(`/api/v1/destinations?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDestinationsArray(res.destinations)
        dispatch(showLoder({ destinations: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ destinations: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ credentials: 1 }))
    getRequest(`/api/v1/credentials?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCredentialsArray(res.credentials)
        dispatch(showLoder({ credentials: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ credentials: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAuctionArray(res.auction)

        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ auctions: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])

  const chooseItem = (id) => {
    switch (id) {
      case 'Транспорт':
        if (!viewBlock(46)) return null

        break

      case 'Финансы':
        if (!viewBlock(50)) {
          if (!viewBlock(49)) return null
        }
        break

      case 'Документы':
        if (!viewBlock(53)) return null

        break

      case 'Платежи':
        if (!viewBlock(56)) return null

        break

      default:
        // console.log('incorrect link')
        break
    }

    let newArr = btnShow.map((item) => {
      return item.id === id
        ? { ...item, status: true }
        : { ...item, status: false }
    })

    setBtnShow(newArr)
    sessionStorage.setItem('curLink', id)
    setCurrentValue(id)
  }

  const viewComponents = (idBlock) => {
    switch (idBlock) {
      case 'Авто':
        return (
          <AuctionsTransportsAuto
            viewBlock={viewBlock}
            // constolViewAgFree={constolViewAgFree}
            chooseItem={chooseItem}
            carrierArray={carrierArray}
            destinationsArray={destinationsArray}
            credentialsArray={credentialsArray}
            // auctionArray={auctionArray}
          />
        )
      case 'Транспорт':
        return (
          <AuctionsTransportsTransort
            viewBlock={viewBlock}
            getShortInfo={getShortInfo}
            destinationsArray={destinationsArray}
            carrierArray={carrierArray}
          />
        )
      case 'Финансы':
        return (
          <AuctionTransportFinanceCreate
            viewBlock={viewBlock}
            shortInfoArray={shortInfoArray}
            carrierArray={carrierArray}
            // priceСarrier={priceСarrier}
            // viewAgFree={viewAgFree}
          />
        )
      case 'Документы':
        return (
          <AuctionTransportDocuments
            viewBlock={viewBlock}
            carrierArray={carrierArray}
            credentialsArray={credentialsArray}
            auctionArray={auctionArray}
            // priseAllСarrier={priseAllСarrier}
          />
        )
      case 'Drops':
        return <AuctionTransportDrops viewBlock={viewBlock} />
      case 'Фото':
        return <AuctionTransportsPictures viewBlock={viewBlock} />

      case 'Платежи':
        return (
          <AuctionTransportPay
            viewBlock={viewBlock}
            carrierArray={carrierArray}
            credentialsArray={credentialsArray}
            auctionArray={auctionArray}
          />
        )

      case 'Аукцион':
        return <AuctionTransportAuction />

      default:
        return console.log('incorrect value')
    }
  }

  useEffect(() => {
    dispatch(showLoder({ carriers: 1 }))
    getRequest(`/api/v1/carriers`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCarrierArray(res.carriers)
        // setCarrierSelect(res.carriers[0].id)
        dispatch(showLoder({ carriers: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ carriers: 0 }))
      })
  }, [])

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )

  let controlRoleView = () => {
    if (
      Object.keys(
        JSON.parse(window.sessionStorage.getItem('access_rights'))
      ).includes('auto')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).auto.access_rights

      setViewControler(initialValue)
    }
  }

  let viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  // useEffect(() => {
  // 	getRequest(`/api/v1/order/finance/${id}/info`, {
  // 		Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  // 	})
  // 		.then((res) => {
  // 			setFinanceDateArray(res.finance_information)
  // 		})
  // 		.catch((err) => {
  // 			setFinanceDateArray([])
  // 		})
  // }, [])

  let getShortInfo = () => {
    dispatch(showLoder({ getShortInfo: 1 }))
    getRequest(`/api/v1/order/transport-auto/${id}/short-info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setShortInfoArray(res)
        dispatch(showLoder({ getShortInfo: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getShortInfo: 0 }))
      })
  }
  useEffect(() => {
    id && getShortInfo()
  }, [id])

  return (
    <div className="itemContainer">
      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}>
          <div className="btnTransport"></div>
          <div className="groupInput">
            <div className="switcher-btn">
              {btnShow.map((item, i) => {
                return (
                  <span
                    style={{ color: id ? '#fff' : '#9c9999' }}
                    onClick={() => id && chooseItem(item.id)}
                    className={item.status ? 'active' : item.id}
                    key={item.id}
                  >
                    {item.id}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          <div className="blockShowOrHide">
            <div className="dropBlock--inner">
              {id && (
                <ShortInfoData propsId={id} shortInfoArray={shortInfoArray} />
              )}

              {viewComponents(currentValue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuctionsTransportsControl
