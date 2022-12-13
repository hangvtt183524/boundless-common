<template>
  <div class="saml-router"></div>
</template>

<script>
import ErrorHandlerMixin from "@/mixins/error-handler.mixin";
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import {mapActions} from "vuex";

export default {
  name: 'saml-router',
  mixins: [
      ErrorHandlerMixin,
      NodeSelectionsMixin
  ],
  data () {
    return {
      samlStates: {
        loggedIn: 'logged_in',
        registration: 'registration',
        login: 'login'
      },
      state: null,
      token: null,
      loading: false
    }
  },
  mounted() {
    this.initialize()
  },
  methods: {
    ...mapActions('auth', ['loginSaml', 'unsetUser']),
    ...mapActions('layout', ['fetchUserWorkspaces']),
    initialize () {
      this.unsetUser()
      this.samlState = this.$route.query.state
      this.token = this.$route.query.saml_token

      if (this.samlState === this.samlStates.loggedIn) {
        this.loginWithSamlToken()
      } else if (this.samlState === this.samlStates.registration) {
        this.$router.push({ name: 'register', query: this.$route.query })
      } else if (this.samlState === this.samlStates.login) {
        this.$router.push({ name: 'login', query: this.$route.query })
      }
    },
    loginWithSamlToken () {
      this.loading = true
      this.loginSaml({
        saml_token: this.token
      }).then(response => {
        this.$router.replace({ query: {} })
        this.fetchUserWorkspaces().then(() => {
          this.selectActiveWorkspace()
        })
      }).catch(error => {
        this.setErrorData(error)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>