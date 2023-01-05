<template>
  <base-text-input
      class="protected-input"
      :value="value"
      @input="$emit('input', $event)"
      :placeholder="placeholder"
      :label="label"
      :disabled="disabled"
      :validations="validations"
      :show-validation-state="showValidationState"
      :suppress-validation-state-display="suppressValidationStateDisplay"
      :type="isHidden ? 'password' : 'text'"
  >
    <v-icon @click="onHideTriggerClick">
      {{ isHidden ? 'visibility' : 'visibility_off' }}
    </v-icon>
  </base-text-input>
</template>

<script>
import BaseTextInput from "@/components/v2/base-text-input";

export default {
  name: 'protected-input',
  components: {
    BaseTextInput
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validations: {
      type: Object,
      required: false
    },
    showValidationState: {
      type: Boolean,
      default: false
    },
    suppressValidationStateDisplay: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isHidden: true
    }
  },
  methods: {
    onHideTriggerClick () {
      this.$set(this, 'isHidden', !this.isHidden)
    }
  }
}
</script>

<style lang="scss" scoped>
.protected-input {

  .v-icon {
    user-select: none;
  }
}
</style>