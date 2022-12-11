<template>
  <div data-test="signup-page">
    <p class="login-text">Sign up now to create your Boundless account</p>
    <registration-form />
    <v-layout row class="mt-3">
      <v-flex xs12 class="text-xs-center">
        <router-link class="login-layout-link" to="/login">Already have an account?</router-link>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import RegistrationForm from "@/components/registration/registration-form";

export default {
  name: 'Register',
  components: {
    RegistrationForm
  }
}
</script>