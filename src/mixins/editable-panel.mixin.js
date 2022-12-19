let EditablePanelMixin = {
    data () {
        return {
            isEditing: false,
            isLoading: false
        }
    },
    methods: {
        cancel () {
            this.isEditing = false
            if (typeof this.setFormData === 'function') {
                this.setFormData()
            }
            if (typeof this.clearErrorData === 'function') {
                this.clearErrorData()
            }
        },
        edit () {
            this.isEditing = true
        },
        showSuccessMessage (message = null) {
            let successMessage = 'Data saved successfully'
            if (message) {
                successMessage = message
            }
            global.toastr['success'](successMessage, 'Success')
        }
    }
}

export default EditablePanelMixin