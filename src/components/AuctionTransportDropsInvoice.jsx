import React from 'react'
import PropTypes from 'prop-types'

const AuctionTransportDropsInvoice = ({ itemStatus }) => {
	return (
		<div
			className='accessUsers  accessUsers--doc'
			style={{ display: itemStatus ? 'block' : 'none' }}
		>
			<div className='contentBlockTop'>
				<div className='dropBlockContent dropBlockContent--doc'>
					<label>
						<span>Оплата за лот</span>
					</label>
				</div>
			</div>
		</div>
	)
}
AuctionTransportDropsInvoice.propTypes = {
	itemStatus: PropTypes.bool,
}
export default AuctionTransportDropsInvoice
