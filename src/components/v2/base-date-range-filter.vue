<template>
  <div class="base-date-range-filter"
       v-click-outside="onClickOutside"
  >
    <div class="base-date-range-filter__selected-range"
         @click="fixedOptionSelectorExpanded = true"
    >
      <span>
        {{ selectedRange ? selectedRange.name : 'Select date range' }}
      </span>

      <v-icon>arrow_drop_down</v-icon>
    </div>

    <transition name='slide'>
      <div class="base-date-range-filter__dropdown"
           v-show="fixedOptionSelectorExpanded"
      >
        <div class="base-date-range-filter__dropdown__body">
          <div
              class="base-date-range-filter__dropdown__body__item"
              v-for="item in items"
              :key="item.name"
              :class="[{'base-date-range-filter__dropdown__body__item--selected': isSelected(item) }]"
              @click="onChangeFilterItem(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { formatDateTime } from '@/utils/date-time'

export default {
  name: 'base-date-range-filter',
  data () {
    return {
      fixedOptionSelectorExpanded: false,
      selectedRange: null,
      items: [
        { name: 'Last Hour', beforeInHours: 1 },
        { name: 'Last 24 Hours', beforeInHours: 24 },
        { name: 'Last Week', beforeInHours: 7 * 24 },
        { name: 'Last Month', beforeInHours: 30 * 24 },
        { name: 'Life time', beforeInHours: -1 }
      ]
    }
  },
  mounted () {
    this.selectedRange = this.items[this.items.length - 1]
  },
  methods: {
    isSelected (item) {
      return this.selectedRange && item.name === this.selectedRange.name
    },
    onChangeFilterItem (item) {
      this.selectedRange = item
      this.fixedOptionSelectorExpanded = false

      if (item.beforeInHours !== -1) {
        let now = new Date()
        let after = new Date()
        after.setTime(after.getTime() - (item.beforeInHours * 60 * 60 * 1000))
        this.$emit('change', {
          date_range_after: formatDateTime(after),
          date_range_before: formatDateTime(now)
        })
      } else {
        this.$emit('change', {
          date_range_after: ''
        })
      }
    },
    onClickOutside () {
      this.fixedOptionSelectorExpanded = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-date-range-filter {
  display: flex;
  position: relative;

  &__selected-range {
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
    padding: 0 15px 0 26px;

    .v-icon {
      font-size: 20px;
      color: $white;
      line-height: 17px;
    }
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
}
</style>