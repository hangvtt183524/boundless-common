<template>
  <v-dialog
      class="base-modal"
      v-model="showDialog"
      :max-width="maxWidth"
      :persistent="persistent"
      no-click-animation
  >
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '920'
    },
    persistent: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.show
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "styles/v2/colors.scss";

.v-dialog {

  &__content {
    &--active {
      background-color: rgba($blue-dark, .9);
    }
  }
}
</style>