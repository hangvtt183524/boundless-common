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
                  <p class="tag-line">Welcome to</p>
                  <h3 class="logo-text">BOUNDLESS</h3>
                </div>
                <registration-form
                    class="mt-5"
                    submit-text="Complete Sign up"
                    :identity-providers="identityProviders"
                    v-if="invitationValid"
                />
                <p class="alert" v-if="invitationValid === false">
                  Invitation key is invalid
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import RegistrationForm from './registration-form'
import { mapActions } from "vuex";

export default {
  name: 'Register',
  components: {
    RegistrationForm
  },
  props: {
    organizationSlug: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      invitationValid: null,
      identityProviders: []
    }
  },
  mounted() {
    // Check validity of invitation key and email, if valid, show registration form. Otherwise display a related error
    // message
    this.formData = Object.assign({}, this.formData, this.$route.query)
    if (this.formData.invitation_key) {
      this.checkInvitation({
        invitation_key: this.formData.invitation_key,
        email: this.formData.email
      }).then(response => {
        if (response.data.data.is_valid) {
          this.invitationValid = true
        } else {
          this.invitationValid = false
        }
      })
    }

    // If we are on an organization specific invitation page, fetch organization identity providers
    if (this.organizationSlug) {
      this.getOrganizationIdentityProviders()
    }
  },
  methods: {
    ...mapActions('user', ['checkInvitation']),
    ...mapActions('auth', ['fetchNodeIdentityProviders']),
    getOrganizationIdentityProviders () {
      this.loading = true
      this.fetchNodeIdentityProviders(this.organizationSlug).then(response => {
        this.$set(this, 'identityProviders', response.data.data)
      }).catch(error => {
        this.setErrorData(error)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import 'styles/_logo-container.scss';
.invite-signup {
  flex: 1;
  background: url('../../assets/images/background.png') no-repeat center center;
  background-size: cover;

  .tag-line {
    margin-top: 20px;
  }
  .alert {
    margin-top: 20px;
    color: red;
    text-align: center;
    font-size: 18px;
  }
}

html {
  overflow-y: auto !important;
}
</style>