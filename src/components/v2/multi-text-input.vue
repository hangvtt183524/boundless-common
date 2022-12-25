<template>
  <div class="multi-text-input"
       :class="[
           '.multi-text-input',
           {'multi-text-input--upwards': isUpwards},
           {'multi-text-input--active': menuVisible},
           {'multi-text-input--has-options': (displayedItems && displayedItems.length)},
           {'multi-text-input--invalid': isValidationStateVisible && !isValid},
           {'multi-text-input--required': isRequired}, {'multi-text-input--disabled': disabled}
       ]"
       @click="onElementClick"
       :tabindex="tabindex"
  >
    <label class="multi-text-input__label" v-if="label">
      {{ label }}
    </label>

    <div class="multi-text-input__handle-container">
      <div class="multi-text-input__input-container" ref="dropdownHandle">
        <div class="multi-text-input__selected-items">
          <div class="multi-text-input__selected-items__item"
               v-for="(item, index) of selectedItems"
               :key="index"
          >
            <span class="multi-text-input__selected-items__item__text">
              {{ getItemDisplayValue(item) }}
            </span>

            <v-icon class="multi-text-input__selected-items__item__close-icon"
                    @click="onRemoveItemClick(index)"
            >
              clear
            </v-icon>
          </div>
        </div>

        <div class="multi-text-input__text-field"
             v-show="isActive || selectedItems.length === 0"
        >
          <input
              :type="type"
              v-model="newItem"
              @keydown="onNewItemKeyDown"
              @focus="$emit('focus')"
              @blur="onInputBlur"
              :placeholder="placeholder"
              :disabled="disabled"
              ref="inputElement"
          />
        </div>
      </div>
    </div>

    <div class="multi-text-input__options" ref="options"
         v-show="(displayedItems && displayedItems.length) && menuVisible"
    >
      <perfect-scrollbar class="multi-text-input__options__scroll-holder"
                         :options="scrollBarOptions"
      >
        <div class="multi-text-input__options__option-container"
             v-for="item of displayedItems"
             :key ="item.key"
             :class="[{'multi-text-input__options__option-container--tree': !!item.children}]"
        >
          <div class="multi-text-input__options__section" v-if="item.children">
            <div class="multi-text-input__options__section__title">
              {{ item.name }}
            </div>

            <div class="multi-text-input__options__option"
                 v-for="childItem of item.children"
                 :key="childItem.key"
                 @click="onOptionClick(childItem)"
            >
              {{ childItem.name }}
            </div>
          </div>

          <div class="multi-text-input__options__option" v-else
               @click="onOptionClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import DropdownItemMixin from "@/mixins/dropdown-item.mixin";
import FormFieldValidationMixin from "@/mixins/form-field-validation.mixin";

