<template>
  <div class="base-radio">
    <input
        type="radio"
        :name="name"
        :checked="isChecked"
        :disabled="disabled"
        ref="radioInput"
    />
    <div
        class="radio-display"
        @click="onClick()"
        ref="radioDisplay">
      <v-icon class="checked-icon">lens</v-icon>
    </div>
    <label
        class="base-radio-label"
        @click="onLabelClick">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'BaseRadio',
  props: {
    value: {
      type: String,
      default: ''
    },
    radioValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isChecked: function () {
      return this.value === this.radioValue
    }
  },
  methods: {
    onClick () {
      this.$emit('input', this.radioValue)
    },
    onLabelClick () {
      this.$refs.radioDisplay.click()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-radio {
  display: inline-block;
  cursor: pointer;

  label {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: $text-dark;
    margin-left: 15px;
    vertical-align: middle;
    cursor: pointer;
  }

  // Hide actual radio button
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .radio-display {
    display: inline-block;
    line-height: 20px;
    text-align: center;
    width: 20px;
    height: 20px;
    background-color: $white;
    border-radius: 10px;
    border: 2px solid #C4C4C4;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
    vertical-align: middle;

    .checked-icon {
      color: $green-medium;
      font-size: 8px;
      visibility: hidden;
      display: inline;
      position: relative;
      top: -6px;

      transition: none;
    }
  }

  input:checked ~ .radio-display {
    background-color: rgba(#65D965, 0.3);
    border-color: $green-medium;

    .checked-icon {
      visibility: visible;
    }
  }
}
</style>