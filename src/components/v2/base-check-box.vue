<template>
  <div
      :class="['base-check-box', {'base-check-box--disabled': disabled}]"
      @click="stopPropagation"
  >
    <input
        type="checkbox"
        :checked="value"
        @change="onChange"
        :disabled="disabled"
        ref="checkInput"
    />
    <div class="check-box-display" @click="onClick()">
      <v-icon class="checked-icon">check</v-icon>
    </div>
    <label class="base-check-box-label" v-if="label" @click="onClick()">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'BaseCheckBox',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick () {
      if (this.disabled) {
        return false
      }

      this.$emit('click')
      this.$refs.checkInput.click()
    },
    onChange ($event) {
      this.$emit('input', $event.target.checked)
    },
    stopPropagation ($event) {
      $event.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-check-box {
  display: inline-block;
  overflow: hidden;

  label {
    cursor: pointer;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: $text-dark;
    padding-left: 15px;
    user-select: none;
  }

  // Hide actual checkbox
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .check-box-display {
    width: 20px;
    height: 20px;
    float: left;
    background-color: $white;
    border-radius: 2px;
    border: 2px solid #C4C4C4;
    display: flex;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;

    .checked-icon {
      color: $white;
      font-size: 16px;
      visibility: hidden;
    }
  }

  input:checked ~ .check-box-display {
    background-color: $green-medium;
    border-color: $green-medium;

    .checked-icon {
      visibility: visible;
    }
  }

  &--small {
    .check-box-display {
      width: 14px;
      height: 14px;

      .checked-icon {
        font-size: 10px;
      }
    }
  }

  &--disabled {
    label {
      cursor: not-allowed;
    }

    .check-box-display {
      cursor: not-allowed;
    }
  }
}
</style>