export default {
  name: 'multi-text-input',
  mixins: [
      FormFieldValidationMixin,
      DropdownItemMixin
  ],
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    items: {
      type: Array,
      default: null,
      required: false
    },
    type: {
      type: String,
      default: 'text'
    },
    separators: {
      type: Array,
      default: function () {
        return ['Enter', 'Comma', 'Space']
      }
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
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    itemFormatter: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      isActive: false,
      newItem: '',
      touched: false,
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  computed: {
    selectedItems () {
      return this.value ? this.value : []
    },
    itemList () {
      return this.items ? this.items : []
    },
    displayedItems: function () {
      const displayedItems = []

      this.itemList.forEach(item => {
        if (item.children) {
          const displayedChildren = item.children.filter(childItem => {
            return this.value.indexOf(childItem.key) === -1
          })

          if (displayedChildren.length > 0) {
            displayedItems.push({
              ...item,
              children: displayedChildren
            })
          }
        } else {
          if (this.value.indexOf(item.key) === -1) {
            displayedItems.push(item)
          }
        }
      })

      return displayedItems
    },
    flatItems: function () {
      const flatItemList = []

      this.itemList.forEach(item => {
        if (!item.children) {
          flatItemList.push(item)
        } else {
          item.children.forEach(itemChild => {
            flatItemList.push(itemChild)
          })
        }
      })

      return flatItemList
    },
    isValid() {
      if (this.validations) {
        if (this.validations.required && this.isValueEmpty) {
          return false
        }

        if (this.selectedItems.length > 0 && this.validations.methods) {
          for (let i = 0; i < this.validations.methods.length; i++) {
            const methodData = this.validations.methods[i]
            for (let j = 0; j < this.selectedItems.length; j++) {
              if (!methodData.method(this.selectedItems[j])) {
                return false
              }
            }
          }
        }
      }

      return true
    }
  },
  methods: {
    getItemDisplayValue (item) {
      const option = this.flatItems.filter(option => {
        return option.key === item
      })[0]

      if (option) {
        return option.name
      }

      return this.itemFormatter ? this.itemFormatter(item) : item
    },
    onRemoveItemClick (itemIndex) {
      if (this.disabled) {
        return false
      }

      this.$emit('input', this.value.filter((valueItem, index) => {
        return index !== itemIndex
      }))
    },
    runNewItemValidations () {
      if (!(this.validations && this.validations.methods)) {
        return true
      }

      for (let i = 0; i < this.validations.methods.length; i++) {
        const methodData = this.validations.methods[i]
        if (!methodData.method(this.newItem)) {
          if (methodData.message) {
            global.toastr['error'](methodData.message, 'Error')
          }

          return false
        }
      }

      return true
    },
    addNewItem () {
      if (!this.runNewItemValidations()) {
        return false
      }

      this.$emit('input', [
        ...this.value,
        this.newItem
      ])

      this.newItem = ''
    },
    onNewItemKeyDown (event) {
      if (this.separators.indexOf(event.code) > -1) {
        if (this.newItem) {
          this.addNewItem()
        }

        event.preventDefault()
      }
    },
    onInputBlur () {
      if (this.newItem && this.items === null) {
        this.addNewItem()
      }
    },
    onOptionClick (item) {
      this.$emit('input', this.value.concat([item.key]))
      this.$refs.inputElement.focus()
    },
    onElementClick () {
      if (this.disabled) {
        return false
      }

      const justActivated = !this.isActive
      this.isActive = true

      if (!this.menuVisible) {
        this.showOptions()
      }

      if (!this.disabled && justActivated) {
        window.addEventListener('click', this.onEverywhereClick)

        // If activating the element just now, give focus to input
        setTimeout(function () {
          this.$refs.inputElement.focus()
          this.computeDropdownPosition()
        }.bind(this), 100)
      }
    },
    onEverywhereClick (event) {
      if (!(
          this.$el === event.target ||
          this.$el.contains(event.target) ||
          event.target.classList.contains('multi-text-input__options__option')
      )) {
        this.touched = true
        this.isActive = false
        this.hideOptions()

        // De-register click handler
        window.removeEventListener('click', this.onEverywhereClick)
      }
    }
  },
  watch: {
    value: {
      handler: function () {
        if (this.menuVisible) {
          setTimeout(function () {
            this.computeDropdownPosition()
          }.bind(this), 100)
        }
      },
      deep: true
    },
    newItem: {
      handler: function (newVal) {
        this.$emit('newItemInput', newVal)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.multi-text-input {
  outline: 0;

  label {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 41px;
    color: $text-medium;
    margin-right: 30px;
  }

  &__handle-container {
    background: $white;
    border: 1px solid $gray-light;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
  }

  &__input-container {
    line-height: 36px;
    position: relative;
  }

  &__selected-items {
    padding: 2px;

    &__item {
      display: inline-block;
      height: 32px;
      margin: 2px;
      line-height: 32px;
      padding: 0 10px;
      background-color: #e5edf5;
      cursor: pointer;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      color: $text-dark;

      &__close-icon {
        color: #828282;
        font-size: 13px;
        margin-left: 8px;
        cursor: pointer;
        vertical-align: middle;
      }
    }
  }

  &__text-field {
    border: none;
    outline: 0;
    display: block;
    background: $white;
    box-sizing: border-box;
    width: 100%;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 36px;
    color: $text-medium;

    input {
      width: 100%;
      padding: 0 8px;

      &:focus {
        border: none;
        outline: 0;
      }
    }
  }

  &__options {
    position: fixed;
    background-color: $white;
    z-index: 999;

    border: 1px solid $blue-medium;
    border-top-width: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;

    &__scroll-holder {
      max-height: 240px;
    }

    &__section {
      margin-top: 15px;
      border-bottom: 1px solid $gray-xlight;
      min-width: 50%;

      &__title {
        padding: 0 40px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        color: $text-dark;
        margin-bottom: 5px;
      }

      .multi-text-input__options__option {
        padding-left: 70px;
      }
    }

    &__option {
      padding: 0 40px;
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
    }

    &__option-container {
      &--tree {
        .multi-text-input__options__option:not(:hover) {
          &:nth-child(2n + 1) {
            background-color: $white;
          }
          &:nth-child(2n) {
            background-color: rgba($gray-xlight, 0.5);
          }
        }
      }

      &:not(.multi-text-input__options__option-container--tree) {
        &:nth-child(2n + 1) {
          background-color: rgba($gray-xlight, 0.5);
        }
        &:nth-child(2n) {
          background-color: $white;
        }
      }
    }
  }

  &--active {
    .multi-text-input__handle-container {
      border-color: $blue-medium;
    }

    &.multi-text-input--has-options {
      .multi-text-input__handle-container {
        border-bottom-width: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      .multi-text-input__selected-items {
        padding-bottom: 3px;  // To prevent bouncing on open
      }
    }
  }

  &--upwards {
    .multi-text-input__options {
      border-top-width: 1px;
      border-bottom-width: 0;
      border-radius: 4px  4px 0 0;
    }

    &.multi-text-input--active.multi-text-input--has-options {
      .multi-text-input__handle-container {
        border-top-width: 0;
        border-bottom-width: 1px;
        border-radius: 0 0 4px 4px;
      }

      .multi-text-input__selected-items {
        padding-bottom: 2px;
        padding-top: 3px;  // To prevent bouncing on open
      }
    }
  }

  &--small {
    label {
      line-height: 30px;
    }

    .multi-text-input__input-container {
      line-height: 26px;
    }

    .multi-text-input__selected-items {
      &__item {
        height: 24px;
        line-height: 24px;
      }

      &__icon {
        line-height: 30px;
      }
    }

    .multi-text-input__text-field {
      line-height: 26px;
    }

    .multi-text-input__options {
      &__option {
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
    .multi-text-input__handle-container {
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

  &--disabled {
    .multi-text-input__handle-container {
      border-color: $gray-light;
      background-color: rgba(#C8CCD5, 0.15);
      cursor: not-allowed;
    }

    .multi-text-input__text-field {
      cursor: not-allowed;
      background-color: transparent;

      input {
        cursor: not-allowed;
      }
    }

    .multi-text-input__selected-items {
      &__item {
        cursor: not-allowed;
        &__close-icon {
          display: none;
        }
      }
    }
  }
}
</style>