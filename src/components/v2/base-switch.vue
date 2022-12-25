<template>
  <div class="base-switch-container">
    <label class="base-switch-label" v-if="label">
      {{ label }}
    </label>

    <div class="base-switch"
         :class="[
             {'base-switch--disabled': disabled},
             {'base-switch--fluid': (!!yesLabel || !!noLabel)}
         ]"
    >
      <div class="base-switch__options">
        <div class="base-switch__option yes-option"
             :class="{'base-switch__option--active': value === true}"
             @click="onOptionClick(true)"
        >
          {{ yesLabel ? yesLabel : 'Yes' }}
        </div>

        <div class="base-switch__option yes-option"
             :class="{'base-switch__option--active': value === false}"
             @click="onOptionClick(false)"
        >
          {{ noLabel ? noLabel : 'No' }}
        </div>
      </div>

      <v-icon class="base-switch__clear-icon clear-icon" v-if="clearActionVisible" @click.stop="onClearClick()">
        | close
      </v-icon>
    </div>
  </div>
</template>

<script>
import ClearableFormFieldMixin from "@/mixins/clearable-form-field.mixin";

export default {
  name: 'base-switch',
  mixins: [
    ClearableFormFieldMixin
  ],
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    yesLabel: {
      type: String,
      required: false
    },
    noLabel: {
      type: String,
      required: false
    }
  },
  methods: {
    onOptionClick (value) {
      if (this.disabled) {
        return
      }

      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-switch-container {

  label {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 41px;
    color: $text-medium;
    margin-right: 30px;
  }

  .base-switch {
    box-sizing: border-box;
    display: inline-block;
    white-space: nowrap;

    &__options {
      display: inline-block;
      vertical-align: middle;
    }

    &__option {
      display: inline-block;
      width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: $white;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      color: $text-medium;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      &:first-child {
        border-radius: 4px 0 0 4px;
        border: 1px solid $blue-reserve;
        border-right-width: 0;
      }

      &:last-child {
        border-radius: 0 4px 4px 0;
        border: 1px solid $blue-reserve;
        border-left-width: 0;
      }

      &--active {
        background-color: $blue-reserve;
        color: $white;
      }
    }

    &__clear-icon {
      margin-left: 10px;

      line-height: 30px;
      color: rgba($text-medium, 0.5);
      font-size: 20px;
      vertical-align: middle;
    }

    &--fluid {
      .base-switch__option {
        width: auto;
        padding: 0 20px;
      }
    }

    &--disabled {
      .base-switch__option {
        cursor: not-allowed;

        &:first-child {
          border-color: $gray-light;
        }

        &:last-child {
          border-color: $gray-light;
        }

        &--active {
          background-color: rgba(#C8CCD5, 0.15);
          color: $text-medium;
        }
      }
    }
  }

  &--multiline {
    label {
      display: block;
    }
  }
}
</style>