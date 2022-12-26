<template>
  <div class="base-multi-filter" v-click-outside="onClickOutside">
    <div class="base-multi-filter__add-filter"
         @click="addFilterExpanded = true"
    >
      Add filter
    </div>

    <transition name='slide'>
      <div class="base-multi-filter__dropdown" v-show="addFilterExpanded">
        <div class="base-multi-filter__dropdown__header"
             @click="onClickDropdownHeader"
        >
          Filter by
          <v-icon class="base-multi-filter__dropdown__header__icon arrow_drop_down"></v-icon>
        </div>

        <div class="base-multi-filter__dropdown__body">
          <div class="base-multi-filter__dropdown__body__item"
               v-for="item in items"
               :key="item.name"
               :class="[{'base-multi-filter__dropdown__body__item--selected': item.selected }]"
               @click="onChangeFilterItem(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </transition>

    <div class="base-multi-filter__option"
         v-for="item of items"
         :key ="item.name"
    >
     <div v-if="item.selected">
       <div class="base-multi-filter__option__title">
         {{ item.name }}:
       </div>

       <div class="base-multi-filter__option__value">
         <base-autocomplete
             v-if="item.autocompleteKey || item.fixedOptions"
             :ref="item.name"
             @optionSelect="onFilterOptionSelect(item, ...arguments)"
             @focus="onClickOutside"
             :autocomplete-key="item.autocompleteKey"
             :fixed-options="item.fixedOptions ? item.fixedOptions : null"
             :show-organization-name="item.showOrganizationName"
             :unique-by-name="item.uniqueByName"
         />

         <base-text-input
             v-if="!(item.autocompleteKey || item.fixedOptions)"
             v-model="item.value"
             :ref="item.name"
             @input="onStaticFilterInput()"
         />
       </div>

       <div class="base-multi-filter__option__close-icon"
            @click="onRemoveFilterItem(item)"
       >
         <v-icon>close</v-icon>
       </div>
     </div>
    </div>
  </div>
</template>

<script>
import BaseTextInput from "@/components/v2/base-text-input";
import BaseAutocomplete from "@/components/v2/base-autocomplete";

import _ from 'lodash'

export default {
  name: 'base-multi-filter',
  components: {
    BaseTextInput,
    BaseAutocomplete
  },
  props: {
    items: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      addFilterExpanded: false,
      lastFilter: {}
    }
  },
  methods: {
    onChangeFilterItem (item) {
      item.selected = !item.selected
      if (item.selected) {
        this.addFilterExpanded = false
        setTimeout(() => {
          const $ref = this.$refs[item.name][0]
          if ($ref) {
            const $input = $ref.$el.querySelector('input')
            if ($input) {
              $input.focus()
            }
          }
        }, 100)
      }
    },
    calcNewFilter () {
      const newFilter = {}
      this.items.forEach(item => {
        if (item.selected) {
          newFilter[item.key] = item.value
        }
      })
      return _.cloneDeep(newFilter)
    },
    onRemoveFilterItem (item) {
      item.selected = false
      const newFilter = this.calcNewFilter()
      if (!_.isEqual(newFilter, this.lastFilter)) {
        this.lastFilter = newFilter
        this.$emit('change')
      }
    },
    onFilterOptionSelect (item, option) {
      this.$set(item, 'value', option[item.valueKey])

      this.onFilterUpdate()
    },
    onStaticFilterInput: _.debounce(function () {
      this.onFilterUpdate()
    }, 400),
    onFilterUpdate () {
      const newFilter = this.calcNewFilter()
      if (!_.isEqual(newFilter, this.lastFilter)) {
        this.lastFilter = newFilter
        this.$emit('change')
      }
    },
    onClickDropdownHeader () {
      this.addFilterExpanded = false
    },
    onClickOutside () {
      this.addFilterExpanded = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-multi-filter {
  display: flex;
  position: relative;

  &__add-filter {
    width: 100px;
    display: inline-block;
    background: #1146AE;
    border-radius: 4px 0 0 4px;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 36px;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;
  }
  &__dropdown {
    position: absolute;
    top: 0;
    left: 0;
    width: 168px;
    padding: 0 0 11px 0;
    font-size: 15px;
    line-height: 41px;
    text-align: left;
    background: #fff;
    border: 2px solid #1c51ba;
    box-sizing: border-box;
    border-radius: 4px;
    z-index: 2;

    &__header {
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      color: #C8CCD5;
      padding: 0 12px;
      &__icon {
        color: #9AA9C4;
        position: absolute;
        right: 10px;
        line-height: 40px;
      }
    }
    &__body {
      &__item {
        padding: 0 12px;
        cursor: pointer;

        &--selected {
          background: #EFF3F8;
        }
      }
    }
  }
  &__option {
    display: inline-block;
    padding: 0 13px;
    line-height: 35px;
    border: 1px solid #C8CCD5;
    border-left: none;

    &:last-child {
      border-radius: 0 4px 4px 0;
    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 35px;
      color: #53575A;
      float: left;
    }
    &__value ::v-deep {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 35px;
      color: #53575A;
      float: left;
      margin-left: 10px;

      .base-text-input {
        input {
          outline: none;
          border: none;
          padding: 9px 13px;
          width: 116px;

          &:focus, &:active {
            border: none;
          }
        }
      }
    }
    &__close-icon {
      float: left;
      cursor: pointer;
      .v-icon {
        font-size: 12px;
        color: #8796B2;
        line-height: 17px;
      }
    }
  }
}
</style>