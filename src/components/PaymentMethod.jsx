import React, { useContext } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'

import 'rsuite-table/dist/css/rsuite-table.css'
import ContextApp from '../context/contextApp.js'
import { variantPayArray } from '../const.js'
import NoData from './NoData'

const PaymentMethod = () => {
  const { state, dispatch } = useContext(ContextApp)

  return (
    <div className="itemContainer">
      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{
            paddingLeft: state.width,
            justifyContent: 'space-between',
            alignItems: 'inherit',
          }}
        >
          <div className="btnTransport"></div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          {variantPayArray.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={variantPayArray}
              >
                <Column align="center" fixed>
                  <HeaderCell></HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return <span>{rowIndex + 1}</span>
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={0.5}>
                  <HeaderCell>Способ оплаты</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return <span>{rowData.title}</span>
                    }}
                  </Cell>
                </Column>
              </Table>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default PaymentMethod
