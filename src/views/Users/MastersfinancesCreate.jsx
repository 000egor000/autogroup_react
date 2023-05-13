import React, { useState, useContext, useEffect, useRef } from 'react'
import { PagePrevious, Check, Close, Send } from '@rsuite/icons'
import { useNavigate } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import { Toggle } from 'rsuite'

import { postRequest, getRequest } from '../../base/api-request'
// import LogoUser from '../../assets/iaa-footer.svg'
import ContextApp from '../../context/contextApp'
import { showLoder } from '../../reducers/actions'

const MastersfinancesCreate = (props) => {
  const [dataAccessRights, setDataAccessRights] = useState([])
  const [currentValueToggle, setCurrentValueToggle] = useState(false)

  const [allId, setAllId] = useState([])
  const [allIdCheck, setAllIdCheck] = useState(false)

  const [accessRights, setAccessRights] = useState([])

  // const [indicatorDis, setIndicatorDis] = useState(false)
  const [telegramCheckbox, setTelegramCheckbox] = useState(false)

  const [secondName, setSecondName] = useState('')
  const [name, setName] = useState('')
  const [dataBorn, setDataBorn] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  // const [secondNameLat, setSecondNameLat] = useState('')
  // const [nameLat, setNameLat] = useState('')
  const [telegram, setTelegram] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPassword_confirmation] = useState('')
  const [showBlock, setShowBlock] = useState(false)
  const [viewControler, setViewControler] = useState([])
  const refFocus = useRef()

  const history = useNavigate()

  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    if (currentValueToggle) genPassword()
    else {
      setPassword('')
      setPassword_confirmation('')
    }
  }, [currentValueToggle])

  useEffect(() => {
    dispatch(showLoder({ role: 1 }))
    let count = []
    getRequest('/api/v1/user-role', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        let filter = res.userRole.filter((el) => el.id === 3)[0][
          'access_rights'
        ]
        Object.entries(filter).map((el) =>
          el[1].access_rights.map((elC) => count.push(elC.id))
        )
        setAccessRights(count)
        dispatch(showLoder({ role: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ role: 0 }))
      })
  }, [])

  useEffect(() => {
    let AllId = []
    dispatch(showLoder({ rights: 1 }))
    getRequest('/api/v1/access-rights', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        Object.entries(res.access_rights).map((elem) => {
          elem[1]['access_rights'].map((elemChaild) => {
            AllId.push(elemChaild['id'])
          })
        })
        setDataAccessRights(Object.entries(res.access_rights))
        setAllId(AllId)
        dispatch(showLoder({ rights: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ rights: 0 }))
      })
  }, [])

  useEffect(() => {
    telegram === phone && telegram !== ''
      ? setTelegramCheckbox(true)
      : setTelegramCheckbox(false)
  }, [telegram, phone])

  let params = {
    second_name_ru: secondName,

    name_ru: name,

    birthday: dataBorn,
    email: email,

    // second_name_en: secondNameLat,
    // name_en: nameLat,

    phone: phone,

    telegram: telegram,

    password: password,

    password_confirmation: password_confirmation,
    access_rights: accessRights,
  }

  // let FistStyle = {
  // 	left: '2px',
  // 	backgroundColor: '#e9ecef',
  // }
  // let SecondStyle = {
  // 	left: '28px',
  // 	backgroundColor: '#a5cd50',
  // }
  // let [styleControl, setStyleControl] = useState(FistStyle)

  // const transitionControll = () => {
  // 	setIndicatorDis(!indicatorDis)
  // 	if (styleControl.left === '2px') {
  // 		setStyleControl(SecondStyle)
  // 		genPassword()
  // 	} else {
  // 		setStyleControl(FistStyle)
  // 		setPassword('')
  // 		setPassword_confirmation('')
  // 	}
  // }

  function genPassword() {
    var chars =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var passwordLength = 12
    var password = ''
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length)
      password += chars.substring(randomNumber, randomNumber + 1)
    }
    setPassword(password)
    setPassword_confirmation(password)
  }

  const controlTelegram = () => {
    if (!telegramCheckbox) {
      setTelegramCheckbox(!telegramCheckbox)
      setTelegram(phone)
    } else {
      setTelegramCheckbox(!telegramCheckbox)
      setTelegram('')
    }
  }

  const verificationEmail = (val) => {
    dispatch(showLoder({ verificationEmail: 1 }))

    postRequest('/api/v1/user/verification', { email: val })
      .then((res) => {
        refFocus.current.style.outline = 'none'
        refFocus.current.style.border = 'solid'
        refFocus.current.style.borderWidth = '1px'
        refFocus.current.style.borderColor = 'green'
        dispatch(showLoder({ verificationEmail: 0 }))
      })
      .catch((err) => {
        state.createNotification(
          'Пользователь с таким email уже создан!',
          'error'
        )
        refFocus.current.style.outline = 'none'
        refFocus.current.style.border = 'solid'
        refFocus.current.style.borderWidth = '1px'
        refFocus.current.style.borderColor = 'red'
        dispatch(showLoder({ verificationEmail: 0 }))
      })
  }

  const masterCreateForm = (e) => {
    e.preventDefault()
    dispatch(showLoder({ masterCreateForm: 1 }))

    postRequest('/api/v1/finances', params)
      .then((res) => {
        state.createNotification('Пользователь создан!', 'success')
        history(-1)
        dispatch(showLoder({ masterCreateForm: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ masterCreateForm: 0 }))
      })
  }
  const rightsSettingFunction = () => {
    setShowBlock(!showBlock)
  }

  const handleAccessRights = (id) => {
    let filtered = accessRights.filter((e) => id === e)

    if (filtered.length > 0) {
      let removeAccessRights = accessRights.filter((e) => e !== id)
      setAccessRights(removeAccessRights)
    } else {
      setAccessRights([...accessRights, id])
    }
  }

  const isChecked = (id) => {
    let filtered = accessRights.filter((e) => e === id)
    let bool = filtered.length > 0 ? true : false
    return bool
  }

  const allCheckOn = () => {
    setAccessRights(allId)
    setAllIdCheck(true)
  }
  const allCheckOff = () => {
    setAccessRights([])
    setAllIdCheck(false)
  }

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
      ).includes('assign_permissions')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).assign_permissions.access_rights

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

  return (
    <div className="itemContainer">
      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}>
          <div className="btnTransport" style={{ justifyContent: 'left' }}>
            <div className="btnTransportLeft">
              <PagePrevious onClick={() => history(-1)} />
            </div>
          </div>
        </div>

        <div className="bottom-itemFooter" style={{ paddingLeft: state.width }}>
          <form onSubmit={masterCreateForm}>
            <div className="masterCreate--inner">
              <div className="topItem">
                <div className="leftItemElement">
                  <h2>Информация</h2>
                  <div className="helpItem">
                    <div className="fistPies">
                      <label>
                        <span>Фамилия</span>
                        <input
                          type="text"
                          placeholder="Фамилия"
                          value={secondName}
                          onChange={(e) => setSecondName(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        <span>Имя</span>
                        <input
                          type="text"
                          placeholder="Имя"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        <span>Дата рождения</span>
                        <input
                          type="date"
                          placeholder="Дата рождения"
                          value={dataBorn}
                          onChange={(e) => setDataBorn(e.target.value)}
                          required
                          max="2999-12-31"
                        />
                      </label>
                    </div>
                    <div className="secondPies">
                      <div>
                        {/* <label>
													<span>Фамилия (Латиница)</span>
													<input
														type='text'
														placeholder='Фамилия (Латиница)'
														value={secondNameLat}
														onChange={(e) => {
															let value = e.target.value
															// value = value.replace(/[^A-Za-z]/gi, '')
															return setSecondNameLat(value)
														}}
														required
													/>
												</label>
												<label>
													<span>Имя (Латиница)</span>
													<input
														type='text'
														placeholder='Имя (Латиница)'
														value={nameLat}
														onChange={(e) => {
															let value = e.target.value
															// value = value.replace(/[^A-Za-z]/gi, '')

															return setNameLat(value)
														}}
														required
													/>
												</label> */}
                      </div>

                      <label>
                        <span>Email</span>
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={(e) => verificationEmail(e.target.value)}
                          ref={refFocus}
                          required
                        />
                      </label>
                      <label>
                        <span>Телефон</span>
                        <input
                          type="text"
                          placeholder="Телефон"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </label>

                      <label>
                        <div className="helpTelegramBlock">
                          <Send />
                          <span>Telegram</span>
                          <input
                            type="checkbox"
                            checked={telegramCheckbox}
                            onChange={() =>
                              setTelegramCheckbox(!telegramCheckbox)
                            }
                            onClick={() => controlTelegram()}
                          />
                          <span>тот же</span>
                        </div>

                        <input
                          type="text"
                          placeholder="Telegram"
                          value={telegram}
                          disabled={telegramCheckbox}
                          onChange={(e) => setTelegram(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="settingGroup">
                    <button className="btn--black" type="submit">
                      Сохранить мастера финансов
                    </button>

                    {!showBlock && viewBlock(62) && (
                      <React.Fragment>
                        <span onClick={() => rightsSettingFunction()}>
                          Настройки прав доступа
                        </span>
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div className="rightItemElement">
                  <h2>Доступы</h2>
                  <div className="rangeItem">
                    {/* <div className='custom-toggle-slider' onClick={(e) => transitionControll()}>
											<div
												className='circle-toggle'
												// onClick={(e) => e.stopPropagation()}
												style={styleControl}
											></div>
										</div> */}
                    <Toggle
                      checkedChildren={<Check />}
                      unCheckedChildren={<Close />}
                      onChange={(value) => {
                        setCurrentValueToggle(value)
                      }}
                    />
                    <span>Автоматическая генерация доступов</span>
                  </div>
                  <label>
                    <span>Логин</span>
                    <input
                      type="text"
                      placeholder="Логин"
                      readOnly
                      value={email}
                      disabled
                    />
                  </label>
                  <label>
                    <span>Пароль для системы</span>
                    <input
                      type="text"
                      placeholder="Пароль для системы"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      // disabled={indicatorDis}
                      required
                    />
                  </label>
                  <label>
                    <span>Подтвердите пароль</span>
                    <input
                      type="text"
                      placeholder="Подтвердите пароль"
                      value={password_confirmation}
                      onChange={(e) => setPassword_confirmation(e.target.value)}
                      // disabled={indicatorDis}
                      required
                    />
                  </label>
                </div>
              </div>
              <div
                className="rights-setting"
                style={{ display: showBlock ? 'block' : 'none' }}
              >
                <div className="rights-setting-data">
                  {dataAccessRights.length > 0 &&
                    dataAccessRights.map((elemItem) => {
                      return (
                        <div
                          className="ItemMain"
                          key={elemItem[1]['group_title']}
                        >
                          <span>{elemItem[1]['group_title']}</span>

                          {elemItem[1]['access_rights'].map((elemChild) => (
                            <div className="itemSetting" key={elemChild['id']}>
                              <label>
                                <input
                                  checked={
                                    allIdCheck
                                      ? allIdCheck
                                      : isChecked(elemChild['id'])
                                  }
                                  value={elemChild['id']}
                                  type="checkbox"
                                  onChange={(e) => {
                                    handleAccessRights(e.target.value)
                                  }}
                                  disabled={!viewBlock(60)}
                                />
                                <span>{elemChild['title']}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                </div>
                <div className="groupBtnSetting">
                  <span className="btn-primary" onClick={() => allCheckOn()}>
                    Выделить все
                  </span>
                  <span className="btn-danger" onClick={() => allCheckOff()}>
                    Убрать все
                  </span>
                  {/* <span className='btn-success' onClick={() => allCheckFinish()}>
										Назначить права
									</span> */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default MastersfinancesCreate
