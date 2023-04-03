import React, { useContext } from 'react'
import ContextApp from '../context/contextApp'

const Footer = () => {
	const data = new Date()
	const year = data.getFullYear()
	const { state } = useContext(ContextApp)

	return (
		<div className='footerItem'>
			<div className='footer-inner' style={{ paddingLeft: state.width }}>
				<span>&#169;</span>
				<span style={{ margin: '0 5px' }}>{year}</span>
				<a href='https://autogroup.by/' target='_blank' rel='noreferrer'>
					<span>autogroup.by</span>
				</a>
			</div>
		</div>
	)
}
export default Footer
