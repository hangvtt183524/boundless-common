<tempalte>
  <editable-panel
      data-test="email-info"
      :disable-submit="disableSubmit"
      :is-editing="isEditing"
      :is-loading="isLoading"
      submitText="Change email"
      title="Email"
      @cancel="cancel"
      @edit="edit"
      @submit="submit"
  >
    <v-form @submit.prevent="submit" slot-scope="{readonly}">
      <v-layout row wrap>
        <v-flex xs12 class="px-3">
          <v-text-field
              data-test="email"
              :readonly="readonly"
              label="Email"
              v-model="formData.email"
              :error-messages="getErrors('email')"
              @blur="$v.formData.email.$touch"
              @input="$v.formData.email.$reset"
              required
          />
        </v-flex>

        <v-flex xs12>
          <v-alert
              class="email-change-confirm"
              data-test="email-change-confirm"
              color="success"
              dismissible
              icon="check_circle"
              outline
              transition="scale-transition"
              v-model="showConfirmationAlert"
          >
            | A confirmation email was sent to your new email
            | You need to verify it first for the changes to take effect
          </v-alert>
        </v-flex>
      </v-layout>
    </v-form>
  </editable-panel>
</tempalte>

<script>
import EditablePanel from "@/components/common/editable-panel";

import EditablePanelMixin from "@/mixins/editable-panel.mixin";
import CurrentUserMixin from "@/mixins/current-user.mixin";
import ErrorHandlerMixin from "@/mixins/error-handler.mixin";
import { email, required } from 'vuelidate/lib/validators'
import {mapActions} from "vuex";

export default {
  name: 'EmailInfo',
  components: {
    EditablePanel
  },
  mixins: [
    CurrentUserMixin,
    EditablePanelMixin,
    ErrorHandlerMixin
  ],
  validations: {
    formData: {
      email: {
        required,
        email
      }
    }
  },
  data () {
    return {
      formData: {
        email: ''
      },
      showConfirmationAlert: false,
      currentEmail: ''
    }
  },
  mounted() {
    this.setFormData()
    this.currentEmail = this.currentUser.email
  },
  computed: {
    disableSubmit () {
      return !this.formData.email || this.currentEmail === this.formData.email || this.$v.formData.$invalid
    }
  },
  methods: {
    ...mapActions('user', ['updateUserEmail']),
    setFormData () {
      this.$set(this.formData, 'email', this.currentUser.email)
    },
    submit () {
      this.clearErrorData()
      this.isLoading = true

      this.updateUserEmail(this.formData).then((response) => {
        this.isLoading = false
        this.isEditing = false
        this.showConfirmationAlert = true
        this.currentEmail = this.formData.email
      }).catch(err => {
        this.setErrorData(err)
        this.isLoading = false
      })

      // EventTracker.sendEvent(EVENT_NAMES.EMAIL_CHANGE_REQUESTED)
    },
    getErrors (fieldName) {
      const vueErrors = this.getVueErrors(`formData.${fieldName}`)
      if (vueErrors.length > 0) {
        return vueErrors
      } else {
        return this.getErrorMessages(fieldName)
      }
    }
  }
}
</script>