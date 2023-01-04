<template>
  <div data-test="login-page">
    <p class="login-text">Sign in now to access your Boundless account</p>
    <v-layout row>
      <v-flex xs12>
        <a :href="getOAuthSignInLink('google')">
          <div class="google-sign-in-button">
            <div class="icon">
              <img src="@/assets/images/google_signin_icon.svg" />
            </div>

            <span class="text">Login With Google</span>
          </div>
        </a>
      </v-flex>
    </v-layout>

    <v-layout row class="mt-3">
      <v-flex xs12>
        <div class="separator">
          <span>Or</span>
        </div>
      </v-flex>
    </v-layout>

    <v-form ref='form' @submit.prevent="loginUser">
      <v-layout row class="mt-3">
        <v-flex xs12>
          <v-text-field
              class="login-email"
              v-model='email'
              data-test="login-email"
              required
              :class="{ 'input-group--dirty': dirtyEmail }"
              label="Email"
              :error-messages="getErrorMessages('email')"
              :disabled="emailDisabled"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-text-field
              class="login-password"
              v-model='password'
              data-test="login-password"
              required
              :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
              @click:append="onPasswordIconClick()"
              :class="{ 'input-group--dirty': dirtyPwd }"
              :type="passwordHidden ? 'password' : 'text'"
              label="Password"
              :error-messages="getErrorMessages('password')"
          ></v-text-field>
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
          >LOGIN</v-btn>
        </v-flex>
      </v-layout>

      <v-layout
          class="mt-2"
          row
          v-for="provider of identityProviders"
          :key="provider.login_url"
      >
        <v-flex xs12>
          <a :href="provider.login_url">
            <v-btn
                class="primary white--text login-button"
                data-test="login-button"
                round
                block
                type="button"
            >
              Login With {{ ssoProviders[provider.provider] }}
            </v-btn>
          </a>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="mt-3">
        <v-flex xs6 class="text-xs-right">
          <a
              class="login-layout-link"
              href="#"
              data-test="forgot-link"
              @click.prevent="showForgotPasswordDialog = true"
          >
            Forgot your password?
          </a>
        </v-flex>

        <v-flex xs6 class="text-xs-right" v-if="!organizationSlug">
          <router-link class="login-layout-link" to="/login/organization-router">Login with SAML SSO</router-link>
        </v-flex>

        <v-flex xs6 v-if="!organizationSlug">
          <router-link class="login-layout-link" to="/login/organization-router">Login with SAML SSO</router-link>
        </v-flex>
      </v-layout>
    </v-form>

    <forgot-password-dialog :show="showForgotPasswordDialog" @close="showForgotPasswordDialog = false" />
  </div>
</template>

<script>
import ErrorHandlerMixin from "@/mixins/error-handler.mixin";
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import {mapActions} from "vuex";
import ForgotPasswordDialog from "@/components/login/forgot-password-dialog";

export default {
  name: 'Login',
  props: {
    organizationSlug: {
      type: String,
      required: false
    }
  },
  components: {
    ForgotPasswordDialog
  },
  mounted() {
    if (this.$route.query.email) {
      // If email is passed in the query, set it as static email value
      this.email = this.$route.query.email
      this.emailDisabled = true
    }

    if (this.$route.query.saml_token) {
      this.samlToken = this.$route.query.saml_token
    }

    if (this.organizationSlug) {
      this.getOrganizationIdentityProviders()
    }

    let times = 0
    const interval = setInterval(() => {
      times += 1
      if (times === 5) {
        clearInterval(interval)
        if (this.dirtyEmail || this.dirtyPwd) {
          const emailInput = document.querySelector('div.login-email')
          emailInput.classList.add('v-input--is-label-active')
          emailInput.classList.add('v-input--is-dirty')
          emailInput.classList.remove('input-group--dirty')

          const emailInputLabel = document.querySelector('div.login-email label')
          emailInputLabel.classList.add('v-label--active')

          const pwdInput = document.querySelector('div.login-password')
          pwdInput.classList.add('v-input--is-label-active')
          pwdInput.classList.add('v-input--is-dirty')
          pwdInput.classList.remove('input-group--dirty')

          const pwdInputLabel = document.querySelector('div.login-password label')
          pwdInputLabel.classList.add('v-label--active')
        }
      }
      this.dirtyEmail = document.querySelector('input[type="email"]:-webkit-autofill')
      this.dirtyPwd = document.querySelector('input[type="password"]:-webkit-autofill')
    }, 100)
  },
  mixins: [
      ErrorHandlerMixin,
      NodeSelectionsMixin
  ],
  data () {
    return {
      email: '',
      dirtyEmail: null,
      password: '',
      dirtyPwd: null,
      passwordHidden: true,
      checkbox: false,
      identityProviders: [],
      valid: true,
      loading: false,
      showForgotPasswordDialog: false,
      samlToken: null,
      emailDisabled: false,
      ssoProviders: {
        okta: "Okta",
        onelogin: "OneLogin",
        other: "Identity Provider"
      }
    }
  },
  methods: {
    ...mapActions('auth', ['login', 'fetchNodeIdentityProviders']),
    ...mapActions('layout', ['fetchUserWorkspaces']),
    clear () {
      this.$refs.form.reset()
    },
    getOrganizationIdentityProviders () {
      this.loading = true
      this.fetchNodeIdentityProviders(this.organizationSlug).then(response => {
        this.$set(this, 'identityProviders', response.data.data)
      }).catch((err) => {
        this.setErrorData(err)
      }).finally(() => {
        this.loading = false
      })
    },
    getOAuthSignInLink (provider) {
      return `${process.env.VUE_APP_API_URL}/signin/oauth/${provider}/`
    },
    loginUser () {
      const formData = {
        email: this.email,
        password: this.password
      }

      if (this.samlToken) {
        formData.saml_token = this.samlToken
      }

      this.loading = true
      this.login(formData).then(response => {
        if (response.data.data.tfa_mode) {
          this.$router.push({ name: 'login2fa', query: this.$route.query })
        } else {
          this.fetchUserWorkspaces().then(() => {
            this.selectActiveWorkspace()
          })

          // EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_IN_VIA_PASSWORD)
        }
      }).catch(error => {
        this.loading = false
        this.setErrorData(error)
        if (error.response
            && error.response.data
            && error.response.data.error
            && error.response.data.error.detail
            && error.response.data.error.detail.code === 'account_email_not_verified'
        ) {
          this.$router.push({ name: 'EmailVerificationInfo' })
        }
      })
      this.loading = false
    },
    onPasswordIconClick () {
      this.passwordHidden = !this.passwordHidden

      if (!this.passwordHidden) {
        // EventTracker.sendEvent(EVENT_NAMES.LOGIN_PASSWORD_SHOWN)
      }
    }
  }
}
</script>