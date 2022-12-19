<template>
  <div class="tfa-info-panel">
    <panel-container class="tfa-info-panel__panel" title="2-factor authentication settings">
      <v-form slot-scope="{readonly}">
        <v-layout row wrap>
          <v-flex xs12>
            <v-select
                class="mode"
                :items="tfaModeOptions"
                label="Authentication mode"
                :readonly="readonly"
                item-text="display_name"
                placeholder="--"
                v-model="formData.tfa_mode"
            />
          </v-flex>

          <v-flex xs12  v-if="pendingTfaVerification && !isValueChanged">
            <div class="tfa-verification-warning">
              <v-icon class="tfa-verification-warning__icon warning"></v-icon>
              <span class="tfa-verification-warning__text">You need to complete verification for 2fa setting changes to take effect</span>
            </div>

            <div class="tfa-verification-trigger" @click="onTfaVerificationClick">
              | Click here to verify 2fa setting changes
            </div>
          </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-flex xs12 text-xs-right>
            <v-btn
                v-show="isValueChanged"
                :loading="isLoading"
                @click="submit()"
                color="success"
                round
            >
              Save
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </panel-container>

    <tfa-verification-modal :show="showTfaVerificationModal" @close="closeTfaVerificationModal" />
  </div>
</template>

<script>
import PanelContainer from "@/components/common/panel-container";
import TfaVerificationModal from "@/components/user/tfa-verification-modal";

import CurrentUserMixin from "@/mixins/current-user.mixin";
import ErrorHandlerMixin from "@/mixins/error-handler.mixin";
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'TfaInfo',
  components: {
    PanelContainer,
    TfaVerificationModal
  },
  mixins: [
      CurrentUserMixin,
      ErrorHandlerMixin
  ],
  data () {
    return {
      isLoading: false,
      formData: {
        tfa_mode: null
      },
      originalTfaMode: null,
      tfaModeOptions: [
        {
          display_name: "SMS",
          value: 'sms'
        },
        {
          display_name: "Google Authenticator",
          value: 'google_authenticator'
        },
        {
          display_name: "Disabled",
          value: 'disabled'
        }
      ],
      showTfaVerificationModal: false
    }
  },
  mounted() {
    this.setFormData()
  },
  computed: {
    ...mapGetters('user', ['userOptions', 'currentUser']),
    pendingTfaVerification () {
      return this.currentUser && this.currentUser.tfa_settings &&
          this.currentUser.tfa_settings.tfa_mode !== this.currentUser.tfa_settings.verified_tfa_mode
    },
    isValueChanged () {
      return this.formData.tfa_mode !== this.originalTfaMode
    }
  },
  methods: {
    ...mapActions('user', ['updateCurrentUser']),
    setFormData () {
      const tfaSettings = this.currentUser.tfa_settings
      this.formData = Object.assign({}, this.formData, {
        tfa_mode: tfaSettings ? tfaSettings.tfa_mode : null
      })

      this.originalTfaMode = this.formData.tfa_mode
    },
    onTfaVerificationClick () {
      this.showTfaVerificationModal = true
    },
    closeTfaVerificationModal () {
      this.showTfaVerificationModal = false
    },
    submit () {
      this.isLoading = true

      this.updateCurrentUser({ tfa_settings: this.formData }).then(response => {
        this.isLoading = false
        global.toastr['success']('Data saved successfully', 'Success')

        this.originalTfaMode = this.formData.tfa_mode

        if (this.pendingTfaVerification) {
          this.onTfaVerificationClick()
        }
      }).catch(err => {
        this.isLoading = false
        this.setErrorData(err)
      })
    },

  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.tfa-verification-warning {
  overflow: hidden;

  &__icon {
    vertical-align: middle;
    float: left;
  }

  &__text {
    vertical-align: middle;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 24px;
    float: left;
    width: 80%;
    margin-left: 20px;
  }
}

.tfa-verification-trigger {
  margin-left: 45px;
  cursor: pointer;
  font-family: Fira Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;
  color: $green-medium;
  text-decoration-line: underline;
}
</style>