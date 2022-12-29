<template>
  <div class="table-multi-add"
       :class="['table-multi-add', {'table-multi-add--disabled': disabled}]"
  >
    <div class="table-multi-add__options">
      <div class="table-multi-add__options__header">
        <search-input
            class="table-multi-add__options__header__search-input"
            v-model="search"
            :placeholder="searchPlaceholder ? searchPlaceholder : 'Search'"
            :disabled="disabled"
        />
      </div>

      <div class="table-multi-add__options__list">
        <base-table
            class="table-multi-add__options__list__table"
            :items="displayedItems"
            :headers="headers"
            item-key="key"
            :sortable="!disabled"
            :multi-selectable="!disabled"
            :select-on-row-click="!disabled"
            :actions="!disabled ? actions : []"
            actions-label=" "
            :actions-head-more="actionsHeadMore"
            @actionClick="onTableActionClick"
            @rowSelectionChange="onRowSelectionChange"
            @headMoreInput="onTableHeadMoreInput"
            @loadMore="onScrollEnd"
        />
      </div>
    </div>

    <div class="list-empty-state"
         v-if="!!emptyStateMessage && !(items && items.length > 0)"
    >
      <div class="list-empty-state__message">
        | {{ emptyStateMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import SearchInput from "@/components/v2/search-input";
import BaseTable from "@/components/common/base-table";
import ClickActionHeaderCell from "@/components/v2/click-action-header-cell";

export default {
  name: 'table-multi-add',
  components: {
    SearchInput,
    BaseTable
  },
  props: {
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
    emptyStateMessage: {
      type: String,
      required: false
    },
    addActionTooltip: {
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
      ],
      actions: [
        {
          icon: 'add_box',
          type: 'add',
          tooltip: this.addActionTooltip ? this.addActionTooltip : null
        }
      ],
      selectedItems: []
    }
  },
  computed: {
    displayedItems () {
      if (!this.search) {
        return this.items
      }

      return this.items.filter(item => item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    },
    actionsHeadMore () {
      return {
        component: ClickActionHeaderCell,
        props: {
          icon: 'add_circle_outline',
          text: 'Add selected',
          disabled: this.selectedItems.length === 0
        }
      }
    }
  },
  methods: {
    onRowSelectionChange (selectedRows) {
      this.selectedItems = selectedRows
    },
    onTableActionClick (action, item) {
      if (action === 'add') {
        this.$emit('add', [
          item.key
        ])
      }
    },
    onTableHeadMoreInput (header, event) {
      if (header.value === '_actions' && event.action === 'click') {
        // Select all selected items
        this.$emit('add', this.selectedItems.map(item => item.key))
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

.table-multi-add {
  position: relative;

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
    .table-multi-add__options {
      background-color: rgba(#C8CCD5, 0.15);
      cursor: not-allowed;
    }
  }

  &--fill-height {
    height: 100%;

    .table-multi-add__options {
      height: 100%;

      &__list {
        height: calc(100% - 40px);
        overflow: hidden;

        &__table {
          max-height: none;
          height: 100%;
        }
      }
    }
  }
}
</style>