<template>
  <div class="list-select-header-cell">
    <base-check-box
        class="base-check-box--small select-all-checkbox"
        v-if="!maxSelectCount"
        :value="value"
        @click="onClick"
    />

    <span class="list-select-header-cell__total-selection"
          v-if="totalSelectable && !maxSelectCount"
          v-show="value === true && totalItems !== null"
    >
      <span v-if="isTotalSelected">
        <span v-if="!hasSelectableRowFilter">
          All {{totalItems}} items selected
        </span>

        <span v-if="hasSelectableRowFilter">
          All pages selected
        </span>
      </span>

      <span class="list-select-header-cell__total-selection__select-trigger"
            v-if="isTotalSelected"
            @click="onTotalClearClick"
      >
        Clear
      </span>

      <span class="list-select-header-cell__total-selection__select-trigger"
            v-if="!isTotalSelected && isMultiPage"
            @click="onTotalSelectClick"
      >
        <span v-if="!hasSelectableRowFilter">
          Select all {{totalItems}} items
        </span>

        <span v-if="hasSelectableRowFilter">
          Select all pages
        </span>
      </span>
    </span>

    <span class="list-select-header-cell__selected-count-display"
          v-if="!!maxSelectCount"
          v-show="selectedRows.length > 0"
    >
      Selected: {{ selectedRows.length }} / {{ maxSelectCount }}
    </span>
  </div>
</template>

<script>
import BaseCheckBox from "@/components/v2/base-check-box";

export default {
  name: 'list-select-header-cell',
  components: {
    BaseCheckBox
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    totalSelectable: {
      type: Boolean
    },
    isTotalSelected: {
      type: Boolean
    },
    isMultiPage: {
      type: Boolean
    },
    hasSelectableRowFilter: {
      type: Boolean
    },
    totalItems: {
      required: true
    },
    selectedRows: {
      type: Array,
      required: true
    },
    maxSelectCount: {
      required: false
    }
  },
  methods: {
    onClick () {
      this.$emit('input', {
        key: 'isAllSelected',
        value: !this.value
      })
    },
    onTotalSelectClick () {
      this.$emit('input', {
        key: 'isTotalSelected',
        value: true
      })
    },
    onTotalClearClick () {
      this.$emit('input', {
        key: 'isTotalSelected',
        value: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.list-select-header-cell {
  .base-check-box {
    top: 2px;
    position: relative;
  }

  &__total-selection {
    display: inline;

    span {
      margin-left: 10px;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 20px;
      text-align: right;
    }

    &__select-trigger {
      cursor: pointer;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 20px;
      text-align: right;
      color: $blue-medium;
      text-decoration-line: underline;
    }
  }

  &__selected-count-display {
    font-size: 13px;
    line-height: 20px;
    text-align: right;
    color: $blue-medium;
  }
}
</style>