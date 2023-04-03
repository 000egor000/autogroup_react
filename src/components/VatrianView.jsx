import React, { useState, useContext, useEffect } from 'react'
// import PropTypes from 'prop-types'
import ContextApp from '../context/contextApp.js'
import { useParams } from 'react-router-dom'
import { showLoder } from '../reducers/actions'
import { ratesData, arrayPort } from '../const'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../base/api-request'
import { Trend, Admin, AdvancedAnalytics } from '@rsuite/icons'
import CarterProfile from '../views/Сarter'

import RatesControl from '../views/RatesControl'
import Wallets from '../views/Wallets'

import { SelectPicker, Tooltip, Whisper, Nav } from 'rsuite'

const VatrianView = ({}) => {
  const { state, dispatch } = useContext(ContextApp)
  const [dataArray, setDataArray] = useState([])
  const [dataSelect, setDataSelect] = useState('')

  const [activeRates, setActiveRates] = React.useState('')
  const [activeIcons, setActiveIcons] = React.useState('')
  const [conrolActiveRates, setConrolActiveRates] = React.useState(false)

  const dataStaticIcon = [
    { id: 1, title: 'Rates', icon: <AdvancedAnalytics /> },
    { id: 2, title: 'Профиль', icon: <Admin /> },
    {
      id: 3,
      title: 'Баланс с переходом в транзакции',
      icon: <Trend />,
    },
  ]

  const { name } = useParams()
  let navigate = useNavigate()

  const resetNewPage = () => {
    setActiveRates('')
    setActiveIcons('')
    setConrolActiveRates(false)
    setDataArray([])
    setDataSelect('')
  }
  useEffect(() => {
    resetNewPage()
    getArray(name)
  }, [name])

  const getArray = (name) => {
    switch (name) {
      case 'placeOfOrigin':
        return getCarriers()
      case 'portOfDestination':
        return getPorts()
      case 'finalDestination':
        return getCarter()
      default:
        break
    }
  }
  // transactions

  const getCarriers = () => {
    dispatch(showLoder({ carriers: 1 }))
    getRequest('/api/v1/carriers', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataArray(
          res.carriers.map(({ id, title }) => ({
            label: title,
            value: id,
            linkName: 'rates-fees/inland-rates?carrier_id',
            dataResName: 'inlandRates',
            nameCash: 'carriers',
          }))
        )
        dispatch(showLoder({ carriers: 0 }))
      })
      .catch((err) => {
        // toast.error('Что-то пошло не так!')
        setDataArray([])
        dispatch(showLoder({ carriers: 0 }))
      })
  }

  const getPorts = () => setDataArray(arrayPort)

  const getCarter = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/carters`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataArray(
          res.carters.map(({ id, name }) => ({
            label: name,
            value: id,
            linkName: 'rates-fees/inland-rates-carter?carter_id',
            dataResName: 'inlandRatesCarters',
            nameCash: 'carter',
          }))
        )

        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getArray: 0 }))
        setDataArray([])
      })
  }

  const Navbar = ({ active, onSelect, dataArray, ...props }) => {
    return (
      <Nav {...props} activeKey={active} onSelect={onSelect}>
        {dataArray.map((el) => (
          <Nav.Item eventKey={el.code} key={el.id}>
            {el.title}
          </Nav.Item>
        ))}
      </Nav>
    )
  }

  useEffect(() => {
    if (dataSelect && activeRates) {
      setConrolActiveRates(true)
    } else {
      setConrolActiveRates(false)

      // setDataArray([])
    }
  }, [dataSelect, activeRates])

  useEffect(() => {
    if (activeIcons !== 1) setActiveRates('')
  }, [activeIcons])

  const changeActive = (val) => () =>
    setActiveIcons((previosState) =>
      previosState && previosState == val ? '' : val
    )

  const IconGropNav = ({ data }) => {
    return (
      <div className="iconGroup">
        {data.map((el) => (
          <div
            className={
              activeIcons !== el.id ? 'iconSetting' : 'iconSetting--active'
            }
            onClick={changeActive(el.id)}
            key={el.id}
          >
            <Whisper
              followCursor
              placement="right"
              speaker={<Tooltip>{el.title}</Tooltip>}
            >
              {el.icon}
            </Whisper>
          </div>
        ))}
      </div>
    )
  }
  const styleInfoClick = {
    paddingRight: state.width,
    visibility: activeIcons === 1 ? 'visible' : 'hidden',
  }
  const styleTopItem = {
    paddingLeft: state.width,
  }
  const valueProfile = () => {
    const res = dataArray.find((item) => item.value === dataSelect)

    return res ? res.label : ''
  }

  const blockView = (active) => {
    const findCurrent = dataArray.find((item) => item.value == dataSelect)

    switch (active) {
      case 1:
        return (
          conrolActiveRates && (
            <RatesControl
              nameRates={activeRates}
              currentRates={dataSelect}
              dataArray={dataArray}
            />
          )
        )
      case 2:
        return dataSelect && name == 'finalDestination' ? (
          <CarterProfile currentRates={dataSelect} />
        ) : (
          <p style={{ textAlign: 'center' }}>Профиль {valueProfile()}</p>
        )

      case 3:
        return (
          dataSelect && (
            <Wallets
              nameProps={findCurrent.nameCash}
              carterId={findCurrent ? findCurrent.value : null}
              // nameRates={activeRates}
              // currentRates={dataSelect}
              dataArray={dataArray}
            />
          )
        )
      default:
        break
    }
  }

  return (
    <div className="vatrianView">
      <div className="itemContainer">
        <div className="itemContainer-inner">
          <div className="top-item" style={styleTopItem}>
            <div className="itemSearch">
              <div className="customGroupSelect">
                <SelectPicker
                  data={dataArray}
                  value={dataSelect}
                  onChange={setDataSelect}
                  loading={!dataArray.length}
                />
                <IconGropNav data={dataStaticIcon} />
              </div>

              <div className="infoClick" style={styleInfoClick}>
                {ratesData.length > 0 ? (
                  <Navbar
                    appearance="tabs"
                    active={activeRates}
                    onSelect={setActiveRates}
                    dataArray={
                      name == 'finalDestination'
                        ? ratesData.filter((item) => item.id == 1)
                        : ratesData
                    }
                    style={{ marginBottom: 0 }}
                  />
                ) : (
                  <span>Нет данных!</span>
                )}
              </div>
            </div>
          </div>
          <div
            className="bottom-itemFooter"
            style={{
              color: 'black',
              padding: `25px 0`,
              // paddingLeft: state.width,
            }}
          >
            {blockView(activeIcons)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ShortInfoData.propTypes = {
//   shortInfoArray: PropTypes.object,
// }
export default VatrianView
