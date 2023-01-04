<template>
  <div>
    <v-layout v-if="isGoogleSignInButtonVisible" row>
      <v-flex xs12>
        <a :href="getOAuthSignInLink('google')">
          <div class="google-sign-in-button">
            <div class="icon">
              <img src="@/assets/images/google_signin_icon.svg" />
            </div>
            <span class="text">Register With Google</span>
          </div>
        </a>
      </v-flex>
    </v-layout>
    <v-layout class="mt-3" v-if="isGoogleSignInButtonVisible" row>
      <v-flex xs12>
        <div class="separator">
          <span>Or</span>
        </div>
      </v-flex>
    </v-layout>
    <v-form ref="form" @submit.prevent="validateAndRegister">
      <v-layout :class="{'mt-3': isGoogleSignInButtonVisible}" row>
        <v-flex xs12>
          <v-text-field
              class="signup-name"
              v-model='formData.first_name'
              data-test="signup-name"
              type="text"
              required, counter='64'
              :rules="nameRules"
              :label="$t('login.firstName') + ' *'"
              :error-messages="firstNameErrors"
              :disabled="disableLastName"
              @input="$v.formData.first_name.$touch()"
              @blur="$v.formData.first_name.$touch()"
          />
        </v-flex>
      </v-layout>
      <v-layout :class="{'mt-3': isGoogleSignInButtonVisible}" row>
        <v-flex xs12>
          <v-text-field
              class="signup-last-name"
              v-model='formData.last_name'
              data-test="signup-last-name"
              type="text"
              required, counter='64'
              :rules="nameRules"
              :label="$t('login.lastName') + ' *'"
              :error-messages="lastNameErrors"
              :disabled="disableFirstName"
              @input="$v.formData.last_name.$touch()"
              @blur="$v.formData.last_name.$touch()"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
              class="signup-email"
              v-model='formData.email'
              data-test="signup-email"
              type="email"
              required,
              :label="$t('login.email') + ' *'"
              :error-messages="emailErrors"
              :disabled="disableEmail"
              @blur="$v.formData.email.$touch()"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
              class="signup-password"
              v-model='formData.password'
              data-test="signup-password"
              min='8'
              required
              counter='25'
              ref="password"
              :rules="rules"
              :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
              @click:append='() => passwordHidden = !passwordHidden'
              :type="passwordHidden ? 'password' : 'text'"
              :label="$t('login.password') + ' *'"
              :error-messages="passwordErrors"
              @input="$v.formData.password.$touch()"
              @blur="$v.formData.password.$touch()"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-btn
              class="success.white--text"
              data-test="signup-button"
              :loading="loading"
              round
              block
              type="submit"
              :disabled="$v.formData.$invalid"
          >
            {{ submitTextDisplay }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout class="mt-2" row v-for="provider of identityProviders" :key="provider.login_url">
        <v-flex xs12>
          <a :href="provider.login_url">
            <v-btn class="primary.white--text login-button" round block type="button">
              Register With
            </v-btn>
          </a>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import TelInput from '@/components/common/tel-input/tel-input'

export default {
  name: 'RegistrationForm',
  props: {
    submitText: {
      type: String,
      default: ''
    },
    identityProviders: {
      type: Array,
      required: false
    }
  },
  components: [TelInput],
  validations: {
    formData: {
      first_name: {
        required,
        maxLength: maxLength(64)
      },
      last_name: {
        required,
        maxLength: maxLength(64)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(25)
      }
    }
  },
  mixins: [
    ErrorHandlerMixin,
    NodeSelectionsMixin
  ],
  mounted () {
    this.formData = Object.assign({}, this.formData, this.$route.query)
    if (this.$route.query.email) {
      this.disableEmail = true
    }

    if (this.$route.query.first_name) {
      this.disableFirstName = true
    }

    if (this.$route.query.last_name) {
      this.disableLastName = true
    }

    if (this.$route.query.next_page) {
      this.nextPage = this.$route.query.next_page
    }

    if (this.formData.first_name && this.formData.last_name && this.formData.email) {
      this.$refs.password.focus()
    }
    this.nextPage = this.$route.query.next_page
  },

  data () {
    // each field is represented by a value property and its validation rule
    return {
      formData: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
      disableEmail: false,
      disableFirstName: false,
      disableLastName: false,
      passwordHidden: true,
      checkbox: false,
      loading: false,
      maxLength: 25,
      maxNameLength: 64,
      nextPage: null
    }
  },
  computed: {
    submitTextDisplay () {
      return this.submitText || 'Summit'
    },
    firstNameErrors () {
      const errors = []
      const firstName = this.$v.formData.first_name
      if (!firstName.$dirty) return errors
      !firstName.required && errors.push('First name is required')
      return errors
    },
    lastNameErrors () {
      const errors = []
      const lastName = this.$v.formData.last_name
      if (!lastName.$dirty) return errors
      !lastName.required && errors.push('Last name is required')
      return errors
    },
    emailErrors () {
      const errors = []
      const email = this.$v.formData.email
      if (!email.$dirty) return errors
      !email.email && errors.push('Must be a valid e-mail')
      !email.required && errors.push('Email is required')
      return errors.length > 0 ? errors : this.getErrorMessages('email')
    },
    passwordErrors () {
      const errors = []
      const password = this.$v.formData.password
      if (!password.$dirty) return errors
      !password.minLength && errors.push('Password must be at least 8 characters')
      !password.required && errors.push('Password is required')
      return errors.length > 0 ? errors : this.getErrorMessages('password')
    },
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxLength || this.$t('general.maxCharacters', { count: this.maxLength })
      }
      return [maxRule]
    },
    nameRules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxNameLength || this.$t('general.maxCharacters', { count: this.maxNameLength })
      }
      return [maxRule]
    },
    isGoogleSignInButtonVisible () {
      return !this.disableEmail && !this.formData.invitation_key && !this.formData.authentication_token
    }
  },
  methods: {
    ...mapActions('auth', ['signup']),
    ...mapActions('user', ['checkInvitation', 'acceptInvitation']),
    ...mapActions('layout', ['fetchUserWorkspaces']),
    clear () {
      this.$refs.form.reset()
      this.clearErrorData()
    },
    getOAuthSignInLink (provider) {
      return `${process.env.VUE_APP_API_URL}/signin/oauth/${provider}/`
    },
    postRegistration (pendingEmailVerification, invitationData) {
      if (pendingEmailVerification) {
        this.$router.push({ name: 'EmailVerificationInfo' }).catch(error => {})
      } else {
        if (this.nextPage) {
          this.$router.push(this.nextPage).catch(error => {})
        }
        this.fetchUserWorkspaces().then(() => {
          this.selectActiveWorkspace()

          this.loading = false
        })
      }
    },
    validateAndRegister () {
      this.$v.$touch()
      this.clearErrorData()

      if (!this.$v.formData.$invalid) {
        this.loading = true
        this.$set(this.formData, 'password2', this.formData.password)

        if (this.formData.invitation_key) {
          this.checkInvitation({
            invitation_key: this.formData.invitation_key,
            email: this.formData.email
          }).then(response => {
            if (response.data.data.is_valid) {
              this.registerUser()
            } else {
              this.loading = false
              global.toastr['error']('Invitation key is invalid', 'Error')
              this.$router.push({ name: 'login' }).catch(error => {})
            }
          })
        } else {
          this.registerUser()
        }
      }
    },
    registerUser () {
      this.signup(this.formData).then(response => {
        const pendingEmailVerification = response.data.data.pending_email_verification
        if (this.formData.invitation_key) {
          this.acceptInvitation({ 'invitation_key': this.formData.invitation_key }).then(response => {
            this.postRegistration(pendingEmailVerification, response.data.data)
          }).catch(error => {
            const errorDetail = error.response.data.error.detail
            if (errorDetail.non_field_errors && errorDetail.non_field_errors[0] && errorDetail.non_field_errors[0].code === 'invitation_not_found') {
              // Invitation does not exist, but registration is successful, run postRegistration
              this.postRegistration(pendingEmailVerification)
              return
            }
            this.setErrorData(error)
            this.loading = false
          })
        } else {
          this.postRegistration(pendingEmailVerification)
        }
      }).catch(error => {
        this.setErrorData(error)
        this.loading = false

        if (this.getErrorCodes('authentication_token').indexOf('auth_token_expired') > -1) {
          this.$router.push({ name: 'login' }).catch(error => {})
        }
      })
    }
  }
}
</script>