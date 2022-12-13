<template>
  <base-modal
      class="security-checks-failure-info-modal"
      :show="show"
      @close="close"
      max-width="640px"
  >
    <template v-slot:header>
      <div class="security-checks-failure-info-modal__header">
        <v-layout row wrap>
          <v-flex xs12>
            <div class="security-checks-failure-info-modal__title">
              Security checks failed for accessing {{ selectedOrganization.name }} workspace
            </div>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:default>
      <div class="security-checks-failure-info-modal__content">
        <v-layout row wrap>
          <v-flex xs12>
            <ul>
              <li v-for="(value, check) in userSecurityChecks.failed_checks" :key="check">
                | {{ securityCheckErrors[check].replace('{value}', value) }}
              </li>
            </ul>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:footer>
      <div class="security-checks-failure-info-modal__footer">
        <v-layout row wrap>
          <v-flex xs12>
            <base-button class="base-button--green--negative" @click="close">
              Close
            </base-button>
          </v-flex>
        </v-layout>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "@/components/v2/base-modal";
import BaseButton from "@/components/v2/base-button";
import {mapGetters} from "vuex";

export default {
  components: {
    BaseModal,
    BaseButton
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    ...mapGetters('workspace', ['userSecurityChecks'])
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      securityCheckErrors: {
        "password_expiration_frequency": "You need to change your password every {value} days",
        "password_variety_limit": "Your last {value} passwords must be different then each other",
        "is_strong_password_required": "You need to have a strong password (min. 8 characters, includes 3 of: lowercase letters, uppercase letters, digits, special characters)",
        "is_tfa_required": "You need to have 2-factor authentication enabled.",
        "ip_restrictions": "You need to connect from an allowed ip address. Please contact your workspace administrator."
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.security-checks-failure-info-modal {
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

    li {
      margin-top: 10px;
    }
  }

  &__footer {
    margin-top: 30px;

    .base-button {
      margin-right: 24px;
    }
  }
}

</style>