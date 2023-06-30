import React, { useState, useEffect, useContext, memo } from 'react'
import { Toggle } from 'rsuite'
import { putRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import { Check, Close } from '@rsuite/icons'

import ContextApp from '../context/contextApp'
import { useParams } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'

const ContainerInfoTop = ({ dataAray }) => {
  const { id } = useParams()

  const [currentValueToggleFist, setCurrentValueToggleFist] = useState(false)
  const { state, dispatch } = useContext(ContextApp)

  const downContainer = (val) => {
    dispatch(showLoder({ downContainer: 1 }))
    const params = {
      port_id: dataAray.port.id,
      number: dataAray.number,
      consolidation: val === true ? 1 : 0,
      sea_line_id: dataAray.sea_line.id,
    }

    putRequest(`/api/v1/containers/${id}`, params)
      .then((res) => {
        state.createNotification('Контейнер консолидацирован!', 'success')

        dispatch(showLoder({ downContainer: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')

        dispatch(showLoder({ downContainer: 0, status: err.status }))
      })
  }

  useEffect(() => {
    if (dataAray) {
      return setCurrentValueToggleFist(
        +dataAray.consolidation === 1 ? true : false
      )
    }
  }, [dataAray])

  const generationLi = ({ sea_line, port, number, l_date }) => {
    const keyItem = [
      { 'Reference No:': '-' },
      { 'Loading status:': '-' },
      { 'Shipping line:': sea_line ? sea_line.title : '-' },
      { 'Port Of Load:': port ? port.name : '-' },
      { 'Port Of Delivery:': '-' },
      { 'Booking No:': '-' },
      { 'Container No:': number ? number : '-' },
      { 'Sail date:': l_date ? l_date : '-' },
      { 'ETA:': '-' },
      { 'Consigned To:': '-' },
    ]

    return keyItem.map((el) =>
      Object.entries(el).map((Chaild) => (
        <li key={Chaild[0]}>
          <p>{Chaild[0]}</p>
          <span>{Chaild[1]}</span>
        </li>
      ))
    )
  }

  return dataAray ? (
    <ul className="customList">
      {generationLi(dataAray)}

      <li
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <p>Полный контейнер:</p>

        <Toggle
          style={{ width: '120px', marginLeft: '20px' }}
          checked={currentValueToggleFist}
          checkedChildren={<Check />}
          unCheckedChildren={<Close />}
          onChange={(val) => {
            setCurrentValueToggleFist(val)
            downContainer(val)
          }}
        />

        <p>Консолидирован</p>
      </li>
    </ul>
  ) : (
    'Нет данных'
  )
}

ContainerInfoTop.propTypes = {
  dataAray: PropTypes.object,
}

export default memo(ContainerInfoTop)
