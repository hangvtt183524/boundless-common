<template>
  <panel-container title="API key" data-test="boundless-api-info">
    <v-layout row pt-2>
      <v-flex :class="clipBoardBtnClass" v-if="formData.boundless_api_key">
        <span class="d-inline-block">
          <v-btn icon class="btn-copy-board" @click="copyToClipboard" data-test="btn-copy-board">
            <v-icon>file_copy</v-icon>
          </v-btn>
        </span>
      </v-flex>

      <v-flex xs12 px-3 v-if="hasKey">
        <v-text-field
            class="boundless-api-key"
            data-test="boundless-api-key"
            :append-icon="deleteIcon"
            @click:append="showDeleteDialog"
            :hint="hint"
            @click="copyToClipboard"
            label="API key"
            placeholder="--"
            persistent-hint
            readonly
            v-model="formData.boundless_api_key"
        />
      </v-flex>

      <v-flex :class="generateBtnContainerClass">
        <v-btn
            class="btn-key-generate"
            data-test="btn-key-generate"
            :class="generateBtnClass"
            :loading="isLoading"
            @click="onGenerateClick"
            color="primary"
            round
        >
          Generate New Key
        </v-btn>
      </v-flex>
    </v-layout>

    <confirm-dialog ref="confirmDialog" />
  </panel-container>
</template>

<script>
import PanelContainer from "@/components/common/panel-container";
import ConfirmDialog from "@/components/common/confirm-dialog";
import CurrentUserMixin from "@/mixins/current-user.mixin";
import {mapActions} from "vuex";

export default {
  name: "BoundlessApiInfo",
  components: {
    PanelContainer,
    ConfirmDialog
  },
  mixins: [
      CurrentUserMixin
  ],
  data () {
    return {
      formData: {
        boundless_api_key: ''
      },
      hint: '',
      isLoading: false
    }
  },
  computed: {
    hasKey () {
      return Boolean(this.formData.boundless_api_key)
    },
    clipBoardBtnClass () {
      return {
        'x1': this.hasKey,
        'xs12': !this.hasKey,
        'pt-2': this.hasKey,
        'pb-3': !this.hasKey,
        'pt-1': !this.hasKey,
        'px-5': !this.hasKey
      }
    },
    generateBtnContainerClass () {
      return {
        'x1': this.hasKey,
        'xs12': !this.hasKey,
        'pt-2': this.hasKey,
        'pb-3': !this.hasKey,
        'pt-1': !this.hasKey,
        'px-5': !this.hasKey
      }
    },
    generateBtnClass () {
      return {
        'btn--small': this.hasKey,
        'btn--large': !this.hasKey,
        'btn--block': !this.hasKey
      }
    },
    deleteIcon () {
      return this.hasKey ? 'close' : null
    },
  },
  mounted() {
    this.setFormData()
  },
  methods: {
    ...mapActions('user', ['deleteBoundlessKey', 'generateBoundlessKey']),
    setFormData () {
      this.$set(this.formData, 'boundless_api_key', this.profile.boundless_api_key)
    },
    copyToClipboard () {
      if (this.formData.boundless_api_key) {
        this.$copyText(this.formData.boundless_api_key).then(e => {
          this.hint = 'Copied to clipboard'
          setTimeout(() => {
            this.hint = ''
          }, 2000)
        })
      }
    },
    showDeleteDialog () {
      this.$refs.confirmDialog.open(
          'Delete API Key', 'Are you sure you want to delete API key?', { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.deleteKey()
        }
      })
    },
    deleteKey () {
      this.isLoading = true
      this.deleteBoundlessKey().then(response => {
        this.setFormData()
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    onGenerateClick () {
      if (!this.hasKey) {
        this.submit()
      } else {
        this.showConfirmDialog()
      }
    },
    showConfirmDialog () {
      const message = `Are you sure you want to generate new key? This will make your existing key invalid`
      this.$refs.confirmDialog.open(
          'Generate New Key', message, { color: 'primary', width: 'auto' }
      ).then(confirm => {
        if (confirm) {
          this.submit()
        }
      })
    },
    submit () {
      this.isLoading = true
      this.generateBoundlessKey().then(response => {
        this.setFormData()
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    }
  }
}
</script>