import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { showLoder } from '../reducers/actions'

import ContextApp from '../context/contextApp'

import { getRequest } from '../base/api-request'
import ContainerInner from '../components/ContainerInner'
import ContainerInfoTop from '../components/ContainerInfoTop'

const ContainerInfoDetails = () => {
  const [containerArray, setContainerArray] = useState({})

  const { state, dispatch } = useContext(ContextApp)

  const currentUrl = window.location.pathname.split('/')[1] === 'uncontainers'
  const { id } = useParams()

  useEffect(() => {
    getArray()
  }, [])

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/containers/${currentUrl ? 'unconfirm' : 'confirm'}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterResult = res.containers.find((el) => +el.id === +id)

        if (filterResult.hasOwnProperty('id')) {
          setContainerArray(filterResult)
        }
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setContainerArray([])
        dispatch(showLoder({ getArray: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  return (
    <div className="itemContainer">
      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}></div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          <div className="blockShowOrHide">
            <div className="dropBlock--inner">
              <div
                className="contentBlockTop"
                style={{ flexDirection: 'column' }}
              >
                <div
                  className="dropBlockContent"
                  style={{ width: '70%', padding: '10px 20px' }}
                >
                  <h2 style={{ padding: 0 }}>Container info</h2>
                  <ContainerInfoTop
                    dataAray={containerArray}
                    idItem={id}
                    getArray={getArray}
                  />
                </div>

                <div
                  className="dropBlockContent"
                  style={{ width: '70%', padding: '10px 20px' }}
                >
                  <h2 style={{ padding: 0 }}>Orders</h2>
                  <p>Vehicles</p>

                  <ContainerInner
                    dataAray={containerArray.transport_auto_information}
                    idItem={id}
                    currentClick={currentUrl ? 'Неразобранные' : false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ContainerInfoDetails
