<template>
  <div class="base-text-area"
       :class="[
           {'base-text-area--invalid': isValidationStateVisible && !isValid},
           {'base-text-area--required': isRequired}
       ]"
  >
    <label class="base-text-label" v-if="label">{{ label }}</label>

    <div class="base-text-area__input-container">
      <textarea
          :value="value"
          @input="$emit('input', $event.target.value)"
          @blur="onBlur"
          @focus="$emit('focus')"
          :placeholder="placeholder"
          :disabled="disabled"
          :rows="rows"
      />
    </div>

    <div class="base-text-area__error-container"
         v-if="errors && errors.length > 0 && touched"
    >
      <div class="base-text-area__error-container__error"
           v-for="(error, index) of errors"
           :key="index"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import FormFieldValidationMixin from "@/mixins/form-field-validation.mixin";

export default {
  mixins: [
    FormFieldValidationMixin
  ],
  props: {
    value: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 3
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-text-area {

  &__input-container {
    position: relative;
  }

  textarea {
    background: $white;
    border: 1px solid $gray-light;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 12px 13px;
    width: 100%;
    outline: 0;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: $text-medium;

    &::placeholder {
      color: rgba($text-medium, 0.5);
    }

    &:focus {
      border: 1px solid $blue-medium;
    }

    &:disabled {
      border-color: $gray-light;
      background-color: rgba(#C8CCD5, 0.15);
      cursor: not-allowed;
    }
  }

  label {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 41px;
    color: $text-medium;
    margin-right: 30px;
  }

  &__error-container {
    &__error {
      font-family: Fira Sans;
      font-style: italic;
      font-weight: 300;
      font-size: 12px;
      line-height: 28px;
      color: $text-medium;
    }
  }

  &--small {
    textarea {
      padding: 7px 13px;
      line-height: 16px;
      &:focus {
        line-height: 14px;
      }
    }

    label {
      line-height: 30px;
    }
  }

  &--multiline {
    label {
      display: block;
    }
  }

  &--invalid {
    textarea {
      border-color: $danger;
    }
  }

  &--required {
    label:after {
      content: '*';
      color: $danger;
      margin-left: 5px;
      font-size: 12px;
    }
  }
}
</style>