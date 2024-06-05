const utilHelper = {}

utilHelper.sendResponse = (res, status, data, error, message) => {
    const response = {}
    if (data) response.data = data
    if (error) response.error = error
    if (message) response.message = message
    return res.status(status).json(response)
}



module.exports = utilHelper