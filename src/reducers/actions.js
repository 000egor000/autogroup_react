import { SHOW, HIDE, WIDTHOPEN, WIDTHCLOSE, SHOWLOADER } from './boilerplate'
// ALLROLE, ACCESSRIGHTS

export const show = () => {
  return {
    type: SHOW,
  }
}
export const showLoder = (payload) => {
  return {
    type: SHOWLOADER,
    payload: payload,
  }
}

export const hide = () => {
  return {
    type: HIDE,
  }
}

export const widthOpen = () => {
  return {
    type: WIDTHOPEN,
  }
}

export const widthClose = () => {
  return {
    type: WIDTHCLOSE,
  }
}

// export const allRole = (newClick) => {
// 	return {
// 		type: ALLROLE,
// 		payload: newClick,
// 	}
// }

// export const accessRights = (newClick) => {
// 	return {
// 		type: ACCESSRIGHTS,
// 		payload: newClick,
// 	}
// }
