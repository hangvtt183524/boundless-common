<template>
  <div :class="['base-text-input', {'base-text-input--invalid': isValidationStateVisible && !isValid}, {'base-text-input--required': isRequired}, {'base-text-input--has-pre-icon': preIcon}, {'base-text-input--suggestions-visible': suggestionsVisible}, {'base-text-input--suggestions-upwards': isUpwards}]">
    <label class="base-text-label" v-if="label">
      {{ label }}
    </label>

    <div class="base-text-input__input-container" ref="dropdownHandle">
      <v-icon class="base-text-input__pre-icon" v-if="preIcon">
        {{ preIcon }}
      </v-icon>

      <input
          :type="type"
          v-model="inputValue"
          @blur="onBlur"
          @focus="onFocus"
          @keyup.enter="$emit('enterKeyUp')"
          @keypress="onKeyPress"
          @paste="onPaste"
          :placeholder="placeholder"
          :disabled="disabled"
          ref="inputElement"
          :maxlength="maxLength"
          :min="min !== -1 ? min : 'none'"
          :max="max !== -1 ? max : 'none'"
          v-mask="mask"
          :autocomplete="autocomplete"
          :title="title"
      />

      <slot></slot>
    </div>

    <div
        class="base-text-input__suggestions"
        v-if="suggestions && suggestions.length > 0"
        v-show="(visibleSuggestions && visibleSuggestions.length) && menuVisible"
        ref="options"
    >
      <perfect-scrollbar class="base-text-input__suggestions__scroll-holder" :options="scrollBarOptions">
        <div
            class="base-text-input__suggestions__suggestion"
            v-for="(suggestion, index) of visibleSuggestions"
            :key="index"
            @mousedown="onOptionClick(suggestion)"
        >
          {{ suggestion }}
        </div>
      </perfect-scrollbar>
    </div>

    <div
        class="base-text-input__error-container"
        v-if="errors && errors.length > 0 && touched"
    >
      <div
          class="base-text-input__error-container__error"
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
import DropdownItemMixin from "@/mixins/dropdown-item.mixin";
import _ from 'lodash'

