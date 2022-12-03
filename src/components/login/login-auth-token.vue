<template>
  <v-app>
    <v-container fill-height>
      <b-loader />
    </v-container>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import BLoader from "@/components/common/b-loader";

export default {
  name: 'LoginAuthToken',
  components: { BLoader },
  data() {
    return {
      token: null,
      email: null,
      nextPage: null
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    ...mapActions('auth', ['loginAuthToken', 'unsetUser']),
    initialize () {
      this.unsetUser()

      this.email = this.$route.query.email
      this.token = this.$route.query.authentication_token

      if (this.$route.query.next_page) {
        this.nextPage = this.$route.query.next_page
      }

      if (!this.email || !this.token) {
        this.$router.push({ name: 'login' }).catch(error => {})
        return
      }

      this.loginWithAuthToken()
    },
    loginWithAuthToken () {
      this.loginAuthToken({
        authentication_token: this.token,
        email: this.email
      }).then(response => {
        if (response.data.data.tfa_mode) {
          this.$router.push({ name: 'login2fa', query: this.$route.query }).catch(error => {})
        } else {
          if (this.nextPage) {
            this.$router.push(this.nextPage).catch(error => {})
          }

          // this.fetchUserWorkspaces().then(() => {
          //   this.selectActiveWorkspace()
          // })
        }
      }).catch(error => {
        // If error reason is email not being verified yet, re-route to email verification info screen
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.detail &&
            error.response.data.error.detail.code === 'account_email_not_verified') {
          this.$router.push({ name: 'EmailVerificationInfo' }).catch(err => {})
        } else {
          // No other error case should happen within expected flow logic. Re-route to login page in such a case
          this.$router.push({ name: 'login', query: this.$route.query }).catch(err => {})
        }
      })
    }
  }
}
</script>