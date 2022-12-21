<template>
  <div
      class="multi-action"
      :tabindex="tabindex"
      @blur="onBlur"
      :class="[{'multi-action--icon-triggered': isIconTriggered}, {'multi-action--active': menuVisible}, {'multi-action--disabled': disabled}]"
  >
    <div
        class="multi-action__trigger"
        @click.stop="onDropdownHandleClick"
        ref="dropdownHandle"
    >
      <span v-if="!isIconTriggered">{{ label ?  label : 'Actions' }}</span>
      <v-tooltip :color="'#223d70'" light :disabled="!tooltip">
        <template v-slot:activator="{ on }">
          <v-icon icon-color="#223d70" v-on="on">
            {{ icon }}
          </v-icon>
        </template>

        <span>{{ tooltip }}</span>
      </v-tooltip>
    </div>

    <div class="multi-action__actions" v-show="menuVisible" ref="options">
      <div
          class="multi-action__actions__action"
          v-for="action of actions"
          :key="action.type"
          @click.stop="onActionClick(action)"
          :class="[{'multi-action__actions__action--disabled': action.disabled}]"
      >
        | {{ action.label }}
      </div>
    </div>
  </div>
</template>

<script>
import DropdownItemMixin from "@/mixins/dropdown-item.mixin";

export default {
  name: 'MultiAction',
  mixins: [
      DropdownItemMixin
  ],
  props: {
    label: {
      default: ''
    },
    icon: {
      default: ''
    },
    tooltip: {
      default: ''
    },
    actions: {
      type: Array,
      default: null
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isIconTriggered () {
      return !!this.icon
    }
  },
  methods: {
    onBlur () {
      this.hideOptions()
    },
    onActionClick (action) {
      if (action.disabled) {
        return false
      }

      this.hideOptions()
      this.$emit('actionClick', action.type)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.multi-action {
  font-family: Fira Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: $text-medium;

  min-width: 100px;
  cursor: pointer;

  border-radius: 4px;
  outline: 0;
  box-sizing: border-box;
  border: 2px solid;

  &__trigger {
    height: 40px;
    line-height: 40px;
    text-align: center;
    user-select: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__actions {
    position: fixed;
    z-index: 999;

    border: 1px solid;
    border-top: none;
    background-color: $white;

    &__action {
      box-sizing: border-box;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      text-align: left;
      padding: 0 10px;
      border-top: 1px solid $gray-dark;
      cursor: pointer;
      user-select: none;

      &:not(.multi-action__actions__action--disabled):hover {
        background-color: $gray-medium;
      }

      &--disabled {
        color: $gray-light;
        cursor: not-allowed;
      }
    }
  }

  &--active {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &--green {
    border-color: $green-medium;
    background-color: $green-medium;

    .multi-action__trigger {
      background-color: $green-medium;
      color: $white;
    }

    .multi-action__actions {
      border-color: $green-medium;

      &__action {
        &:first-child {
          border-color: $green-medium
        }
      }
    }

    &--negative {
      border-color: $green-medium;
      color: $text-medium;

      .multi-action__trigger {
        background-color: $white;
      }

      .multi-action__actions {
        border-color: $green-medium;

        &__action {
          &:first-child {
            border-color: $green-medium
          }
        }
      }
    }
  }

  &--blue {
    border-color: $blue-dark;
    background-color: $blue-dark;

    .multi-action__trigger {
      background-color: $blue-dark;
      color: $white;
    }

    .multi-action__actions {
      border-color: $blue-dark;

      &__action {
        &:first-child {
          border-color: $blue-dark
        }
      }
    }

    &--negative {
      border-color: $blue-dark;
      color: $text-medium;

      .multi-action__trigger {
        background-color: $white;
      }

      .multi-action__actions {
        border-color: $blue-dark;

        &__action {
          &:first-child {
            border-color: $blue-dark
          }
        }
      }
    }
  }

  &--small {
    .multi-action__trigger {
      height: 32px;
      line-height: 32px;
    }

    .multi-action__actions {
      &__action {
        height: 36px;
        line-height: 36px;
      }
    }
  }

  &--disabled {
    cursor: not-allowed;
    border-color: $gray-light;
    color: $gray-light;
    background: $white;

    &.multi-action--green, &.multi-action--blue {
      border-color: $gray-light;

      .multi-action__trigger {
        background: $gray-light;
        color: $white;

        &:hover {
          text-decoration: none;
        }
      }
    }

    &.multi-action--green--negative, &.multi-action--blue--negative {
      border-color: $gray-light;

      .multi-action__trigger {
        background: $white;
        color: $gray-light;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  &--icon-triggered {
    min-width: auto;
    border-width: 0;

    .multi-action__trigger {
      &:hover {
        text-decoration: none;
      }
    }

    .multi-action__actions {
      border-radius: 4px;

      &__action {
        &:first-child {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        &:last-child {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}

</style>