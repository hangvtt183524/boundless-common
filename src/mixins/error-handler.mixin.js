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
        },
        getErrorCodes (key, obj = null) {
            let data = this.errorData
            if (obj) {
                data = obj
            }
            const error = key in data ? data[key] : null
            if (error) {
                if (Array.isArray(error)) {
                    return error.map(item => {
                        return 'code' in item ? item.code : []
                    })
                } else if (typeof error === 'string') {
                    return [error]
                } else if (typeof error === 'object' && 'code' in error) {
                    return Array.isArray(error.code) ? error.code : [error.code]
                }
            }
            return []
        },
        getVueErrors (fieldName) {
            if (!fieldName) {
                return []
            }
            let validations = this.$options.validations
            let field = this.$v
            for (let key of fieldName.split('.')) {
                validations = validations[key]
                field = field[key]
            }
            if (!field.$dirty) return []

            for (let validator of Object.keys(validations)) {
                if (!field[validator]) {
                    let message = ''
                    if (validator === 'between') {
                        const kwargs = {
                            min: field.$params.between.min,
                            max: field.$params.between.max
                        }
                        message = this.$t(`errors.${validator}`, kwargs)
                    } else if (validator === 'maxLength') {
                        const kwargs = {
                            max: field.$params.maxLength.max
                        }
                        message = this.$t(`errors.${validator}`, kwargs)
                    } else {
                        message = this.$t(`errors.${validator}`)
                    }
                    return [message]
                }
            }
            return []
        }
    }
}