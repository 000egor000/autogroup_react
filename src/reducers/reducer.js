import { SHOW, HIDE, WIDTHOPEN, WIDTHCLOSE, SHOWLOADER } from './boilerplate'

const SHOWLOADERFunc = (state, action) => {
  let res = []

  if (state.loading.length > 0) {
    res = state.loading.map((el) =>
      Object.entries(el)[0][0] === Object.entries(action.payload)[0][0]
        ? action.payload
        : el
    )
    if (!res.includes(action.payload)) res.push(action.payload)
  } else {
    res.push(action.payload)
  }

  return {
    ...state,
    loading: res,
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

    // case ALLROLE:
    // 	return { ...state, allRole: action.payload }
    // case ACCESSRIGHTS:
    // 	return { ...state, accesRights: action.payload }

    default:
      return { ...state }
  }
}
