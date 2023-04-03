import React, { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import { Modal, Toggle } from 'rsuite'
import {
  PagePrevious,
  Check,
  Close,
  Send,
  Trash,
  Attachment,
  CheckOutline,
} from '@rsuite/icons'

import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
  postRequestFile,
} from '../../base/api-request'
// import LogoUser from '../../assets/iaa-footer.svg'
import ContextApp from '../../context/contextApp'
import { showLoder } from '../../reducers/actions'
import ModalByPhotos from '../../components/ModalByPhotos'
import { config } from '../../config'

const DealersEdit = () => {
  const [dataAccessRights, setDataAccessRights] = useState([])
  const [currentValueToggle, setCurrentValueToggle] = useState(false)

  const [assingAccessToggle, setAssingAccessToggle] = useState(false)

  const [allId, setAllId] = useState([])
  const [allIdCheck, setAllIdCheck] = useState(false)
  const [dataContainer, setDataContainer] = useState([])
  const [container, setContainer] = useState([])
  const [isModalRemove, setIsModalRemove] = useState(false)

  const [accessRights, setAccessRights] = useState([])
  let paramsAccess

  const [showIcon, setShowIcon] = useState(false)
  const [fileName, setFileName] = useState('')
  const [viewBlockDocuments, setViewBlockDocuments] = useState(false)
  const [fileGive, setFileGive] = useState('')

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

  const [dataCountryArray, setDataCountryArray] = useState([])
  const [dataCityArray, setDataCityArray] = useState([])

  const [selectValueCountry, setSelectValueCountry] = useState('')
  const [selectValueCity, setSelectValueCity] = useState('')
  const [idPassword, setIdPassword] = useState('')
  const [showBlock, setShowBlock] = useState(false)
  const [officeId, setOfficeId] = useState('')
  const [selectValueTypeLevel, setSelectValueTypeLevel] = useState(1)
  const [dataTypeLevelArray, setDataTypeLevelArray] = useState([])
  const [viewControler, setViewControler] = useState([])
  const refFocus = useRef()
  let { title } = JSON.parse(window.sessionStorage.getItem('role'))

  const history = useNavigate()
  const { id } = useParams()
  const { state, dispatch } = useContext(ContextApp)
  const styleReset = {
    color: 'inherit',
    display: 'inherit',
    position: 'inherit',
    background: '#inherit',
    padding: '0',
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0',
    margin: '0',
  }

  let controlFile = (e) => {
    if (e.target.files[0]) {
      setShowIcon(true)
      setFileGive(e.target.files[0])
      setFileName(e.target.files[0].name)
      toast.success('Файл прикреплен!')
    }
  }

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

  const getDealer = () => {
    let count = []
    dispatch(showLoder({ dealers: 1 }))
    getRequest(`/api/v1/dealers/${id}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        for (const key in res.access_rights) {
          res.access_rights[key]['access_rights'].map((elem) =>
            count.push(elem.id)
          )
        }

        setAccessRights(count)
        setDataValueArrays(res)
        setOfficeId(res.office.id)
        setIdPassword(res.user_id)
        setDataContainer(res.files)
        dispatch(showLoder({ dealers: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ dealers: 0 }))
      })
  }

  useEffect(() => {
    getDealer()
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
    telegram === phone && telegram !== ''
      ? setTelegramCheckbox(true)
      : setTelegramCheckbox(false)
  }, [telegram, phone])

  const setDataValueArrays = (res) => {
    setSecondName(res.second_name_ru ? res.second_name_ru : '')
    setName(res.name_ru ? res.name_ru : '')
    setDataBorn(res.birthday ? res.birthday : '')
    setEmail(res.email ? res.email : '')
    // setSecondNameLat(res.second_name_en ? res.second_name_en : '')
    // setNameLat(res.name_en ? res.name_en : '')
    setPhone(res.phone ? res.phone : '')
    setTelegram(res.telegram ? res.telegram : '')

    setSelectValueCountry(res.city.country.id ? res.city.country.id : '')
    // setDataDealers(res.dealers)
    setSelectValueCity(res.city.id ? res.city.id : '')
    setSelectValueTypeLevel(res.type_level.id ? res.type_level.id : '')
  }
  let paramsUpdatePassword = {
    client_id: id,
    // old_password: 1,
    id: idPassword,
    new_password: password,
    password_confirmation: password_confirmation,
  }

  let params = {
    second_name_ru: secondName,
    name_ru: name,
    birthday: dataBorn,
    email: email,
    // second_name_en: secondNameLat,
    // name_en: nameLat,
    phone: phone,
    city_id: selectValueCity,
    telegram: telegram,
    password: password,
    password_confirmation: password_confirmation,
    access_rights: accessRights,
    office_id: officeId,
    type_level_id: selectValueTypeLevel,
  }

  useEffect(() => {
    if (currentValueToggle) genPassword()
    else {
      setPassword('')
      setPassword_confirmation('')
    }
  }, [currentValueToggle])

  const close = () => {
    setIsModalRemove(false)
  }

  const removePicture = (idItem) => {
    dispatch(showLoder({ dealersFile: 1 }))
    deleteRequest(`	/api/v1/dealers/file/${idItem}`)
      .then((res) => {
        close()
        getDealer()
        toast.success('Успешно удалено!')
        dispatch(showLoder({ dealersFile: 0 }))
      })
      .catch(() => {
        close()
        toast.error('Что-то пошло не так')
        dispatch(showLoder({ dealersFile: 0 }))
      })
  }

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

    dispatch(showLoder({ masterCreateForm: 1 }))

    putRequest(`/api/v1/dealers/${id}`, params)
      .then((res) => {
        if (res.status === 'success') {
          toast.success('Пользователь обновлен!')
          history(-1)
          dispatch(showLoder({ masterCreateForm: 0 }))
        }
      })
      .catch((err) => {
        toast.error('Проверьте веденные данные!')
        dispatch(showLoder({ masterCreateForm: 0 }))
      })
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
        toast.error('Пользователь с таким email уже создан!')
        refFocus.current.style.outline = 'none'
        refFocus.current.style.border = 'solid'
        refFocus.current.style.borderWidth = '1px'
        refFocus.current.style.borderColor = 'red'
        dispatch(showLoder({ verificationEmail: 0 }))
      })
  }

  const rightsSettingFunction = () => {
    setShowBlock(!showBlock)
  }

  const handleAccessRights = (id) => {
    let filtered = accessRights.filter((e) => id == e)

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

  const controlCheck = (id) => {
    return allIdCheck ? allIdCheck : isChecked(id)
  }
  // const newPassowrd = () => {
  //   dispatch(show())
  //   postRequest('/api/v1/user/password/update', paramsUpdatePassword)
  //     .then((res) => {
  //       if (res.status === 'success') {
  //         toast.success('Пароль успешно обновлен!')

  //         dispatch(hide())
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error('Что-то пошло не так!')
  //       dispatch(hide())
  //     })
  // }
  const newPassowrd = () => {
    if (password === password_confirmation) {
      if (password.length >= 8) {
        dispatch(showLoder({ password: 1 }))
        postRequest('/api/v1/user/password/update', paramsUpdatePassword)
          .then((res) => {
            if (res.status === 'success') {
              toast.success('Пароль успешно обновлен!')
              setPassword('')
              setPassword_confirmation('')
              dispatch(showLoder({ password: 0 }))
            }
          })
          .catch((err) => {
            toast.error('Что-то пошло не так!')
            dispatch(showLoder({ password: 0 }))
          })
      } else {
        toast.error('Пароль должен содержать не менее 8 символов!')
      }
    } else {
      toast.error('Проверьте введенные данные, пароли не совпадают!')
    }
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

  let formData = new FormData()
  formData.append('dealer_id', id)
  formData.append('file', fileGive)

  const addPicture = (e) => {
    if (fileGive) {
      dispatch(showLoder({ dealersFile: 1 }))
      postRequestFile(`/api/v1/dealers/file/${id}`, formData)
        .then((res) => {
          toast.success('Успешно создано!')

          setFileName('')
          setShowIcon(false)
          getDealer()
          dispatch(showLoder({ dealersFile: 0 }))
        })
        .catch(() => {
          toast.error('Что-то пошло не так!')
          dispatch(showLoder({ dealersFile: 0 }))
        })
    } else {
      toast.error('Прикрепите файл!')
    }
  }

  const [filterUserActive, setFilterUserActive] = useState([])
  const [selectValueAccess, setSelectValueAccess] = useState(0)
  const [dataTableFilter, setDataTableFilter] = useState([])

  const assingAccess = (e) => {
    let controlUsers = []

    //Проверка пользователя на существование
    const controlArray = dataTableFilter.find(
      (el) => el.id === +JSON.parse(selectValueAccess).id
    )

    if (controlArray) {
      controlUsers = controlArray.users.filter(
        (chaild) => +chaild.user_id === +idPassword
      )
    }

    paramsAccess = {
      login: JSON.parse(selectValueAccess).login,
      buyerCode: JSON.parse(selectValueAccess).buyerCode,
      password: JSON.parse(selectValueAccess).password,
      auction_id: JSON.parse(selectValueAccess).auction_id,
      users: [+idPassword],
      company_name: JSON.parse(selectValueAccess).company_name,
      country_id: JSON.parse(selectValueAccess).country.id,
      paywall: JSON.parse(selectValueAccess).paywall,
      price_buy: JSON.parse(selectValueAccess).price_buy,
      active: JSON.parse(selectValueAccess).active,
    }

    if (controlUsers.length > 0) {
      toast.error('Доступ уже был добавлен!')
    } else {
      dispatch(showLoder({ credentialsId: 1 }))
      putRequest(
        `/api/v1/credentials/${JSON.parse(selectValueAccess).id}`,
        paramsAccess
      )
        .then((res) => {
          toast.success('Доступ успешно назначен!')
          getValueAccess()
          setAssingAccessToggle(!assingAccessToggle)
          dispatch(showLoder({ credentialsId: 0 }))
        })
        .catch((err) => {
          toast.error('Проверьте веденные данные!')
          dispatch(showLoder({ credentialsId: 0 }))
        })
    }
  }

  useEffect(() => {
    getValueAccess()
  }, [])

  const getValueAccess = () => {
    let users = []
    let valueAccess = []
    dispatch(showLoder({ credentials: 1 }))
    getRequest(`/api/v1/credentials?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        for (const key in res.credentials) {
          res.credentials[key].map((el) => {
            if (el.active) valueAccess.push(el)
            if (el.users.length > 0) users.push(el)
          })
        }

        if (valueAccess.length > 0) {
          setFilterUserActive(valueAccess)
          setSelectValueAccess(JSON.stringify(valueAccess[0]))
        } else {
          setFilterUserActive([])
          setSelectValueAccess(0)
        }

        setDataTableFilter(users)
        dispatch(showLoder({ credentials: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ credentials: 0 }))
      })
  }

  return (
    <div className="itemContainer">
      <ToastContainer />

      <ToastContainer />
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Удаление фото</Modal.Title>
          </Modal.Header>

          <Modal.Body>Вы действительно хотите удалить?</Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => removePicture(container.id)}
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => setIsModalRemove(false)}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>
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
                        Редактировать дилера
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
                            onClick={() => rightsSettingFunction()}
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
                    />
                  </label>

                  <div
                    className="accessUsers"
                    style={{
                      display:
                        filterUserActive.length > 0 && assingAccessToggle
                          ? 'block'
                          : 'none',
                    }}
                  >
                    <label>
                      <span>Доступ</span>
                      {filterUserActive.length > 0 ? (
                        <select
                          value={selectValueAccess}
                          onChange={(event) =>
                            setSelectValueAccess(event.target.value)
                          }
                        >
                          {filterUserActive.map((elem, i) => (
                            <option
                              value={JSON.stringify(elem)}
                              key={i + elem.buyerCode}
                            >
                              {elem.auction_name + '-' + elem.buyerCode}
                            </option>
                          ))}
                        </select>
                      ) : (
                        'Нет даных'
                      )}
                    </label>
                  </div>

                  {/* assingAccess */}

                  <div className="groupAction">
                    <input
                      className="btn-blue"
                      type="button"
                      style={{ margin: '2px' }}
                      onClick={() => newPassowrd()}
                      value="Обновить пароль системы"
                    />
                    {/* {title !== 'Офис' && title !== 'Дилер' && (
                      <Link className="btn-blue" to="/credentials/copart/open">
                        <span>Доступы к аукционам</span>
                      </Link>
                    )} */}
                    {!assingAccessToggle && (
                      <input
                        className="btn-blue"
                        type="button"
                        style={{ margin: '2px', background: 'green' }}
                        onClick={() =>
                          setAssingAccessToggle(!assingAccessToggle)
                        }
                        value="Доступы к аукционам"
                      />
                    )}
                    {filterUserActive.length > 0 && assingAccessToggle && (
                      <input
                        value=" Назначить доступ"
                        className="btn--black"
                        type="button"
                        onClick={() => assingAccess()}
                      />
                    )}
                  </div>
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
                <div className="addPicture" style={{ flexDirection: 'column' }}>
                  {showIcon && (
                    <span className="btn-primary" onClick={() => addPicture()}>
                      Добавить фото
                    </span>
                  )}

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
                  <div className="blockShowOrHide">
                    <div className="dropBlock--inner" style={styleReset}>
                      <div
                        className="dropBlockContent dropBlockContent--photo"
                        style={{
                          display: dataContainer.length > 0 ? 'flex' : 'none',
                        }}
                      >
                        <ModalByPhotos options={{ infinite: false }}>
                          {dataContainer.length > 0 &&
                            dataContainer.map((el) => {
                              return (
                                <div
                                  className="innerPhoto"
                                  key={el.id}
                                  // onClick={() => setCurrentLinkPath(config.backRequestDoc + el.image_path)}
                                  // onMouseOver={() => setIdShowBlockTrash(el.id)}
                                >
                                  <button
                                    data-fancybox="gallery"
                                    data-src={config.backRequestDoc + el.path}
                                    className="button button--secondary"
                                  >
                                    <img
                                      width="255px"
                                      height="255px"
                                      src={config.backRequestDoc + el.path}
                                      alt={el.image_name}
                                    />

                                    <Trash
                                      color="red"
                                      style={{ fontSize: '1.2em' }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setContainer({ id: el.id })
                                        setIsModalRemove(!isModalRemove)
                                      }}
                                    />
                                  </button>
                                </div>
                              )
                            })}
                        </ModalByPhotos>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default DealersEdit
