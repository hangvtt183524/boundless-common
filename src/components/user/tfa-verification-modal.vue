<template>
  <base-modal
      class="tfa-verification-modal"
      :show="show"
      @close="close"
      max-width="540px"
  >
    <template v-slot:header>
      <div class="tfa-verification-modal__header">
        <v-layout row wrap>
          <v-flex xs12>
            <div class="tfa-verification-modal__title">
              | Verify 2-factor Authentication Settings
            </div>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:default>
      <div class="tfa-verification-modal__content">
        <v-layout row wrap>
          <v-flex xs12>
            <div class="tfa-verification-modal__content__description"
                 v-if="targetTfaMode === 'google_authenticator'"
            >
              | Enter the code in your Google Authenticator app to activate 2fa. To add Boundless to your Google Authenticator app, simply scan the QR code with your Google Authenticator app, or enter the code below manually
            </div>

            <div class="tfa-verification-modal__content__description"
                 v-if="targetTfaMode === 'sms'"
            >
              | Enter the code we have sent to your mobile number to activate 2fa
            </div>

            <div class="tfa-verification-modal__content__description"
                 v-if="targetTfaMode === 'disabled' && verifiedTfaMode === 'google_authenticator'"
            >
              | Enter the code we have sent to your mobile number to activate 2fa
            </div>

            <div class="tfa-verification-modal__content__description"
                 v-if="targetTfaMode === 'disabled' && verifiedTfaMode === 'sms'"
            >
              | Enter the code we have sent to your mobile number to disable 2fa
            </div>
          </v-flex>

          <v-flex
              class="tfa-verification-modal__content__qr-code-container"
              xs12
              mt-3
              v-if="targetTfaMode === 'google_authenticator' || (targetTfaMode === 'disabled' && verifiedTfaMode === 'google_authenticator')"
          >
            <qrcode-vue
                v-if="tfaSecretData.provisioning_uri"
                :value="tfaSecretData.provisioning_uri"
                :size="200"
            />
          </v-flex>

          <v-flex xs12 mt-3>
            <div
                class="tfa-verification-modal__content__secret-text"
                v-if="tfaSecretData.tfa_secret && (targetTfaMode === 'google_authenticator' || (targetTfaMode === 'disabled' && verifiedTfaMode === 'google_authenticator'))"
            >
              | {{ tfaSecretData.tfa_secret }}
            </div>
          </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-flex xs6 mt-3>
            <base-text-input
                v-model="code"
                :validations="{ required: true }"
                placeholder="Code"
            />
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:footer>
      <div class="tfa-verification-modal__footer">
        <v-layout row wrap>
          <v-flex xs12>
            <base-button
                :disabled="!code"
                class="base-button--green"
                @click="onSubmitClick"
                :loading="saving"
            >
              Submit
            </base-button>
          </v-flex>

          <base-button class="base-button--green--negative" @click="close">
            Cancel
          </base-button>
        </v-layout>
      </div>
    </template>

    <div class="tfa-verification-modal__loading-indicator" v-if="loading">
      <v-progress-circular :size="50" indeterminate color="#15ac2f" />
    </div>
  </base-modal>
</template>

<script>
import BaseModal from "@/components/v2/base-modal";
import BaseTextInput from "@/components/v2/base-text-input";
import BaseButton from "@/components/v2/base-button";
import {mapActions, mapGetters} from "vuex";
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
    QrcodeVue
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      saving: false,
      tfaSecretData: {},
      code: null,
      token: null
    }
  },
  watch: {
    show: {
      handler (val) {
        if (val) {
          // Reset form data
          this.code = null
          this.token = null

          this.fetchUserTfaSecretData()
          this.createUserTfaSettingsVerificationCode()
        }
      }
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    targetTfaMode () {
      return this.currentUser.tfa_settings ? this.currentUser.tfa_settings.tfa_mode : null
    },
    verifiedTfaMode () {
      return this.currentUser.tfa_settings ? this.currentUser.tfa_settings.verified_tfa_mode : 'disabled'
    }
  },
  methods: {
    ...mapActions('user', ['fetchUserTfaSecret', 'generateUserTfaVerificationCode', 'verifyUserTfaSettings']),
    close () {
      this.$emit('close')
    },
    onSubmitClick () {
      this.loading = true
      this.saving = true
      this.verifyUserTfaSettings({
        userId: this.currentUser.id,
        token: this.token,
        code: this.code
      }).then(response => {
        global.toastr['success']('Successfully verified 2-factor authentication settings for your account', 'Success')
        this.close()
      }).finally(() => {
        this.loading = false
        this.saving = false
      })
    },
    fetchUserTfaSecretData () {
      this.loading = true
      this.fetchUserTfaSecret(this.currentUser.id).then(response => {
        this.$set(this, 'tfaSecretData', response.data.data)
      }).finally(() => {
        this.loading = false
      })
    },
    createUserTfaSettingsVerificationCode () {
      this.loading = true
      this.generateUserTfaVerificationCode(this.currentUser.id).then(response => {
        this.$set(this, 'token', response.data.data.token)
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.tfa-verification-modal {
  position: relative;

  &__header {

  }

  &__title {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    color: $blue-dark;
  }

  &__content {
    margin-top: 16px;

    &__qr-code-container {
      text-align: center;
    }

    &__secret-text {
      font-weight: bold;
      text-align: center;
    }
  }

  &__footer {
    margin-top: 30px;

    .base-button {
      margin-right: 24px;
    }
  }

  &__loading-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.6);
  }
}

</style>