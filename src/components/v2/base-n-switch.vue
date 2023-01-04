<template>
  <div class="base-n-switch">
    <div class="base-n-switch__option"
         v-for="item of items"
         :key="item.value"
         @click="$emit('input', item.value)"
         :class="{'base-n-switch__option--active': value === item.value}"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-n-switch',
  props: {
    value: {
      default: null
    },
    items: {
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-n-switch {
  box-sizing: border-box;
  display: inline-block;

  &__option {
    display: inline-block;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: $white;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    color: $text-medium;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:first-child {
      border-radius: 4px 0 0 4px;
      border: 1px solid $blue-reserve;
    }

    &:not(:first-child):not(:last-child) {
      border-radius: 0 0 0 0;
      border: 1px solid $blue-reserve;
      border-left-width: 0;
    }

    &:last-child {
      border-radius: 0 4px 4px 0;
      border: 1px solid $blue-reserve;
      border-left-width: 0;
    }

    &--active {
      background-color: $blue-reserve;
      color: $white;
    }
  }
}
</style>