<template>
  <base-dialog :show="show" @close="$emit('close')">
    <v-container grid-list-md>
      <v-layout row>
        <v-flex xs12>
          <h2 class="dialog-heading mb-3">Forgot your password?</h2>
          <h4 class="dialog-subtitle">In order to recover your password, please fill in your email</h4>
        </v-flex>
      </v-layout>

      <v-form ref='form' @submit.prevent="submitReset">
        <v-layout row class="mt-3 mb-4">
          <v-flex sm4 class="input-wrap">
            <v-text-field
                class="forgot-email"
                data-test="forgot-email"
                v-model='email'
                required
                label="Email Address"
                :error-messages="emailErrors"
                @blur="$v.email.$touch()"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex sm6>
            <a class="login-layout-link" @click.stop="login" data-test="login-link">Already have an account?</a>
          </v-flex>

          <v-flex sm6 class="text-xs-right">
            <v-btn
                color="success"
                round
                large
                type="submit"
                :loading="loading"
                :disabled='this.$v.$dirty && this.$v.$invalid'
                data-test="forgot-password-button"
            >
              Send Reset Link
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-container>
  </base-dialog>
</template>

<script>
import BaseDialog from "@/components/common/base-dialog";
import { required, email } from 'vuelidate/lib/validators'

import {mapActions} from "vuex";

export default {
  components: {
    BaseDialog
  },
  validations: {
    email: {
      required,
      email
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      email: '',
      loading: false
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) {
        return errors
      }

      if (!this.$v.email.email) {
        errors.push('Email Validation')
      }

      if (!this.$v.email.required) {
        errors.push('Email is required')
      }

      return errors
    }
  },
  methods: {
    ...mapActions('auth', ['sendResetLink']),
    submitReset () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.loading = true
        this.sendResetLink({
          email: this.email
        }).then((res) => {
          global.toastr['success']('Email sent successfully! Please check your inbox', 'Success')
          this.$emit('close')
          this.loading = false
          this.clear()
        }).catch((err) => {
          this.loading = false
          global.toastr['error']('Cannot find the user with given Email Address', 'Error')
          console.log(err.message)
        })

        // EventTracker.sendEvent(EVENT_NAMES.PASSWORD_RESET_REQUESTED)
      }
    },
    login () {
      this.$emit('close')
      this.clear()
      this.$router.push({ name: 'login' })
    },
    clear () {
      this.$refs.form.reset()
      this.$v.$reset()
    },
  }
}
</script>