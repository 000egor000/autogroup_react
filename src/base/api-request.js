import { config } from '../config.js'

function handleResponse(res) {
  if (!res.ok) {
    return Promise.reject(res)
  }
  return res.json()
}

export const postRequest = async (url, body) => {
  let authorize
  if (!!sessionStorage.getItem('access_token')) {
    authorize = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    }
  }
  const params = {
    method: 'POST',
    body: JSON.stringify({
      ...body,
      client_id: config.client_id,
      client_secret: config.client_secret,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...authorize,
    },
  }
  const data = await fetch(`${config.backRequest + url}`, params).then(
    (res) => {
      return handleResponse(res)
    }
  )

  return data
}

export const postRequestFile = async (url, formData) => {
  let authorize
  if (!!sessionStorage.getItem('access_token')) {
    authorize = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    }
  }

  const params = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      Accept: '*/*',
      'Access-Control-Allow-Origin': '*',
      ...authorize,
    },
    body: formData,
  }
  const data = await fetch(`${config.backRequest + url}`, params).then(
    (res) => {
      return handleResponse(res)
    }
  )

  return data
}

export const getRequest = async (url, header) => {
  let params = {
    method: 'GET',

    headers: {
      ...header,
    },
  }

  const data = await fetch(`${config.backRequest + url}`, params).then(
    (res) => {
      return handleResponse(res)
    }
  )

  return data
}

export const getRequestFile = async (url, header) => {
  let params = {
    method: 'GET',
    responseType: 'blob',
    headers: {
      ...header,
    },
  }

  const data = await fetch(`${config.backRequest + url}`, params).then(
    (res) => {
      return handleResponse(res)
    }
  )

  return data
}

export const putRequest = async (url, body) => {
  let authorize
  if (!!sessionStorage.getItem('access_token')) {
    authorize = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    }
  }
  const params = {
    method: 'PUT',
    body: JSON.stringify({
      ...body,
      client_id: config.client_id,
      client_secret: config.client_secret,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...authorize,
    },
  }
  const data = await fetch(`${config.backRequest + url}`, params).then(
    (res) => {
      return handleResponse(res)
    }
  )

  return data
}

export const deleteRequest = async (url) => {
  let authorize
  if (!!sessionStorage.getItem('access_token')) {
    authorize = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    }
  }
  let params = {
    method: 'DELETE',
    headers: {
      ...authorize,
    },
  }
  const data = await fetch(`${config.backRequest + url}`, params).then(
    (res) => {
      return handleResponse(res)
    }
  )

  return data
}
export const deleteRequestData = async (url, body) => {
  let authorize
  if (!!sessionStorage.getItem('access_token')) {
    authorize = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    }
  }
  let params = {
    method: 'DELETE',
    body: JSON.stringify({
      ...body,
      client_id: config.client_id,
      client_secret: config.client_secret,
    }),
    headers: {
      ...authorize,
    },
  }
  const data = await fetch(`${config.backRequest + url}`, params).then(
    (res) => {
      return handleResponse(res)
    }
  )

  return data
}
