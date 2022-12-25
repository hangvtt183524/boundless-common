<template>
  <div class="base-multi-select"
       :class="[
           'base-multi-select',
           {'base-multi-select--upwards': isUpwards},
           {'base-multi-select--active': menuVisible},
           {'base-multi-select--invalid': isValidationStateVisible && !isValid},
           {'base-multi-select--disabled': disabled || (isEmpty && disabledWhenEmpty)}
       ]"
       :tabindex="tabindex"
       @focus="onFocus"
       @blur="onBlur"
  >
    <label class="base-multi-select__label" v-if="label">
      {{ label }}
    </label>

    <div class="base-multi-select__handle-container">
      <div class="base-multi-select__input-container"
           ref="dropdownHandle"
           @click="onDropdownHandleClick"
      >
        <div class="base-multi-select__selected-items">
          <div class="base-multi-select__selected-items__item"
               v-for="selectedItem of selectedItems"
               :key="selectedItem.key"
               :title="selectedItem.name"
          >
            <span class="base-multi-select__selected-items__item__text">
              {{ selectedItem.name }}
            </span>

            <v-icon class="base-multi-select__selected-items__item__close-icon"
                    @click="onRemoveItemClick(selectedItem)"
            >
              clear
            </v-icon>
          </div>

          <div class="base-multi-select__selected-items__add-new-item"
               v-show="displayedItems.length > 0 || searchEnabled"
          >
            <v-icon class="base-multi-select__selected-items__add-new-item__icon">
              add
            </v-icon>

            <span class="base-multi-select__selected-items__add-new-item__text">
              Add
            </span>
          </div>

          <v-icon class="base-multi-select__selected-items__icon arrow_drop_down">
          </v-icon>
        </div>

        <div class="base-multi-select__search-field"
             v-if="searchActive"
             v-show="isSearchInputVisible"
        >
          <input
              type="text"
              v-model="searchText"
              :placeholder="placeholder"
              :disabled="disabled"
              ref="searchElement"
              @focus="searchInputFocusChange(true)"
              @blur="searchInputFocusChange(false)"
          />
        </div>
      </div>
    </div>

    <div class="base-multi-select__options" v-show="menuVisible" ref="options">
      <perfect-scrollbar class="base-multi-select__options__scroll-holder"
                         :options="scrollBarOptions"
      >
        <div class="base-multi-select__options__option-container"
             v-for="item of displayedItems"
             :key ="item.key"
             :class="[{'base-multi-select__options__option-container--tree': !!item.children}]"
        >
          <div class="base-multi-select__options__section" v-if="item.children">
            <div class="base-multi-select__options__section__title">{{ item.name }}</div>
            <div class="base-multi-select__options__option"
                 v-for="childItem of item.children"
                 :key="childItem.key"
                 @click="onOptionClick(childItem)"
                 :class="{'base-multi-select__options__option--highlighted': childItem.highlighted}"
                 :title="item.name"
            >
              {{ childItem.name }}
            </div>
          </div>

          <div class="base-multi-select__options__option"
               v-else
               @click="onOptionClick(item)"
               :class="{'base-multi-select__options__option--highlighted': item.highlighted}"
               :title="item.name"
          >
            {{ item.name }}
          </div>
        </div>
      </perfect-scrollbar>
    </div>

    <div class="base-multi-select__error-container" v-if="errors && errors.length > 0 && touched">
      <div class="base-multi-select__error-container__error"
           v-for="(error, index) of errors"
           :key="index"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import DropdownItemMixin from "@/mixins/dropdown-item.mixin";
import FormFieldValidationMixin from "@/mixins/form-field-validation.mixin";
import _ from 'lodash'

const AUTO_SEARCH_ENABLE_THRESHOLD = 18

