import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import { pathItems } from '../routers/pathItems'
import namePath from '../routers/namePath'
import React from 'react'
import Loader from '../components/Loader'

function RoutesItem() {
  return (
    <React.Suspense fallback={<Loader />}>
      <Routes>
        <Route path={namePath.DEFAULT} element={<Layout />}>
          {pathItems.map(({ element, path }) => (
            <Route key={element} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </React.Suspense>
  )
}

export default RoutesItem
