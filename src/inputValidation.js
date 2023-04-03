import { dataParams } from './const'

const boolFist = process.env.NODE_ENV === 'production'
const boolSecond = document.location.host.split(':')[0] === 'neonface.by'

const inputValidation = (key) => {
	switch (key) {
		case 'client_secret':
			return boolFist
				? boolSecond
					? dataParams[0].option[0].data
					: dataParams[0].option[1].data
				: dataParams[0].option[0].data

		case 'echo_key':
			return boolFist
				? boolSecond
					? dataParams[1].option[0].data
					: dataParams[1].option[1].data
				: dataParams[1].option[0].data

		case 'client_id':
			return boolFist
				? boolSecond
					? dataParams[2].option[0].data
					: dataParams[2].option[1].data
				: dataParams[2].option[0].data

		case 'backRequest':
			return boolFist
				? boolSecond
					? dataParams[3].option[0].data
					: dataParams[3].option[1].data
				: dataParams[3].option[0].data

		case 'backRequestDoc':
			return boolFist
				? boolSecond
					? dataParams[4].option[0].data
					: dataParams[4].option[1].data
				: dataParams[4].option[0].data

		default:
			return null
	}
}
export { inputValidation }
