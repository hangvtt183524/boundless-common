<template>
  <div class="base-select">
    <label class="base-select-label" v-if="label">{{ label }}</label>

    <div
        class="select-container"
        :class="[
            {'select-container--upwards': isUpwards},
            {'select-container--active': menuVisible},
            {'select-container--selected': selectedItem !== null},
            {'select-container--invalid': isValidationStateVisible && !isValid},
            {'select-container--disabled': disabled},
            {'select-container--clear-icon-visible': clearActionVisible}
            ]"
        :tabindex="tabindex"
        @blur="onBlur"
    >
      <div class="selected-item" @click="onDropdownHandleClick" ref="dropdownHandle">
        <div class="selected-item__name-container">
          <span class="selected-item__name" v-if="selectedItem">
            {{ selectedItem.name }}
          </span>

          <span class="selected-item__name" v-else>
            {{ placeholder ?  placeholder : 'Select' }}
          </span>
        </div>

        <v-icon class="select-icon">{{ loading ? 'fas fa-spinner fa-spin' : 'arrow_drop_down' }}</v-icon>

        <v-icon class="clear-icon" v-if="clearActionVisible" @click.stop="onClearClick()">close</v-icon>
      </div>

      <div class="options" v-show="menuVisible" ref="options">
        <div class="search-container" v-if="searchActive">
          <base-text-input
              class="search-container__search-input"
              v-model="searchText"
              ref="searchElement"
              @focus="searchInputFocusChange(true)"
              @blur="searchInputFocusChange(false)"
              :placeholder="searchPlaceholder"
              pre-icon="search"
          >
            <v-icon
                class="search-container__search-input__clear-icon"
                v-if="searchText"
                @click="onSearchClearClick()"
            >close</v-icon>
          </base-text-input>
        </div>

        <perfect-scrollbar class="scroll-holder" :options="scrollBarOptions">
          <base-select-option
              v-for="item of displayedItems"
              :option="item"
              :key="item.key"
              @optionClick="onOptionClick($event)"
          />
        </perfect-scrollbar>
      </div>
    </div>

    <div class="base-select__error-container" v-if="errors && errors.length > 0 && touched">
      <div class="base-select__error-container__error"
           v-for="(error, index) of errors"
           :key="index"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import BaseTextInput from "@/components/v2/base-text-input";
import BaseSelectOption from "@/components/v2/base-select-option";

import DropdownItemMixin from "@/mixins/dropdown-item.mixin";
import FormFieldValidationMixin from "@/mixins/form-field-validation.mixin";
import ClearableFormFieldMixin from "@/mixins/clearable-form-field.mixin";

