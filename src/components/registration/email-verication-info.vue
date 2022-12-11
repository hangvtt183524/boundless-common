<template>
  <div data-test="signup-page">
    <p class="login-text" v-html="'You have successfully signed up.<br><br>Click the email verification link in the email we\'ve sent you now to complete your registration and start using Boundless services'"></p>
    <v-layout row wrap class="mt-5">
      <v-flex xs6>
        <router-link class="login-layout-link" to="/login">Already verified?</router-link>
      </v-flex>

      <v-flex class="text-xs-right" xs6>
        <a class="login-layout-link" href="#" @click.prevent="onResendMessageClick()">Resend email</a>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'EmailVerificationInfo',
  mounted() {
    if (!this.registeredEmail) {
      this.$router.push({ name: 'login' }).catch(error => {})
    }
  },
  computed: {
    ...mapGetters('auth', ['registeredEmail'])
  },
  methods: {
    ...mapActions('user', ['resendVerificationMessage']),
    onResendMessageClick () {
      this.resendVerificationMessage({
        email: this.registeredEmail
      }).then(response => {
        global.toastr['success']('Email successfully sent', 'Success')
      }).catch(() => {
        global.toastr['error']('Failed to send email', 'Error')
      })
    }
  }
}
</script>