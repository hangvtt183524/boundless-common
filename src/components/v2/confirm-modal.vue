<template>
  <base-modal
      class="confirm-modal"
      :show="show"
      @close="close"
      max-width="540px">
    <template v-slot:header>
      <div class="confirm-modal--header">
        <v-layout>
          <v-flex xs12>
            <div class="confirm-modal--title">{{ title }}</div>
          </v-flex>
        </v-layout>
      </div>
    </template>
    <template v-slot:default>
      <div class="confirm-modal--content">
        <v-layout>
          <v-flex xs12>
            <div>
              <span v-html="text"></span>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </template>
    <template v-slot:footer>
      <div class="confirm-modal--footer">
        <v-layout>
          <v-flex xs12>
            <base-button
                class="base-button--green base-button--large confirm-button"
                @click=onConfirmClick>Continue</base-button>
            <base-button
                class="base-button--green--negative base-button--large cancel-button"
                @click="onCancelClick">Cancel</base-button>
          </v-flex>
        </v-layout>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseButton from "@/components/v2/base-button";
import BaseModal from "@/components/v2/base-modal";

export default {
  name: 'confirm-modal',
  components: { BaseModal, BaseButton },
  data: function () {
    return {
      resolve: null,
      reject: null,
      title: null,
      text: null,
      show: false
    }
  },
  methods: {
    open (title, text) {
      this.title = title
      this.text = text
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onConfirmClick () {
      this.resolve(true)
      this.show = false
    },
    onCancelClick () {
      this.resolve(false)
      this.show = false
    },
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.confirm-modal {

  &--header {

  }

  &--title {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 30px;
    line-height: 26px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-align: center;
    color: $blue-dark;
  }

  &--content {
    width: 360px;
    margin: 60px auto;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    color: black;
  }

  &--footer {
    margin-top: 50px;
    text-align: center;

    .base-button {
      width: 160px;

      &:first-child {
        margin-right: 24px;
      }
    }
  }
}

</style>