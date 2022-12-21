import {mapActions, mapGetters} from "vuex";

let CurrentUserMixin = {
    computed: {
        ...mapGetters('user', ['currentUser']),
        profile () {
            return this.currentUser.profile
        },
        dateFormat () {
            let format = 'L' // 09/04/1986
            if (this.profile.date_format !== 'mdy') {
                format = 'DD/MM/YYYY'
            }
            return format
        },
    },
    methods: {
        ...mapActions('user', ['updateCurrentUser']),
        strToDate (value, format = null) {
            return this.$moment(value, format || this.dateFormat)
        },
        dateFormatter (value, format = null, sourceFormat = null) {
            if (!value) {
                return value
            }

            const dateValue = (sourceFormat && typeof (format) === 'string')
                ? this.$moment(value, sourceFormat) : this.$moment(value)

            return (format && typeof (format) === 'string')
                ? dateValue.format(format) : dateValue.format(this.dateFormat)
        },
        jsonFormatter (value) {
            if (!value) {
                return value
            }

            let formatted = JSON.stringify(value, null, 2)
            const displayCharacterLimit = 200
            if (formatted.length > displayCharacterLimit) {
                formatted = formatted.substring(0, displayCharacterLimit) + '\n  ...\n}'
            }

            return formatted
        },
    }
}

export default CurrentUserMixin