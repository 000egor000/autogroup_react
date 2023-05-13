import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  PagePrevious,
  Check,
  Close,
  Send,
  Attachment,
  CheckOutline,
} from '@rsuite/icons'
import { useNavigate } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import { Toggle } from 'rsuite'

import {
  postRequest,
  getRequest,
  postRequestFile,
} from '../../base/api-request'

import ContextApp from '../../context/contextApp'
import { showLoder } from '../../reducers/actions'

const DealersCreate = () => {
  const [dataAccessRights, setDataAccessRights] = useState([])
  const [currentValueToggle, setCurrentValueToggle] = useState(false)

  const [allId, setAllId] = useState([])
  const [allIdCheck, setAllIdCheck] = useState(false)
  const [fileGive, setFileGive] = useState('')

  const [accessRights, setAccessRights] = useState([])

  const [dataOffice, setDataOffice] = useState([])
  const [selectValueUser, setSelectValueUser] = useState('')

  const [selectValueCountry, setSelectValueCountry] = useState(1)
  const [selectValueCity, setSelectValueCity] = useState(1)
  const [selectValueTypeLevel, setSelectValueTypeLevel] = useState(1)
  const [dataCountryArray, setDataCountryArray] = useState([])
  const [dataCityArray, setDataCityArray] = useState([])
  const [viewBlockDocuments, setViewBlockDocuments] = useState(false)
  const [dataTypeLevelArray, setDataTypeLevelArray] = useState([])

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

  const [fileName, setFileName] = useState('')
  const [showIcon, setShowIcon] = useState(false)
  // const [fileGive, setFileGive] = useState('')

  const [showBlock, setShowBlock] = useState(false)
  const [viewControler, setViewControler] = useState([])

  const history = useNavigate()

  const { state, dispatch } = useContext(ContextApp)
  const refFocus = useRef()

  useEffect(() => {
    let AllId = []

    dispatch(showLoder({ access: 1 }))
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
        dispatch(showLoder({ access: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ access: 0 }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ role: 1 }))
    let count = []
    getRequest('/api/v1/user-role', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        let filter = res.userRole.filter((el) => el.id === 6)[0][
          'access_rights'
        ]
        Object.entries(filter).map((el) =>
          el[1].access_rights.map((elC) => count.push(elC.id))
        )
        setAccessRights(count)
        dispatch(showLoder({ role: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ role: 0 }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ service: 1 }))
    getRequest('/api/v1/offices?dealer_service=1 ', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        // const filterNotRetail = res.offices.filter((el) => +el.dealer_service === 1)
        setDataOffice(res.offices)

        setSelectValueUser(res.offices[0].id)
        dispatch(showLoder({ service: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ service: 0 }))
      })
  }, [])
  useEffect(() => {
    if (selectValueCountry) {
      dispatch(showLoder({ countriesId: 1 }))
      getRequest(`/api/v1/countries/${selectValueCountry}`, {
        Authorization: `Bearer ${window.sessionStorage.getItem(
          'access_token'
        )}`,
      })
        .then((res) => {
          setDataCityArray(res.cities)
          dispatch(showLoder({ countriesId: 0 }))
        })
        .catch(() => {
          dispatch(showLoder({ countriesId: 0 }))
        })
    }
  }, [selectValueCountry])

  useEffect(() => {
    dispatch(showLoder({ countries: 1 }))
    getRequest(`/api/v1/countries`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataCountryArray(res.countries)
        dispatch(showLoder({ countries: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ countries: 0 }))
      })
  }, [])
  useEffect(() => {
    dispatch(showLoder({ levels: 1 }))
    getRequest(`/api/v1/type-levels`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataTypeLevelArray(res.type_levels)
        dispatch(showLoder({ levels: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ levels: 0 }))
      })
  }, [])

  useEffect(() => {
    telegram === phone && telegram !== ''
      ? setTelegramCheckbox(true)
      : setTelegramCheckbox(false)
  }, [telegram, phone])

  // let params = {
  // 	second_name_ru: secondName,
  // 	name_ru: name,
  // 	birthday: dataBorn,
  // 	email: email,
  // 	// second_name_en: secondNameLat,
  // 	// name_en: nameLat,
  // 	phone: phone,
  // 	telegram: telegram,
  // 	password: password,
  // 	// city_id: selectValueCity,
  // 	type_level_id: selectValueTypeLevel,

  // 	office_id:
  // 		JSON.parse(window.sessionStorage.getItem('role')).code === 'office'
  // 			? JSON.parse(window.sessionStorage.getItem('client')).id
  // 			: selectValueUser,
  // 	password_confirmation: password_confirmation,
  // 	access_rights: accessRights,
  // }

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

  useEffect(() => {
    if (currentValueToggle) genPassword()
    else {
      setPassword('')
      setPassword_confirmation('')
    }
  }, [currentValueToggle])

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
  const masterCreateForm = (e) => {
    e.preventDefault()
    dispatch(showLoder({ dealers: 1 }))

    postRequestFile('/api/v1/dealers', formData)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Пользователь создан!', 'success')
          history(-1)
          dispatch(showLoder({ dealers: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ dealers: 0 }))
      })
  }

  const verificationEmail = (val) => {
    dispatch(showLoder({ verification: 1 }))

    postRequest('/api/v1/order/transport-auto/verification', { email: val })
      .then((res) => {
        refFocus.current.style.outline = 'none'
        refFocus.current.style.border = 'solid'
        refFocus.current.style.borderWidth = '1px'
        refFocus.current.style.borderColor = 'green'
        dispatch(showLoder({ verification: 0 }))
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
        dispatch(showLoder({ verification: 0 }))
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

  const controlCheck = (id) => (allIdCheck ? allIdCheck : isChecked(id))

  let formData = new FormData()
  // formData.append('general_information_id', id)
  formData.append('file', fileGive)
  formData.append('second_name_ru', secondName)
  formData.append('name_ru', name)
  formData.append('birthday', dataBorn)
  formData.append('email', email)
  formData.append('phone', phone)
  formData.append('telegram', telegram)
  formData.append('password', password)
  formData.append('type_level_id', selectValueTypeLevel)
  formData.append('city_id', selectValueCity)
  formData.append(
    'office_id',
    JSON.parse(window.sessionStorage.getItem('role')).code === 'office'
      ? JSON.parse(window.sessionStorage.getItem('client')).id
      : selectValueUser
  )
  formData.append('password_confirmation', password_confirmation)
  formData.append('access_rights', accessRights)

  let controlFile = (e) => {
    if (e.target.files[0]) {
      setShowIcon(true)
      setFileGive(e.target.files[0])
      setFileName(e.target.files[0].name)

      state.createNotification('Файл прикреплен!', 'success')
    }
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
                    <div
                      className="fistPies"
                      style={{ justifyContent: 'flex-start' }}
                    >
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
                        <span>Страна</span>
                        <select
                          value={selectValueCountry}
                          onChange={(event) =>
                            setSelectValueCountry(event.target.value)
                          }
                        >
                          {dataCountryArray.map((elem) => {
                            return (
                              <option key={elem.id} value={elem.id}>
                                {elem.name_ru}
                              </option>
                            )
                          })}
                        </select>
                      </label>
                      <label>
                        <span>Город</span>
                        <select
                          value={selectValueCity}
                          onChange={(event) =>
                            setSelectValueCity(event.target.value)
                          }
                        >
                          {dataCityArray.map((elem) => {
                            return (
                              <option key={elem.id} value={elem.id}>
                                {elem.name_ru}
                              </option>
                            )
                          })}
                        </select>
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
                          <span>Тип класса</span>
                          <select
                            value={selectValueTypeLevel}
                            onChange={(event) =>
                              setSelectValueTypeLevel(event.target.value)
                            }
                          >
                            {dataTypeLevelArray.map((elem) => {
                              return (
                                <option key={elem.id} value={elem.id}>
                                  {elem.title}
                                </option>
                              )
                            })}
                          </select>
                        </label>
                      </div>

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
                    <div className="itemGroupBtn">
                      <button className="btn--black" type="submit">
                        Сохранить дилера
                      </button>
                      <button
                        type="input"
                        className="btn--black"
                        style={{ backgroundColor: '#3d5bef' }}
                        onClick={(e) => {
                          e.preventDefault()
                          setViewBlockDocuments(!viewBlockDocuments)
                          setShowBlock(false)
                        }}
                      >
                        Документы
                      </button>
                      {!showBlock && viewBlock(62) && (
                        <React.Fragment>
                          <button
                            style={{ background: 'none' }}
                            onClick={() => {
                              setViewBlockDocuments(false)
                              rightsSettingFunction()
                            }}
                          >
                            Настройки прав доступа
                          </button>
                        </React.Fragment>
                      )}
                    </div>
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
                      disabled={currentValueToggle}
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
                      disabled={currentValueToggle}
                      required
                    />
                  </label>
                  {JSON.parse(window.sessionStorage.getItem('role')).code !==
                    'office' && (
                    <React.Fragment>
                      <label>
                        <span> Выберите владельца</span>
                        <input type="text" value="Офис" disabled />
                        <select
                          value={selectValueUser}
                          onChange={(event) =>
                            setSelectValueUser(event.target.value)
                          }
                        >
                          {dataOffice.map((elem) => {
                            return (
                              <option key={elem.id} value={elem.id}>
                                {elem.email}
                              </option>
                            )
                          })}
                        </select>
                      </label>
                    </React.Fragment>
                  )}
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
                                  checked={controlCheck(+elemChild['id'])}
                                  value={elemChild['id']}
                                  type="checkbox"
                                  onChange={(e) => {
                                    handleAccessRights(+e.target.value)
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
              <div
                className="block-documents"
                style={{ display: viewBlockDocuments ? 'block' : 'none' }}
              >
                {/* <div className='itemGroupBtn'>
									<button
										type='input'
										className='btn--black'
										style={{ backgroundColor: '#3d5bef' }}
										onClick={(e) => {
											e.preventDefault()
											setViewBlockDocuments(!viewBlockDocuments)
											setShowBlock(false)
										}}
									>
										Добавление фотографий
									</button>
								</div> */}

                <div className="addPicture">
                  <label>
                    {/* <input value={fileName && fileName} disabled placeholder='Название файла' /> */}
                    <p>{fileName ? fileName : 'Название файла'}</p>
                    <input
                      id="ava"
                      name="ava"
                      style={{ display: 'none' }}
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={controlFile}
                    />
                    <label
                      htmlFor="ava"
                      style={{ cursor: 'pointer' }}
                      className="fileAdd"
                    >
                      {showIcon ? (
                        <CheckOutline
                          style={{ width: '20px', height: '20px' }}
                        />
                      ) : (
                        <Attachment style={{ width: '20px', height: '20px' }} />
                      )}
                    </label>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default DealersCreate
