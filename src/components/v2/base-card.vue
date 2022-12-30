<template>
  <div :class="[
      'base-card',
      {'base-card--no-text': !text},
      {'base-card--selected': isSelected},
      {'base-card--has-active-content': activeContentProvided}
  ]">
    <div class="base-card-content" @click="onClick">
      <div v-if="icon" class="card-icon-container">
        <v-icon>{{ icon }}</v-icon>
      </div>
      <div class="base-card-title">{{ title }}</div>
      <div
          v-if="text"
          class="base-card-text">{{ text }}</div>
    </div>
    <div
        class="active-content"
        v-show="activeContentProvided && isSelected">
      <slot
          name="activeContent"></slot>
    </div>
    <slot
        name="additionContent"></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    value: {
      type: String,
      default: ''
    },
    cardValue: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      selected: false
    }
  },
  computed: {
    isSelected: function () {
      return this.value === this.cardValue
    },
    activeContentProvided: function () {
      return this.$slots.activeContent
    }
  },
  methods: {
    onClick () {
      this.$emit('input', this.cardValue)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-card {

  .base-card-content {
    background: $white;

    border: 2px solid $blue-dark;
    box-sizing: border-box;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    cursor: pointer;

    .card-icon-container {
      float: left;
      margin-right: 50px;
    }

    .base-card-title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 25px;
      color: $text-dark;
    }

    .base-card-text {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: $text-medium;
    }
  }

  &--small {
    .base-card-content {
      padding: 26px  38px;
    }
  }

  &--horizontal {
    .base-card-content {
      padding: 20px 27px;
    }
  }

  &--selected {
    .base-card-content {
      background: $blue-dark;

      .base-card-title, .base-card-text {
        color: white;
      }
    }
  }

  .active-content {
    background-color: $white;
    padding: 20px 34px;
    border: 1px solid $blue-dark;
    border-radius: 0 0 6px 6px;
  }
}

.base-card--has-active-content.base-card--selected {
  .base-card-content {
    border-radius: 6px 6px 0 0;
  }
}
</style>