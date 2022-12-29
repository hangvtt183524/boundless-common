<template>
  <div class="table-multi-select"
       :class="['table-multi-select', {'table-multi-select--invalid': isValidationStateVisible && !isValid}, {'table-multi-select--disabled': disabled}]"
       :tabindex="tabindex"
       @blur="onBlur"
  >
    <div class="table-multi-select__options">
      <div class="table-multi-select__options__header">
        <search-input
            class="table-multi-select__options__header__search-input"
            v-model="search"
            :placeholder="searchPlaceholder ? searchPlaceholder : 'Search'"
            :disabled="disabled"
        />
      </div>

      <div class="table-multi-select__options__list">
        <base-table
            class="table-multi-select__options__list__table"
            :items="displayedItems"
            :headers="headers"
            item-key="key"
            :sortable="!disabled"
            :multi-selectable="!disabled"
            :selected-rows="selectedItems"
            :row-clickable="!disabled"
            @rowClick="onRowClick"
            @rowSelect="onRowSelect"
            @rowDeselect="onRowDeselect"
            @loadMore="onScrollEnd"
        />
      </div>
    </div>

    <div class="list-empty-state" v-if="!!emptyStateMessage && !(items && items.length > 0)">
      <div class="list-empty-state__message">
        | {{ emptyStateMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import SearchInput from "@/components/v2/search-input";
import BaseTable from "@/components/common/base-table";

import FormFieldValidationMixin from "@/mixins/form-field-validation.mixin";

export default {
  name: 'table-multi-select',
  components: {
    SearchInput,
    BaseTable
  },
  mixins: [
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
    disabled: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: ''
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    emptyStateMessage: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name'
        }
      ]
    }
  },
  computed: {
    displayedItems () {
      if (!this.search) {
        return this.items
      }

      return this.items.filter(item => item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    },
    selectedItems () {
      return this.items.filter(item => this.value.indexOf(item.key) > -1)
    }
  },
  methods: {
    onRowSelect (selectedRows) {
      this.$emit('input', [
        ...this.value,
        ...selectedRows.map(option => option.key)
      ])
    },
    onRowDeselect (deselectedRows) {
      this.$emit('input', this.value.filter(key => {
        return deselectedRows.map(row => row.key).indexOf(key) === -1
      }))
    },
    onRowClick (row) {
      if (this.value.indexOf(row.key) > -1) {
        // Already selected, de-select
        this.onRowDeselect([row])
      } else {
        // Row not selected, select
        this.onRowSelect([row])
      }
    },
    onScrollEnd () {
      this.$emit('scrollEnd')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";
@import "styles/v2/base.scss";

.table-multi-select {

  &__options {
    border: 1px solid $gray-light;

    &__header {
      height: 40px;
      overflow: hidden;

      .base-text-input ::v-deep {
        input {
          height: 40px;
          color: $text-dark;
          border: none;
          padding: 9px 54px 9px 35px;
          border-radius: 0;

          &:focus {
            border-color: $green-light;
          }
        }

      }
    }

    &__list {
      position: relative;

      &__table {
        max-height: 400px;
      }

      .base-table {
        height: auto;
      }
    }
  }

  &--disabled {
    .table-multi-select__options {
      background-color: rgba(#C8CCD5, 0.15);
      cursor: not-allowed;
    }
  }

  &--invalid {
    .table-multi-select__options {
      border-color: $danger;
    }
  }

  &--fill-height {
    height: 100%;

    .table-multi-select__options {
      height: 100%;

      &__list {
        height: calc(100% - 40px);
        overflow: hidden;

        &__table {
          height: 100%;
        }
      }
    }
  }
}
</style>