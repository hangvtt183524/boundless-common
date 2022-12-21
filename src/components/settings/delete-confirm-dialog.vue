<template>
  <v-dialog class="base-dialog"
            v-model="dialog"
            :max-width="options.width"
            @keydown.esc="cancel()"
            @close="cancel"
            @input="cancel"
            content-class="organization-confirm-delete"
  >
    <div class="confirm-delete" data-test="confirm-delete">
      <v-icon class="close-modal" @click.stop="cancel()">close</v-icon>

      <h2 class="dialog-heading" v-show="title">{{ title }}</h2>

      <h4 class="dialog-subtitle">Type the following sentence to confirm:</h4>

      <div class="suggest-text">
        <p class="pre-wrap">{{ options.confirmText }}</p>
      </div>

      <div class="confirm-text-label">Type sentence here</div>

      <v-text-field class="transparent"
                    data-test="confirm-text"
                    v-model="confirmationText"
                    placeholder="Type the sentence here"
                    solo-inverted
      />

      <base-button class="base-button--danger"
                   data-test="btn-delete"
                   :disabled="!matchesResponse"
                   @click="agree()"
      >
        {{ options.deleteButtonText }}
      </base-button>
    </div>
  </v-dialog>
</template>

<script>
import BaseButton from "@/components/v2/base-button";

export default {
  components: {
    BaseButton
  },
  data () {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      title: null,
      options: {
        color: 'primary',
        width: 290,
        confirmText: '',
        successMessage: '',
        deleteButtonText: ''
      },
      confirmationText: ''
    }
  },
  methods: {
    cancel () {
      this.resolve(false)
      this.dialog = false
      this.confirmationText = ''
    },
    agree () {
      this.dialog = false
      this.resolve(true)
      if (this.options.successMessage) {
        global.toastr['success'](this.options.successMessage, 'Success')
      }
    },
    open (title, options) {
      this.dialog = true
      this.title = title
      this.options = Object.assign({}, this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
  },
  computed: {
    matchesResponse () {
      return this.options.confirmText.toLowerCase() === this.confirmationText.toLowerCase()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.confirm-delete {
  .dialog-heading {
    font-size: 30px;
    font-weight: normal;
  }
  .dialog-subtitle {
    margin-top: 43px;
    font-weight: normal;
    font-size: 16px;
    line-height: 25px;
    color: $text-medium;
  }
  .suggest-text {
    padding: 4px 12px;
    background: $gray-xlight;

    p {
      margin: 0;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 26px;

      display: flex;
      align-items: center;

      color: #223D70;
    }
  }
  .confirm-text-label {
    margin-top: 28px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: $text-medium;
  }
  .transparent {
    padding-top: 0 !important;
  }
  .base-button--danger {
    padding: 0 34px;
    margin-bottom: 12px;
  }
}
</style>