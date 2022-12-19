<template>
  <v-text-field
      :rules="rules"
      :counter="showMaxLength ? maxLength : false"
      :value="value"
      @input="inputHandler"
      @focus="showMaxLength = true"
      @blur="blurHandler"
      v-bind="$attrs"
  />
</template>

<script>
import { VTextField } from 'vuetify'
export default {
  extends: VTextField,
  props: {
    value: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 64
    }
  },
  data () {
    return {
      showMaxLength: false
    }
  },
  computed: {
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxLength || `Max ${this.maxLength} characters`
      }
      return [maxRule]
    }
  },
  methods: {
    blurHandler () {
      this.showMaxLength = false
      this.$emit('blur')
    },
    inputHandler ($event) {
      this.$emit('input', $event)
    }
  }
}
</script>