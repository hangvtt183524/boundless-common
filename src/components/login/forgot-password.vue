<template>
  <div>
    <p class="login-text">In order to recover your password, please fill in your email</p>

    <v-form ref='form'>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
              v-model='email'
              required
              label="Email"
              :error-messages="emailErrors"
              @blur="$v.email.$touch()"
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-btn class="success white--text" round block
                 :disabled='this.$v.$dirty && this.$v.$invalid'
                 @click='forgotPassword'
          >
            Submit
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout row class="mt-3">
        <v-flex xs12 class="text-xs-center">
          <router-link class="forgot-link" to="/login">Already have an account?</router-link>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'ForgotPassword',

  validations: {
    email: {
      required,
      email
    }
  },

  data () {
    return {
      email: '',
      valid: true
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push(this.$t('errors.email'))
      !this.$v.email.required && errors.push(this.$t('errors.emailRequired'))
      return errors
    }
  },
  methods: {
    forgotPassword () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        console.log(this.email)
        // this.auth.forgotPassword()
      }
    }
  }
}
</script>