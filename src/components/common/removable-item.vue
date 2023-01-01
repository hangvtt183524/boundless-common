<template>
  <v-fade-transition>
    <div>
      <v-layout row wrap class="removable-item">
        <v-flex xs11>
          <v-layout row wrap>
            <slot></slot>
          </v-layout>
        </v-flex>

        <slot name="action">
          <v-flex xs1 :class="actionClass">
            <v-btn class="btn__close"
                   :disabled="!removable"
                   color="error"
                   fab flat small
                   @click.stop="$emit('remove')"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </slot>
      </v-layout>
    </div>
  </v-fade-transition>
</template>

<script>
export default {
  props: {
    removable: {
      type: Boolean,
      default: true
    },
    actionClass: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.removable-item {
  background-color: white;
  border-radius: 5px;
}
</style>