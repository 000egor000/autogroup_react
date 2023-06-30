import {
  SHOW,
  HIDE,
  WIDTHOPEN,
  WIDTHCLOSE,
  SHOWLOADER,
  // CONTROLTOKEN,
} from './boilerplate'

const SHOWLOADERFunc = (state, action) => {
  let res = []
  const token = window.sessionStorage.getItem('access_token')
  const { status, ...all } = action.payload

  if (state.loading.length > 0) {
    res = state.loading.map((el) =>
      Object.entries(el)[0][0] === Object.entries(all)[0][0] ? all : el
    )
    if (!res.includes(all)) res.push(all)
  } else {
    res.push(all)
  }

  return {
    ...state,
    loading: res,
    status: +status === 401 && token ? +status : state.status,
  }
}

export default function reducer(state, action) {
  switch (action.type) {
    case SHOW:
      return { ...state, loader: 1 }
    case SHOWLOADER:
      return SHOWLOADERFunc(state, action)

    case HIDE:
      return { ...state, loader: 0 }
    case WIDTHOPEN:
      return { ...state, width: '60px' }

    case WIDTHCLOSE:
      return { ...state, width: '60px' }

    // case CONTROLTOKEN:
    //   return STATUSTOKENFunc(state)

    default:
      return { ...state }
  }
}
