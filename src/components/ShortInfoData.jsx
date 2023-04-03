import React from 'react'
import PropTypes from 'prop-types'

const ShortInfoData = ({ shortInfoArray }) => {
	const { transport_name, vin, buyer_title, buyer_email } = shortInfoArray
	return (
		<div className='shortContent'>
			{shortInfoArray.vin && (
				<React.Fragment>
					<span>{transport_name}</span>
					<span>{vin}</span>
					<span>{buyer_title}</span>
					<span>{buyer_email}</span>
				</React.Fragment>
			)}
		</div>
	)
}

ShortInfoData.propTypes = {
	shortInfoArray: PropTypes.object,
}
export default ShortInfoData
