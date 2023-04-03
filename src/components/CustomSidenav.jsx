import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Sidenav, Nav } from 'rsuite'
import { controlWidth } from '../helper'
import { staticData } from '../const'

function CustomSidenav({
  appearance,
  activeKey,
  onSelect,
  expanded,
  onExpand,
  viewBlock,
  openKeys,
  onOpenChange,
  ...navProps
}) {
  const navigate = useNavigate()

  const controlLink = (link, role, id) => () => {
    sessionStorage.removeItem('curLink')
    if ((role && viewBlock(role)) || role == true) {
      onExpand(false)
      id == '9-2' ? window.open(link) : navigate(link)
    }
  }
  useEffect(() => {
    if (!expanded) onOpenChange([])
  }, [expanded])

  // const controlView = (role) => {
  //   let flag = false
  //   if (Array.isArray(role) && role.length > 0) {
  //     role.map((el) => {
  //       if (viewBlock(el)) {
  //         flag = true
  //       }
  //     })
  //   } else {
  //     if (role && viewBlock(role)) {
  //       flag = true
  //     }
  //     if (role == true) {
  //       flag = true
  //     }
  //   }

  //   return flag
  // }

  const childrenParse = (arr) =>
    arr.map((item) =>
      item.hasOwnProperty('children') && item.children.length > 0 ? (
        <Nav.Menu
          placement="rightStart"
          eventKey={item.id}
          title={item.title}
          key={item.id}
          // onClick={contolParents()}
          // style={{
          //   display: controlView(item.role) ? 'block' : 'none',
          // }}
        >
          {
            // controlView(item.role) &&
            childrenParse(item.children)
          }
        </Nav.Menu>
      ) : (
        <Nav.Item
          eventKey={item.id}
          key={item.id}
          onClick={controlLink(item.link, item.role, item.id)}
          style={
            {
              // display: controlView(item.role) ? 'block' : 'none',
            }
          }
        >
          {item.title}
        </Nav.Item>
      )
    )

  // const contolParents = () => (e) => {
  //   console.log(e.target.parentNode)

  //   return e.target.parentNode.classList.remove('rs-dropdown-item-collapse')
  // }

  const contentNav = () =>
    staticData.map((el) =>
      el.hasOwnProperty('children') && el.children.length > 0 ? (
        <Nav.Menu
          placement="rightStart"
          eventKey={el.id}
          title={el.title}
          icon={el.icon ? <el.icon /> : ''}
          key={el.id}
          style={
            {
              // display: controlView(el.role) ? 'block' : 'none',
            }
          }
        >
          {childrenParse(el.children)}
        </Nav.Menu>
      ) : (
        <Nav.Item
          eventKey={el.id}
          icon={el.icon ? <el.icon /> : ''}
          key={el.id}
          onClick={controlLink(el.link, el.role, el.id)}
          style={
            {
              // display: controlView(el.role) ? 'block' : 'none',
            }
          }
        >
          {el.title}
        </Nav.Item>
      )
    )

  const styles = {
    width: expanded ? controlWidth(expanded, openKeys) : 0,
  }

  return (
    <div className="HeaderItem" style={styles}>
      <Sidenav
        expanded={expanded}
        appearance={appearance}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        <Sidenav.Body>
          <Nav activeKey={activeKey} onSelect={onSelect} {...navProps}>
            {contentNav()}
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle
          expanded={expanded}
          onToggle={(expanded) => onExpand(expanded)}
        />
      </Sidenav>
    </div>
  )
}

export default CustomSidenav
