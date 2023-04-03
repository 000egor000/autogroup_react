import React, { useState } from 'react'
import PropTypes from 'prop-types'

const AuctionTransportDropsPay = ({ itemStatus }) => {
	const [describe, setDescribe] = useState('')
	const [fileGive, setFileGive] = useState('')
	const [anotherDocuments, setAnotherDocuments] = useState('')

	return (
		<div
			className='accessUsers  accessUsers--doc'
			style={{
				display: itemStatus ? 'block' : 'none',
			}}
		>
			<div className='contentBlockTop'>
				<div className='dropBlockContent dropBlockContent--doc'>
					<label>
						<span>Описание</span>

						<input
							type='text'
							placeholder='Описание'
							value={describe}
							onChange={(e) => setDescribe(e.target.value)}
						/>
					</label>

					<label>
						<span>Прикрепить файл</span>

						<input
							type='file'
							placeholder='Номер лота'
							value={fileGive}
							onChange={(e) => setFileGive(e.target.value)}
						/>
					</label>
					<label>
						<span>другие документы</span>

						<input
							type='file'
							placeholder='Номер лота'
							value={anotherDocuments}
							onChange={(e) => setAnotherDocuments(e.target.value)}
						/>
					</label>

					<input type='submit' className='btn-success-preBid btn-auto' value='Сохранить' />
				</div>
			</div>
		</div>
	)
}

AuctionTransportDropsPay.propTypes = {
	itemStatus: PropTypes.bool,
}
export default AuctionTransportDropsPay
