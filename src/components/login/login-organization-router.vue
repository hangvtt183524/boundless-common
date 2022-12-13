<template>
  <div data-test="login-page">
    <p class="login-text">Enter your workspace slug to be redirected to your workspace-specific login page</p>
    <v-layout row>
      <v-flex xs12>
        <v-text-field
            v-model='organizationSlug'
            required
            label="Slug"
        />
      </v-flex>
    </v-layout>

    <v-layout row class="mt-4">
      <v-flex xs12>
        <v-btn
            class="success white--text"
            round
            block
            type="button"
            @click="onContinueClick"
            :disabled="!organizationSlug"
        >
          Continue
        </v-btn>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="mt-3">
      <v-flex xs6>
        <router-link class="login-layout-link" to="/login">Back to Login</router-link>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'LoginOrganizationRouter',
  data () {
    return {
      organizationSlug: ''
    }
  },
  methods: {
    onContinueClick () {
      this.$router.push({ path: '/login/' + this.organizationSlug })
      // EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_IN_VIA_SSO)
    }
  }
}
</script>