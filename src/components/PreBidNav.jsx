import React, { useState, useEffect, memo } from 'react'

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { btnShowBid } from '../const.js'

const PreBidNav = ({ id }) => {
  const [btnShow, setBtnShow] = useState(btnShowBid)
  useEffect(() => {
    chooseItem(id)
  }, [])

  const chooseItem = (id) => {
    const newArr = btnShow.map((item) => {
      return item.id === id
        ? { ...item, status: true }
        : { ...item, status: false }
    })

    setBtnShow(newArr)
  }

  return (
    <div className="groupInput">
      <div className="switcher-btn">
        {btnShow.map((item) => {
          return (
            <button key={item.id} onClick={() => chooseItem(item.id)}>
              <Link className={item.status ? 'active' : item.id} to={item.link}>
                {item.id}
              </Link>
            </button>
          )
        })}
      </div>
    </div>
  )
}

PreBidNav.propTypes = {
  id: PropTypes.string,
}
export default memo(PreBidNav)
