<template>
  <panel-container title="Password" data-test="password-info">
    <v-layout row wrap>
      <v-flex xs12 md6 px-3>
        <v-text-field
            class="new-password"
            label="Password"
            placeholder="--"
            v-model="formData.password"
            data-test="new-password"
            min='8'
            required
            counter="25"
            :rules="rules"
            :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => passwordHidden = !passwordHidden"
            :type="passwordHidden ? 'password' : 'text'"
            :error-messages="passwordErrors"
            @blur="$v.formData.password.$touch()"
            @input="$v.formData.password.$touch()"
        />
      </v-flex>

      <v-flex xs12 md6 px-3>
        <v-text-field
            class="confirm-password"
            label="Confirm New Password"
            placeholder="--"
            v-model="formData.password_confirm"
            data-test="confirm-password"
            required
            :append-icon="passwordConfirmHidden ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => passwordConfirmHidden = !passwordConfirmHidden"
            :type="passwordConfirmHidden ? 'password' : 'text'"
            :error-messages="passwordConfirmErrors"
            @input="$v.formData.password_confirm.$touch()"
            @blur="$v.formData.password_confirm.$touch()"
        />
      </v-flex>

      <v-flex xs12 px-3>
        <v-alert
            :value="nonFieldError"
            color="error"
            icon="warning"
            outline
        >
          {{ nonFieldError }}
        </v-alert>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 text-xs-right>
        <v-btn
            data-test="submit-password-button"
            :disabled="disableSubmit"
            :loading="isLoading"
            @click="submit"
            color="success"
            round
        >
          Save
        </v-btn>
      </v-flex>
    </v-layout>
  </panel-container>
</template>

<script>
import PanelContainer from "@/components/common/panel-container";
import EditablePanelMixin from "@/mixins/editable-panel.mixin";
import ErrorHandlerMixin from "@/mixins/error-handler.mixin";

import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import {mapActions} from "vuex";

export default {
  components: {
    PanelContainer
  },
  validations: {
    formData: {
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(25)
      },
      password_confirm: {
        required
      }
    }
  },
  mixins: [
      EditablePanelMixin,
      ErrorHandlerMixin
  ],
  data () {
    return {
      formData: {
        password: '',
        password_confirm: ''
      },
      passwordHidden: true,
      passwordConfirmHidden: true,
      maxLength: 25
    }
  },
  computed: {
    passwordErrors () {
      const errors = []
      if (!this.$v.formData.password.$dirty) return errors
      !this.$v.formData.password.minLength && errors.push('Password must be at least 8 characters')
      !this.$v.formData.password.required && errors.push('Password is required')
      return errors.length > 0 ? errors : this.getErrorMessages('password')
    },
    passwordConfirmErrors () {
      const errors = []
      if (!this.$v.formData.password_confirm.$dirty) return errors
      !this.$v.formData.password.required && errors.push('Please confirm password')
      this.formData.password !== this.formData.password_confirm && errors.push('Passwords do not match')
      return errors.length > 0 ? errors : this.getErrorMessages('password_confirm')
    },
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxLength || `Max ${this.maxLength} characters`
      }
      return [maxRule]
    },
    nonFieldError () {
      for (let error of this.getErrorMessages('non_field_errors')) {
        return error
      }
      return ''
    },
    disableSubmit () {
      return !this.formData.password ||
          !this.formData.password_confirm ||
          this.$v.formData.password.$invalid ||
          this.$v.formData.password_confirm.$invalid ||
          this.formData.password !== this.formData.password_confirm
    }
  },
  methods: {
    ...mapActions('user', ['changePassword']),
    submit () {
      this.isLoading = true
      this.changePassword(this.formData).then(response => {
        this.showSuccessMessage()
        this.isEditing = false
      }).catch(err => {
        this.setErrorData(err)
        console.log(this.errorData)
      })
      this.isLoading = false
      // EventTracker.sendEvent(EVENT_NAMES.USER_PASSWORD_CHANGED)
    },
    showSuccessMessage () {
      global.toastr['success']('Password updated successfully', 'Success')
    }
  }
}
</script>