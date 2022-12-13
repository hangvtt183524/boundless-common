<template>
  <base-dialog :show="show" @close="$emit('close')" persistent>
    <h2 class="dialog-heading mb-3">Reset Password</h2>
    <h4 class="dialog-subtitle">You can now set a new password using the form below</h4>

    <v-form ref='form' @submit.prevent="submit">
      <v-layout row>
        <v-flex xs12 sm6 class="py-2 pr-3">
          <v-text-field
              class="new-password"
              v-model='password'
              data-test="new-password"
              min='8'
              required
              counter='25'
              :rules="rules"
              :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
              :append-icon-cb='() => passwordHidden = !passwordHidden'
              :type="passwordHidden ? 'password' : 'text'"
              label="Password"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
          />
        </v-flex>

        <v-flex xs12 sm6 class="py-2 pl-3">
          <v-text-field
              class="confirm-password"
              v-model='password2'
              data-test="confirm-password"
              :append-icon="password2Hidden ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => password2Hidden = !password2Hidden"
              :type="password2Hidden ? 'password' : 'text'"
              label="Confirm Password"
              :error-messages="password2Errors"
              @input="$v.password2.$touch()"
              @blur="$v.password2.$touch()"
          />
        </v-flex>
      </v-layout>

      <v-layout row class="mt-3">
        <v-flex sm12 text-xs-right>
          <v-btn
              class="success white--text"
              :loading="loading"
              round
              :disabled="$v.$dirty && $v.$invalid || password.length < maxLength || password !== password2"
              type="submit"
              data-test="reset-password-button"
          >
            Submit
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </base-dialog>
</template>

<script>
import BaseDialog from "@/components/common/base-dialog";
import PasswordFieldValidationMixin from "@/mixins/password-field-validation.mixin";
import {mapActions} from "vuex";

export default {
  name: 'ResetPasswordDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BaseDialog
  },
  mixins: [PasswordFieldValidationMixin],
  data () {
    return {
      password: '',
      password2: '',
      passwordHidden: true,
      password2Hidden: true,
      loading: false,
      maxLength: 25
    }
  },
  computed: {
    formData () {
      return {
        password: this.password,
        password2: this.password2,
        uidb64: this.$route.params.uidb64,
        token: this.$route.params.token
      }
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
    }
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    clear () {
      this.$refs.form.reset()
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.resetPassword(this.formData).then(response => {
          global.toastr['success']('Success! You may now login using your new password', 'Success')
          this.$router.push({ name: 'login' })
        }).catch(error => {
          this.setErrorData(error)
          const message = this.getErrorMessages('message')
          if (message.length > 0) {
            global.toastr['error'](message[0], 'Error')
          }
        })
        this.loading = false
      }
    }
  }
}
</script>