export default {
  props: {
    value: {
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    preIcon: {
      type: String,
      required: false
    },
    maxLength: {
      type: Number,
      default: 524288 // Browser default value
    },
    min: {
      type: Number,
      default: -1 // Non-number value means no limit
    },
    max: {
      type: Number,
      default: -1 // Non-number value means no limit
    },
    forbiddenCharacters: {
      type: Array,
      default: () => { return [] }
    },
    mask: {
      required: false
    },
    autocomplete: {
      type: String,
      default: 'new-password' // Workaround to prevent browser autocomplete, works in cases where 'off' doesn't work
    },
    title: {
      type: String,
      required: false
    },
    suggestions: {
      required: false
    }
  },
  data () {
    return {
      inputValue: '',
      hasFocus: false,
      localSuggestions: [],
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  mounted () {
    this.inputValue = this.value || ''
  },
  mixins: [
    FormFieldValidationMixin,
    DropdownItemMixin
  ],
  computed: {
    effectiveSuggestions () {
      if (!this.suggestions) {
        return null
      }

      if (this.suggestions && this.suggestions.constructor === Array) {
        return this.suggestions
      }

      if (this.suggestions && this.suggestions.constructor === Function) {
        return this.localSuggestions
      }

      return null
    },
    visibleSuggestions () {
      if (!this.effectiveSuggestions) {
        return null
      }

      return this.inputValue
          ? this.effectiveSuggestions.filter(suggestion =>
              suggestion.toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1
          )
          : this.effectiveSuggestions
    },
    suggestionsVisible () {
      return (this.visibleSuggestions && this.visibleSuggestions.length) && this.menuVisible
    }
  },
  methods: {
    onFocus () {
      this.$emit('focus')

      if (this.suggestions) {
        this.showOptions()
      }

      this.hasFocus = true
    },
    onBlur: function () {
      if (this.suggestions) {
        this.hideOptions()
      }

      this.hasFocus = false

      FormFieldValidationMixin.methods.onBlur.bind(this)()
    },
    onKeyPress (event) {
      if (event.key === 'Enter') {
        // Do not process enter key
        return
      }

      this.testForbiddenCharacters(event, event.key)
    },
    onPaste (event) {
      this.testForbiddenCharacters(event, event.clipboardData.getData('text'))
    },
    testForbiddenCharacters (event, text) {
      if (this.forbiddenCharacters.length === 0) {
        return
      }

      const forbiddenCharactersRegex = new RegExp(`(${this.forbiddenCharacters.join('|')})`, 'g')
      if (forbiddenCharactersRegex.test(text)) {
        event.preventDefault()
      }
    },
    onOptionClick (item) {
      this.inputValue = item
    },
    fetchSuggestions: _.debounce(function (searchText) {
      this.suggestions(this.inputValue).then(suggestions => {
        this.localSuggestions = suggestions
      })
    }, 400),
  },
  watch: {
    inputValue () {
      if (this.inputValue !== this.value) {
        this.$emit('input', this.inputValue)

        if (this.suggestions && this.suggestions.constructor === Function) {
          // A function provided for suggestions, call it on value change
          this.fetchSuggestions()
        }
      }
    },
    value () {
      if (this.inputValue !== this.value) {
        this.inputValue = this.value
      }
    },
    suggestions (newVal, oldVal) {
      if (!oldVal && newVal && this.hasFocus) {
        this.showOptions()
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "styles/v2/colors.scss";

.base-text-input {

&__input-container {
   position: relative;
 }

input {
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
  line-height: 16px;
  color: $text-medium;

&::placeholder {
   color: rgba($text-medium, 0.5);
 }

&:focus {
   border: 2px solid $blue-medium;
   padding: 11px 12px;
 }

&:disabled {
   border-color: $gray-light;
   background-color: rgba(#C8CCD5, 0.15);
   cursor: not-allowed;
 }
}

&__pre-icon.v-icon {
   position: absolute;
   top: 50%;
   left: 13px;
   transform: translate(0,-50%);
   font-size: 16px;
   color: $blue-reserve;
 }

.v-icon:not(.base-text-input__pre-icon) {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translate(0,-50%);
  opacity: .5;
  font-size: 18px;
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

&__suggestions {
   position: fixed;
   background-color: $white;
   z-index: 999;

   border: 1px solid $blue-medium;
   border-bottom-left-radius: 4px;
   border-bottom-right-radius: 4px;
   box-sizing: border-box;
   overflow: hidden;

&__scroll-holder {
   max-height: 240px;
 }

&__suggestion {
   padding: 0 13px;
   font-family: Fira Sans;
   font-style: normal;
   font-weight: normal;
   font-size: 14px;
   line-height: 36px;
   color: $text-dark;
   cursor: pointer;

&:hover {
   background: $gray-xlight;
   color: $blue-medium;
 }

&:nth-child(2n + 1):not(:hover) {
   background-color: rgba($gray-xlight, 0.5);
 }
&:nth-child(2n):not(:hover) {
   background-color: $white;
 }
}
}

&--suggestions-visible:not(.base-text-input--suggestions-upwards) {
input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
}

&--suggestions-visible.base-text-input--suggestions-upwards {
input {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
}

&--suggestions-upwards {
.base-text-input__suggestions {
  border-radius: 4px  4px 0 0;
}
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
input {
  padding: 7px 13px;
  line-height: 16px;
&:focus {
   padding: 6px 12px;
 }
}

label {
  line-height: 30px;
}

.base-text-input__suggestions {
&__suggestion {
   line-height: 26px;
 }
}
}

&--multiline {
label {
  display: block;
}
}

&--invalid {
input {
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

&--has-pre-icon {
input {
  padding-left: 40px;

&:focus {
   padding-left: 39px;
 }
}
}
}

</style>