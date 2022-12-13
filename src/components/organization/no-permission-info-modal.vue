<template>
  <base-modal
      class="no-permissions-info-modal"
      :show="show"
      @close="close"
      max-width="430px"
  >
    <template v-slot:header>
      <div class="no-permissions-info-modal__header">
        <v-layout row wrap>
          <v-flex xs12>
            <div class="no-permissions-info-modal__title">No Workspace Permissions</div>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:default>
      <div class="no-permissions-info-modal__content">
        <v-layout row wrap>
          <v-flex xs12>
            <div class="no-permissions-info-modal__content__desctiption">You can not perform any actions on this workspace. Please ask your administrator to assign you roles</div>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:footer>
      <div class="no-permissions-info-modal__footer">
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

export default {
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
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

.no-permissions-info-modal {
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
  }

  &__footer {
    margin-top: 30px;

    .base-button {
      margin-right: 24px;
    }
  }
}

</style>