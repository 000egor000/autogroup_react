import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import HeaderItem from '../components/HeaderItem.jsx'

function Layout() {
  const [showDrop, setShowDrop] = useState(false)
  return (
    <div className="Layout" onClick={() => setShowDrop(false)}>
      <Header showDrop={showDrop} setShowDrop={setShowDrop} />

      <HeaderItem />
      <div className="Layout-inner">
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default Layout