const AUTO_SEARCH_ENABLE_THRESHOLD = 12
export default {
  name: 'BaseSelect',
  components: {
    BaseTextInput,
    BaseSelectOption
  },
  mixins: [
    DropdownItemMixin,
    FormFieldValidationMixin,
    ClearableFormFieldMixin
  ],
  props: {
    value: {
      default: null
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
    caseInsensitiveKeys: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    searchEnabled: {
      default: 'auto'
    },
    searchPlaceholder: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollBarOptions: {
        wheelPropagation: false
      },
      searchText: null,
      componentHasFocus: false,
      searchInputHasFocus: false
    }
  },
  computed: {
    flatItems () {
      return this.getLeafItems(this.items)
    },
    selectedItem() {
      const selectedItem = this.flatItems.filter(item => {
        return (this.caseInsensitiveKeys && typeof item.key === 'string' && typeof this.value === 'string')
            ? (item.key.toLowerCase() === this.value.toLowerCase()) : (item.key === this.value)
      })[0]
      return selectedItem || null
    },
    searchActive () {
      return this.searchEnabled === true ||
          (this.searchEnabled === 'auto' && this.flatItems.length >= AUTO_SEARCH_ENABLE_THRESHOLD)
    },
    displayedItems () {
      if (this.searchActive === false || !this.searchText) {
        return this.items
      }

      return this.items.filter(
          item => item.hasOwnProperty('children') ?
              true : item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
      ).map(item => {
        return item.hasOwnProperty('children') ?
            {
              ...item,
              children: item.children.filter(
                  childItem => childItem.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
              )
            } : item
      })
    }
  },
  methods: {
    getLeafItems (items) {
      let leafItems = []
      items.forEach(item => {
        if (!item.hasOwnProperty('children')) {
          leafItems.push(item)
        } else {
          leafItems = leafItems.concat(this.getLeafItems(item.children))
        }
      })

      return leafItems
    },
    onBlur () {
      this.componentHasFocus = false

      if (!this.searchActive) {
        this.touched = true
        this.hideOptions()
      } else {
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.touched = true
            this.hideOptions()
          }
        }, 50)
      }
    },
    searchInputFocusChange (hasFocus) {
      this.searchInputHasFocus = hasFocus

      if (!hasFocus) {
        setTimeout(() => {
          if (!this.searchInputHasFocus && !this.componentHasFocus) {
            this.touched = true
            this.hideOptions()
          }
        }, 300)
      }
    },
    hideOptions() {
      DropdownItemMixin.methods.hideOptions.bind(this)()

      if (this.searchActive) {
        this.searchText = null
      }
    },
    showOptions () {
      DropdownItemMixin.methods.showOptions.bind(this)()
      if (this.searchActive) {
        setTimeout(() => {
          this.$refs.searchElement.setFocus()
        }, 50)
      }
    },
    onSearchClearClick () {
      this.searchText = ''
      this.$refs.searchElement.setFocus()
    },
    onOptionClick (item) {
      this.hideOptions()
      this.$emit('input', item.key)
    },
    onClearClick () {
      this.hideOptions()
      ClearableFormFieldMixin.methods.onClearClick.bind(this)()
    },
    onDropdownHandleClick (event) {
      if (this.loading) {
        return
      }
      DropdownItemMixin.methods.onDropdownHandleClick.bind(this)()
    },
    onFocus () {
      this.componentHasFocus = true
    },
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-select {

  .select-container {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 40px;
    color: rgba($text-medium, 0.5);
    width: 100%;
    min-width: 80px;
    display: inline-block;
    position: relative;

    background-color: $white;
    border: 1px solid $gray-light;
    box-sizing: border-box;
    border-radius: 4px;
    outline: 0;

    .selected-item {
      line-height: 40px;
      cursor: pointer;
      padding: 0 10px;
      user-select: none;

      .select-icon {
        position: absolute;
        right: 10px;

        line-height: 40px;
        color: rgba($text-medium, 0.5);
        font-size: 20px;
      }

      .clear-icon {
        position: absolute;
        right: 30px;

        line-height: 40px;
        color: rgba($text-medium, 0.5);
        font-size: 20px;
      }

      &__name-container {
        display: inline-flex;
        width: calc(100% - 20px);
      }

      &__name {
        width: 100%;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 30px;
        height: 30px;
        margin-right: 0;
      }
    }

    .options {
      padding-left: 0;
      position: fixed;
      border: 1px solid $blue-medium;
      border-top-width: 0;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: white;
      z-index: 999;
      overflow: hidden;

      .search-container {
        .base-text-input--has-pre-icon ::v-deep {
          input {
            padding: 12px 28px 12px 36px;
            border: none;
            border-radius: 0;
            background: $gray-xlight;
            color: $text-dark;

            &::placeholder {
              color: $text-dark !important;
            }

            &:focus {
              padding: 12px 28px 12px 36px;
            }
          }

          &__pre-icon.v-icon {
            left: 10px;
          }

          .v-icon {
            color: $text-dark !important;
          }
        }

        &__search-input {
          &__clear-icon {
            margin-right: 7px;
          }
        }
      }

      .scroll-holder {
        max-height: 240px;
      }

      ::v-deep {
        .base-select-option {
          &__option {
            padding-left: 10px;
            line-height: 40px;
            list-style: none;
            cursor: pointer;

            &:hover {
              background-color: $gray-medium;
            }

            &--highlighted {
              color: $blue-reserve;
            }
          }

          &__section {
            margin-top: 10px;

            &__title {
              padding-left: 10px;
              line-height: 30px;
              font-size: 13px;
              border-bottom: 1px solid $gray-dark;
              font-weight: bold;
              user-select: none;
            }

            &__options {
              .base-select-option__option {
                padding-left: 20px;
              }
            }
          }

          &--disabled {
            .base-select-option__option {
              cursor: not-allowed;
              background-color: rgba($gray-light, 0.15);
              color: rgba($text-medium, 0.50);
            }
          }

          &:not(.base-select-option--tree) {
            &:nth-child(2n + 1) {
              background-color: rgba($gray-xlight, 0.5);
            }
            &:nth-child(2n) {
              background-color: $white;
            }
          }

          &--tree {
            &:not(.base-select-option--disabled) {
              .base-select-option__section {
                .base-select-option {
                  &:nth-child(2n + 1) {
                    background-color:  rgba($gray-xlight, 0.5);
                  }
                  &:nth-child(2n) {
                    background-color: $white;
                  }
                }
              }
            }
          }
        }
      }
    }

    &--active {
      border-color: $blue-medium;
      color: $text-dark;
      border-bottom-width: 0;
      padding-bottom: 1px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &--selected {
      color: $text-dark;
    }

    &--upwards {
      .options {
        top: auto;
        bottom: 40px;
        border-top-width: 1px;
        border-bottom-width: 0;
        border-radius: 4px  4px 0 0;
      }
    }

    &--invalid {
      border-color: $danger;
    }

    &--disabled {
      border-color: $gray-light;
      background-color: rgba(#C8CCD5, 0.15);

      .selected-item {
        cursor: not-allowed;
      }
    }

    &--clear-icon-visible {
      .selected-item {
        &__name-container {
          width: calc(100% - 45px);
        }
      }
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

  .select-container--upwards.select-container--active {
    border-bottom-width: 1px;
    border-top-width: 0;
    padding-top: 1px;
    padding-bottom: 0;
    border-radius: 0 0 4px 4px;
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
    .select-container {
      .selected-item {
        line-height: 30px;

        .select-icon, .clear-icon {
          line-height: 30px;
          font-size: 16px;
        }
      }

      .options {
        .base-select-option ::v-deep {
          .base-select-option__option {
            line-height: 30px;
          }

          .base-select-option__section {
            &__title {
              line-height: 24px;
            }
          }
        }
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
}

</style>