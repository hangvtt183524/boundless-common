<template>
  <div class="empty-state">
    <div class="empty-state__content">
      <div class="empty-state__loading-indicator" v-if="loading">
        <v-progress-circular :size="50" indeterminate color="#15ac2f" />
      </div>

      <h3 class="empty-state__header" v-if="headerText">
        | {{ headerText }}
      </h3>

      <div class="empty-state__message" v-if="messageText" v-html="messageText">
      </div>

      <div class="empty-state__actions" v-if="actions && actions.length > 0">
        <div class="empty-state__actions__action"
             v-for="action of actions"
             :key="action.key"
        >
          <a v-if="action.externalLink" :href="action.externalLink" target="_blank">
            <base-button
                :class="action.buttonClass ? action.buttonClass : 'base-button--green'"
                @click="$emit('actionClick', action.key)"
                :disabled="!!action.disabled"
            >
              |  {{ action.text }}
            </base-button>
          </a>

          <router-link v-else-if="action.internalLink"
                       :to="{ name: action.internalLink, query: action.query || {} }"
          >
            <base-button
                :class="action.buttonClass ? action.buttonClass : 'base-button--green'"
                @click="$emit('actionClick', action.key)"
                :disabled="!!action.disabled"
            >
              |  {{ action.text }}
            </base-button>
          </router-link>

          <base-button
              v-else
              :class="action.buttonClass ? action.buttonClass : 'base-button--green'"
              @click="$emit('actionClick', action.key)"
              :disabled="!!action.disabled"
          >
            |  {{ action.text }}
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/v2/base-button";

export default {
  name: 'EmptyState',
  components: {
    BaseButton
  },
  props: {
    headerText: {
      type: String
    },
    messageText: {
      type: String
    },
    actions: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.empty-state {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: $white;
  z-index: 10;

  &__content {
    margin: 0;
    position: absolute;
    width: 100%;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    text-align: center;
  }

  &__header {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    color: $blue-dark;
  }

  &__message {
    margin: 20px auto;
    max-width: 480px;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: $text-dark;
  }

  &__actions {
    margin-top: 20px;
    text-align: center;

    &__action {
      display: inline-block;
      margin: 0 10px;

      .base-button {
        padding: 0 20px;
      }
    }
  }

  &--transparent {
    opacity: 0.8;
  }

  &__loading-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.6);
  }
}
</style>