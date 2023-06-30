import {
  SHOW,
  HIDE,
  WIDTHOPEN,
  WIDTHCLOSE,
  SHOWLOADER,
  // CONTROLTOKEN,
} from './boilerplate'
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

// dispatch(controlToken({ status: err.status }))

// export const controlToken = (status) => {
//   return {
//     type: CONTROLTOKEN,
//   }
// }

// export const accessRights = (newClick) => {
// 	return {
// 		type: ACCESSRIGHTS,
// 		payload: newClick,
// 	}
// }
