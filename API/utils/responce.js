export function generateResponse(message, { data = null, type = 'success' } = {}) {
	return {
		type: type,
		message: message,
		data: data
	};
}