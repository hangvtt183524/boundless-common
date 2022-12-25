<template>
  <base-modal class="discard-confirm-modal" :show='show' @close='close' max-width='640px'>
    <template v-slot:header>
      <div class="discard-confirm-modal--header">
        <v-layout>
          <v-flex xs12>
            <div class="discard-confirm-modal--title">
              {{ titleValue }}
            </div>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:default>
      <div class="discard-confirm-modal--content">
        <v-layout>
          <v-flex xs12>
            <div>
              <span v-html="textValue"></span>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </template>

    <template v-slot:footer>
      <div class="discard-confirm-modal--footer">
        <v-layout>
          <v-flex xs12>
            <base-button class="base-button--danger base-button--large"
                         @click="onDiscardClick"
            >
              Discard Changes
            </base-button>

            <base-button class="base-button--green base-button--large"
                         v-if="!hideSaveAndExit"
                         @click="onSaveAndContinueClick"
            >
              Save and Exit
            </base-button>

            <base-button class="base-button--green--negative base-button--large"
                         @click="onBackClick"
            >
              Continue Editing
            </base-button>
          </v-flex>
        </v-layout>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "@/components/v2/base-modal";
import BaseButton from "@/components/v2/base-button";

export default {
  name: 'discard-confirm-modal',
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    hideSaveAndExit: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      resolve: null,
      reject: null,
      title: null,
      text: null,
      show: false,
      choices: {
        discard: 'discard',
        saveAndExit: 'saveAndExit',
        back: 'back'
      }
    }
  },
  computed: {
    titleValue () {
      return this.title ? this.title : 'Discarding Changes'
    },
    textValue () {
      return this.text ? this.text : 'You have unsaved changes. Are you sure you want to discard them and leave the page?'
    }
  },
  methods: {
    open (title, text) {
      this.title = title
      this.text = text
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close () {
      this.resolve(this.choices.back)
      this.show = false
    },
    onDiscardClick () {
      this.resolve(this.choices.discard)
      this.show = false
    },
    onBackClick () {
      this.close()
    },
    onSaveAndContinueClick () {
      this.resolve(this.choices.saveAndExit)
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.discard-confirm-modal {

  &--header {

  }

  &--title {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 30px;
    line-height: 26px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-align: center;
    color: $blue-dark;
  }

  &--content {
    width: 360px;
    margin: 60px auto;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    color: black;
  }

  &--footer {
    margin-top: 50px;
    text-align: center;

    .base-button {
      width: 160px;

      &:not(:last-child) {
        margin-right: 24px;
      }
    }
  }
}
</style>