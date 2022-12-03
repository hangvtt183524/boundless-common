<template>
  <v-app>
    <v-content>
      <v-container class="error-container" fluid fill-height>
        <v-layout class="align-center justify-center">
          <v-flex xs12 sm7 md4>
            <v-card class="pa-4">
              <v-card-text>
                <div class="logo-container">
                  <img class="logo-image" src="@/assets/images/boundless-logo.png">
                  <h3 class="logo-text">BOUNDLESS</h3>
                </div>

                <v-flex class="text-xs-center mt-3">
                  <h1>{{ errorCode }}</h1>
                  <h2>{{ shortErrorMessage }}</h2>
                  <p>{{ longErrorMessage }}</p>
                  <a class="my-5" @click="redirect">Click here to continue</a>
                  <small>You will be automatically redirected to the home page if you perform no action</small>

                  <interval-progress :increment="20" @finish="redirect" />
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
import IntervalProgress from "@/components/common/interval-progress";

const errorCodeMessage = {
  "error404ShortMessage": "Resource Not Found",
  "error404LongMessage": "The resource you're looking for doesn't exist at this address.",
  "error500ShortMessage": "Internal Server Error",
  "error500LongMessage": "An unknown error occurred. Please try again later.",
  "error403ShortMessage": "You do not have permission to perform this action"
}

export default {
  props: {
    errorCode: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    IntervalProgress
  },
  beforeRouteEnter (to, from, next) {
    const validErrorCodes = [
      '404',
      '500'
    ]
    const errorCode = to.params.errorCode.toString()
    if (!validErrorCodes.includes(errorCode) && errorCode !== '404') {
      next({ name: 'error', params: { errorCode: '404' } })
    } else {
      next()
    }
  },
  computed: {
    shortErrorMessage () {
      return errorCodeMessage[`error${this.errorCode}ShortMessage`]
    },
    longErrorMessage () {
      return errorCodeMessage[`error${this.errorCode}LongMessage`]
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: 'home' }).catch(error => {})
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/_logo-container.scss";

html {
  overflow-y: auto !important;
}

.error-container {
  flex: 1;
  background: url('../../assets/images/background.png') no-repeat center center;
  background-size: cover;

  h1, h2 {
    text-transform: uppercase;
    margin-top: 0;
  }

  h1 {
    font-size: 120px;
    margin-bottom: 0;
    color: #ccc;
  }

  h2 {
    font-size: 32px;
    color: #0D2B3B;
    margin-bottom: 20px;
  }

  p {
    color: #0D2B3B;
    font-size: 16px;
  }

  small {
    margin: 20px;
    font-style: italic;
    font-size: 13px;
    color: #888;
    display: block;
  }
}
</style>