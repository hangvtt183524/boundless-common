<template>
  <v-layout align-center fill-height justify-center>
    <v-progress-circular
        :color="color"
        :size="size"
        indeterminate
        data-test-loader
    />
  </v-layout>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 50
    },
    color: {
      type: String,
      default: 'primary'
    }
  }
}
</script>