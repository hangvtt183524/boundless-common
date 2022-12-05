<template>
  <v-app>
    <v-content>
      <v-container class="invite-signup" fluid fill-height>
        <v-layout class="align-center justify-center">
          <v-flex xs12 sm7 md3>
            <v-card class="pa-4">
              <v-card-text>
                <div class="logo-container">
                  <img class="logo-image" src="@/assets/images/boundless-logo.png">
                  <h3 class="logo-text">BOUNDLESS</h3>
                </div>

                <v-flex class="text-xs-center mt-5">
                  <v-progress-circular
                      v-if="isLoading"
                      :size="50"
                      indeterminate
                      color="primary"
                  />
                  <v-alert
                      v-else-if="errorMessage"
                      class="mt-5"
                      :value="true"
                      outline
                      color="error"
                      icon="warning"
                  >
                    <strong>{{ errorMessage }}</strong>
                  </v-alert>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Ls from '@/services/ls'
import { mapActions } from 'vuex'

import ErrorHandlerMixin from "@/mixins/error-handler.mixin";

export default {
  props: {
    token: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  mixins: [ErrorHandlerMixin],
  data () {
    return {
      isLoading: true,
      isAuthenticated: false,
      errors: {},
      success: false
    }
  },
  mounted() {
    const payload = {
      key: this.token,
      email: this.email
    }
    // verify with email provided in this page
    this.verifyEmail(payload).then(response => {
      const data = response.data.data

      // set new current user email + new token + current user information if verify with new email successfully
      if (data.token && (!Ls.get('currentUserEmail') || (Ls.get('currentUserEmail') === data.old_email))) {
        this.$store.commit('auth/AUTH_SUCCESS', data.token)
        this.$store.commit('user/UPDATE_CURRENT_USER', { email: this.email })
        Ls.set('auth.token', data.token)
        Ls.set('currentUserEmail', this.email)
        this.isAuthenticated = true
      }
      this.success = true
      this.proceed()
    }).catch(error => {
      this.setErrorData(error)
    }).finally(() => {
      this.isLoading = false
    })
  },
  computed: {
    successMessage () {
      if (!this.isAuthenticated) {
        return 'Please login with your new email'
      }
      return 'Email successfully verified'
    },
    errorMessage () {
      if (this.errorData.hasOwnProperty('key')) {
        return this.getErrorMessages('key')[0]
      } else if (this.errorData.hasOwnProperty('email')) {
        return this.getErrorMessages('email')[0]
      } else if (this.errorData.hasOwnProperty('non_field_errors')) {
        return this.getErrorMessages('non_field_errors')[0]
      } else {
        return ''
      }
    },
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('user', ['verifyEmail']),
    proceed () {
      global.toastr['success'](this.successMessage, 'Success')

      if (this.isAuthenticated) {
        this.$router.push({ name: 'home' }).catch(error => {})
      } else {
        this.logout()
      }
    }
  }
}
</script>

<style lang="scss">
@import 'styles/_logo-container.scss';

.invite-signup {
  flex: 1;
  background: url('@/assets/images/background.png') no-repeat center center;
  background-size: cover;
}

html {
  overflow-y: auto !important;
}
</style>