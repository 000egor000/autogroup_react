import React, { useState, useEffect } from 'react'
import IconNoData from './../assets/noConnection.png'
const NoData = ({}) => {
  return (
    <div className="noData">
      <img src={IconNoData} />
      <p>Нет данных!</p>
    </div>
  )
}
export default NoData
