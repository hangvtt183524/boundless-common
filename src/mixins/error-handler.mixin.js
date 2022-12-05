export default {
    data () {
        return {
            errorData: {}
        }
    },
    methods: {
        clearErrorData () {
            this.errorData = {}
            // if (this.$v) {
            //     this.$v.$reset()
            // }
        },
        getErrorMessages (key, obj = null) {
            /*
                Returns array of error messages based on the given `key`.
            */
            let data = this.errorData
            if (obj) {
                data = obj
            }
            const error = key in data ? data[key] : null
            if (error) {
                if (Array.isArray(error)) {
                    return error.map(item => {
                        return 'message' in item ? item.message : []
                    })
                } else if (typeof error === 'string') {
                    return [error]
                } else if (typeof error === 'object' && 'message' in error) {
                    return Array.isArray(error.message) ? error.message : [error.message]
                }
            }
            return []
        },
        setErrorData (error) {
            if (error.response && error.response.data && error.response.data.error && error.response.data.error.detail) {
                this.errorData = { ...error.response.data.error.detail }
            } else {
                this.clearErrorData()
            }
        }
    }
}