export default {
  name: 'base-multi-select',
  mixins: [
      DropdownItemMixin,
      FormFieldValidationMixin
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
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    searchEnabled: {
      default: 'auto'
    },
    placeholder: {
      type: String,
      default: ''
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    disabledWhenEmpty: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      searchText: '',
      isSearchInputVisible: false,
      componentHasFocus: false,
      searchInputHasFocus: false,
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  computed: {
    isEmpty () {
      return this.flatItems.length === 0
    },
    selectedItems () {
      return this.flatItems.filter(item => {
        return this.value.indexOf(item.key) > -1
      })
    },
    nonSelectedItems: function () {
      const nonSelectedItems = []

      this.items.forEach(item => {
        if (item.children) {
          const displayedChildren = item.children.filter(childItem => {
            return this.value.indexOf(childItem.key) === -1
          })

          if (displayedChildren.length > 0) {
            nonSelectedItems.push({
              ...item,
              children: displayedChildren
            })
          }
        } else {
          if (this.value.indexOf(item.key) === -1) {
            nonSelectedItems.push(item)
          }
        }
      })

      return nonSelectedItems
    },
    displayedItems: function () {
      let displayedItems = [...this.nonSelectedItems]

      if (this.searchActive && this.searchText) {
        displayedItems = displayedItems.filter(item => {
          return item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
        })
      }

      return displayedItems
    },
    searchActive () {
      return this.searchEnabled === true ||
          (this.searchEnabled === 'auto' && this.nonSelectedFlatItems.length >= AUTO_SEARCH_ENABLE_THRESHOLD)
    },
    flatItems: function () {
      const flatItemList = []

      this.items.forEach(item => {
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
    nonSelectedFlatItems: function () {
      const flatItemList = []

      this.nonSelectedItems.forEach(item => {
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
  },
  methods: {
    onFocus () {
      this.componentHasFocus = true

      this.$emit('focus')
    },
    onBlur () {
      this.touched = true
      this.componentHasFocus = false

      if (!this.searchActive) {
        this.hideOptions()
      } else {
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.hideOptions()
          }
        }, 50)
      }
    },
    onRemoveItemClick (item) {
      if (this.disabled) {
        return false
      }

      this.$emit('input', this.value.filter(key => {
        return key !== item.key
      }))
    },
    searchInputFocusChange (hasFocus) {
      this.searchInputHasFocus = hasFocus

      if (!hasFocus) {
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.hideOptions()
          }
        }, 50)
      }
    },
    onOptionClick (item) {
      this.$emit('input', this.value.concat([item.key]))

      setTimeout(function () {
        if (this.displayedItems.length === 0) {
          this.hideOptions()
        }
      }.bind(this), 50)
    },
    showOptions () {
      if (this.nonSelectedFlatItems.length === 0 && !this.searchEnabled) {
        return
      }

      if (this.searchActive) {
        this.isSearchInputVisible = true

        setTimeout(() => {
          this.$refs.searchElement.focus()

          DropdownItemMixin.methods.showOptions.bind(this)()
        }, 50)
      } else {
        DropdownItemMixin.methods.showOptions.bind(this)()
      }
    },
    hideOptions () {
      if (this.searchActive) {
        this.isSearchInputVisible = false
        this.searchText = ''

        setTimeout(DropdownItemMixin.methods.hideOptions.bind(this), 100)
      } else {
        DropdownItemMixin.methods.hideOptions.bind(this)()
      }
    },
    onDropdownHandleClick (event) {
      if (event.target.closest('.base-multi-select__selected-items__item')) {
        return
      }

      DropdownItemMixin.methods.onDropdownHandleClick.bind(this)()
    },
  },
  watch: {
    searchText: {
      handler: _.debounce(function () {
        this.$emit('searchInput', this.searchText)
      }, 400),
      deep: true
    },
    value: {
      handler: _.debounce(function () {
        if (this.menuVisible) {
          this.computeDropdownPosition()
        }
      }, 50),
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-multi-select {
  outline: 0;

  &__handle-container {
    background: $white;
    border: 1px solid $gray-light;
    border-radius: 4px;
    box-sizing: border-box;
  }

  &__input-container {
    line-height: 36px;
    position: relative;
    cursor: pointer;
  }

  &__selected-items {
    padding: 2px 20px 2px 2px;
    min-height: 41px;
    overflow: hidden;

    &__item {
      display: inline-block;
      position: relative;
      float: left;
      height: 32px;
      margin: 2px;
      line-height: 32px;
      padding: 0 30px 0 10px;
      background-color: #e5edf5;
      cursor: pointer;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      color: $text-dark;

      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &__text {
        max-width: calc(100% - 20px);
      }

      &__close-icon {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #828282;
        font-size: 13px;
        cursor: pointer;
        vertical-align: middle;
      }
    }

    &__add-new-item {
      display: inline-block;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      color: $text-medium;
      cursor: pointer;
      margin: 0 4px;

      &__icon {
        color: $text-medium;
        margin-right: 5px;
        vertical-align: middle;
      }

      &__text {
        vertical-align: middle;
      }
    }

    &__icon {
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 40px;
      color: #9aa9c4;
    }
  }

  &__search-field {
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

  label {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 40px;
    color: $text-medium;
    margin-right: 30px;
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

      .base-multi-select__options__option {
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

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover {
        background: $gray-xlight;
        color: $blue-medium;
      }

      &--highlighted {
        color: $blue-reserve;
      }
    }

    &__option-container {
      &--tree {
        .base-multi-select__options__option:not(:hover) {
          &:nth-child(2n + 1) {
            background-color: $white;
          }
          &:nth-child(2n) {
            background-color: rgba($gray-xlight, 0.5);
          }
        }
      }

      &:not(.base-multi-select__options__option-container--tree) {
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
    .base-multi-select__handle-container {
      border-color: $blue-medium;
      border-bottom-width: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .base-multi-select__selected-items {
      padding-bottom: 3px;  // To prevent bouncing on open
    }
  }

  &--upwards {
    .base-multi-select__options {
      border-top-width: 1px;
      border-bottom-width: 0;
      border-radius: 4px  4px 0 0;
    }

    &.base-multi-select--active {
      .base-multi-select__handle-container {
        border-top-width: 0;
        border-bottom-width: 1px;
        border-radius: 0 0 4px 4px;
      }

      .base-multi-select__selected-items {
        padding-bottom: 2px;
        padding-top: 3px;  // To prevent bouncing on open
      }
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

  &--nowrap {
    .base-multi-select__selected-items {
      white-space: nowrap;
    }
  }

  &--small {
    .base-multi-select__selected-items {
      line-height: 26px;
      min-height: 30px;

      &__item {
        height: 24px;
        line-height: 24px;
      }

      &__icon {
        line-height: 30px;
      }
    }

    .base-multi-select__options {
      &__option {
        line-height: 26px;
      }
    }

    label {
      line-height: 30px;
    }
  }

  &--invalid {
    .base-multi-select__handle-container {
      border-color: $danger;
    }
  }

  &--disabled {
    .base-multi-select__selected-items {
      border-color: $gray-light;
      background-color: rgba(#C8CCD5, 0.15);
      cursor: not-allowed;

      &__item {
        cursor: not-allowed;
        &__close-icon {
          display: none;
        }
      }

      &__add-new-item {
        cursor: not-allowed;
      }
    }
  }
}
</style>