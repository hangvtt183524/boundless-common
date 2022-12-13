<template>
  <div data-test="login-page">
    <p class="login-text">{{ tfaMode === tfaModes.sms ?
        'Please enter the code we have sent to you mobile number to complete login'
        : 'Please enter the code for Boundless Digital on your Google Authenticator app to complete login' }}
    </p>

    <v-form ref='form' @submit.prevent="loginUser">
      <v-layout row>
        <v-flex xs12>
          <v-text-field
              class="login-code"
              v-model='code'
              required
              :class="{ 'input-group--dirty': dirtyCode }"
              label="Code"
          />
        </v-flex>
      </v-layout>

      <v-layout row class="mt-4">
        <v-flex xs12>
          <v-btn
              class="success white--text login-button"
              :loading="loading"
              data-test="login-button"
              round
              block
              type="submit"
          >
            LOGIN
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout row class="mt-3">
        <v-flex xs6>
          <a
              class="login-layout-link"
              href="#"
              @click.prevent="onResendClick"
              v-if="tfaMode === tfaModes.sms"
          >
            Re-send code
          </a>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import ErrorHandlerMixin from "@/mixins/error-handler.mixin";
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'Login2fa',
  mixins: [
      ErrorHandlerMixin,
      NodeSelectionsMixin
  ],
  data () {
    return {
      tfaModes: {
        sms: 'sms',
        googleAuthenticator: 'google_authenticator'
      },
      code: '',
      dirtyCode: null,
      valid: true,
      loading: true,
      samlToken: null,
      nextPage: null
    }
  },
  mounted() {
    if (this.$route.query.saml_token) {
      this.samlToken = this.$route.query.saml_token
    }

    if (this.$route.query.next_page) {
      this.nextPage = this.$route.query.next_page
    }

    if (!(this.tfaToken && this.tfaMode)) {
      // If user directly loads this page, redirect to login page
      this.$router.push({ name: 'login' })
    } else {
      let times = 0
      const interval = setInterval(() => {
        times += 1
        if (times === 5) {
          clearInterval(interval)
          if (this.dirtyEmail) {
            const emailInput = document.querySelector('div.login-email')
            emailInput.classList.add('v-input--is-label-active')
            emailInput.classList.add('v-input--is-dirty')
            emailInput.classList.remove('input-group--dirty')
            const emailInputLabel = document.querySelector('div.login-email label')
            emailInputLabel.classList.add('v-label--active')
          }
        }
        this.dirtyEmail = document.querySelector('input[type="email"]:-webkit-autofill')
      }, 100)
    }
  },
  computed: {
    ...mapGetters('auth', ['tfaMode', 'tfaToken'])
  },
  methods: {
    ...mapActions('auth', ['login2fa', 'resend2fa']),
    ...mapActions('layout', ['fetchUserWorkspaces']),
    clear () {
      this.$refs.form.reset()
    },
    loginUser () {
      const formData = {
        token: this.tfaToken,
        code: this.code
      }

      if (this.samlToken) {
        formData.saml_token = this.samlToken
      }

      this.loading = true
      this.login2fa(formData).then(() => {
        if (this.nextPage) {
          this.$router.push(this.nextPage)
        }

        this.fetchUserWorkspaces().then(() => {
          this.selectActiveWorkspace()
        })

        // EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_IN_VIA_TFA)
      }).catch(error => {
        this.loading = false
        this.setErrorData(error)
        if (this.errorData && this.errorData.code === '2fa_token_expired') {
          this.$router.push({ name: 'login' })
        }
      })

      this.loading = false
    },
    onResendClick () {
      this.loading = true
      this.resend2fa({
        token: this.tfaToken
      }).then(() => {
        global.toastr['success']('Re-sent login code to your mobile number', 'Success')
      }).catch(error => {
        this.setErrorData(error)
        if (this.errorData && this.errorData.non_field_errors) {
          const message = this.getErrorMessages('message', this.errorData.non_field_errors[0])
          if (message.length > 0) {
            global.toastr['error'](message[0], 'Error')
          }
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>