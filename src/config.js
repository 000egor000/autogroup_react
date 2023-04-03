import { inputValidation } from './inputValidation.js'

export const config = {
	client_secret: inputValidation('client_secret'),
	echo_key: inputValidation('echo_key'),
	client_id: inputValidation('client_id'),
	backRequest: inputValidation('backRequest'),
	backRequestDoc: inputValidation('backRequestDoc'),
}
