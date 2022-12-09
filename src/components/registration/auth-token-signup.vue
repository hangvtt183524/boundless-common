<template>
  <v-app>
    <v-content>
      <v-container class="oauth-signup" fluid fill-height>
        <v-layout class="align-center justify-center">
          <v-flex xs12 sm7 md3>
            <v-card class="pa-4">
              <v-card-text>
                <div class="logo-container">
                  <img class="logo-image" src="@/assets/images/boundless-logo.png">
                  <p class="tag-line">Welcome to </p>
                  <h3 class="logo-text">BOUNDLESS</h3>
                </div>

                <registration-form class="mt-5" submit-text="Complete Sign up" />
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import RegistrationForm from "@/components/registration/registration-form";
export default {
  name: 'Auth-Token-Signup',
  components: {
    RegistrationForm
  },
  props: {
    organizationSlug: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss">
@import 'styles/_logo-container.scss';

.oauth-signup {
  flex: 1;
  background: url('../../assets/images/background.png') no-repeat center center;
  background-size: cover;

  .tag-line {
    margin-top: 20px;
  }
}

html {
  overflow-y: auto !important;
}
</style>