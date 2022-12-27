<template>
  <vue-dropzone
      :options="dropzoneOptions"
      @vdropzone-file-added="fileAdded"
      @vdropzone-removed-file="removedFile"
      @vdropzone-success="success"
      id="dropzone"
      ref="dropzone"
  />
</template>

<script>
import VueDropzone from 'vue2-dropzone'

import Ls from '@/services/ls.js'

export default {
  props: {
    options: {
      type: Object,
      required: false
    }
  },
  components: {
    VueDropzone
  },
  computed: {
    dropzoneOptions () {
      const defaultOptions = {
        method: 'put',
        thumbnailWidth: 180,
        thumbnailHeight: 150,
        dictDefaultMessage: '<i class="fas fa-cloud-upload-alt"></i> Click or drag file here to upload',
        maxFiles: 2,
        multiple: false,

        addRemoveLinks: true,
        headers: this.headers
      }
      if (this.options) {
        Object.assign(defaultOptions, {}, this.options)
      }
      return defaultOptions
    },
    headers () {
      const AUTH_TOKEN = Ls.get('auth.token')
      const headers = {
        'Cache-Control': null
      }
      if (AUTH_TOKEN) {
        headers['Authorization'] = `Bearer ${AUTH_TOKEN}`
      }
      return headers
    }
  },
  methods: {
    fileAdded (file) {
      if (!this.dropzoneOptions.multiple) {
        const dropzoneComponent = this.$refs.dropzone
        if (dropzoneComponent.dropzone.files.length > this.dropzoneOptions.maxFiles - 1) {
          dropzoneComponent.removeFile(dropzoneComponent.dropzone.files[0])
        }
      }
      this.$emit('file-added', file)
    },
    removedFile (file, error, xhr) {
      this.$emit('removed-file', file)
    },
    success (file, response) {
      this.$emit('success', { file, response })
    }
  }
}
</script>