<template>
  <editable-panel
      data-test="personal-info"
      :is-editing="isEditing"
      :is-loading="isLoading"
      title="Personal information"
      :disableSubmit="disableSubmit"
      @cancel="cancel"
      @edit="edit"
      @submit="submit"
  >
    <v-layout row wrap slot-scope="{readonly}">
      <v-flex xs12 md6 px-3>
        <node-name-input
            data-test="name"
            :error-messages="getVueErrors('formData.first_name')"
            label="Firstname"
            :readonly="readonly"
            placeholder="--"
            required
            v-model="formData.first_name"
            @blur="$v.formData.first_name.$touch()"
            @input="$v.formData.first_name.$touch()"
        />
      </v-flex>

      <node-name-input
          class="last-name"
          data-test="name"
          :error-messages="getVueErrors('formData.last_name')"
          label="Lastname"
          :readonly="readonly"
          placeholder="--"
          required
          v-model="formData.last_name"
          @blur="$v.formData.last_name.$touch()"
          @input="$v.formData.last_name.$touch()"
      />

      <v-flex xs12 md6 px-3>
        <node-name-input class="job"
                         data-test="job"
                         :error-messages="getVueErrors('formData.job_title')"
                         label="Job Title"
                         :readonly="readonly"
                         placeholder="--"
                         v-model="formData.job_title"
                         @blur="$v.formData.job_title.$touch()"
                         @input="$v.formData.job_title.$touch()"
        />
      </v-flex>

      <v-flex xs12 md6 px-3>
        <tel-input
            class="phone"
            :readonly="readonly"
            placeholder="--"
            v-model="formData.phone"
            :error-messages="phoneErrors"
            @input="$v.formData.phone.$reset"
            @blur="$v.formData.phone.$touch"
        />
      </v-flex>
    </v-layout>
  </editable-panel>
</template>

<script>
import EditablePanel from "@/components/common/editable-panel";
import NodeNameInput from "@/components/common/node-name-input";
import TelInput from "@/components/common/tel-input/tel-input";

import ErrorHandlerMixin from "@/mixins/error-handler.mixin";
import EditablePanelMixin from "@/mixins/editable-panel.mixin";
import CurrentUserMixin from "@/mixins/current-user.mixin";
import { required, maxLength } from 'vuelidate/lib/validators'
import { nonBlank } from '@/utils/validators'
import { isValidNumber } from 'libphonenumber-js'

export default {
  components: {
    EditablePanel,
    NodeNameInput,
    TelInput
  },
  mixins: [
      CurrentUserMixin,
      EditablePanelMixin,
      ErrorHandlerMixin
  ],
  validations: {
    formData: {
      first_name: {
        required,
        nonBlank,
        maxLength: maxLength(64)
      },
      last_name: {
        required,
        nonBlank,
        maxLength: maxLength(64)
      },
      job_title: {
        nonBlank,
        maxLength: maxLength(64)
      },
      phone: {
      }
    }
  },
  data () {
    return {
      formData: {
        job_title: '',
        first_name: '',
        last_name: '',
        phone: ''
      },
      phoneValid: false
    }
  },
  mounted() {
    this.setFormData()
  },
  computed: {
    disableSubmit () {
      return this.$v.formData.$invalid || !this.phoneValidation
    },
    phoneValidation () {
      if (!this.formData.phone) {
        return true
      }
      return isValidNumber(this.formData.phone)
    },
    phoneErrors () {
      const errors = []
      const phone = this.$v.formData.phone
      if (!phone.$dirty) return errors
      return errors
    },
  },
  methods: {
    setFormData () {
      const profile = this.profile
      this.formData = Object.assign({}, this.formData, {
        job_title: profile.job_title,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone
      })
    },
    submit () {
      this.isLoading = true
      this.$v.$touch()
      this.clearErrorData()

      if (!this.$v.formData.$invalid) {
        this.updateCurrentUser({ profile: this.formData }).then(response => {
          this.setFormData()
          this.isEditing = false
          this.isLoading = false
          this.showSuccessMessage()
        }).catch(error => {
          this.setErrorData(error)
          this.isLoading = false
        })
      }

      // EventTracker.sendEvent(EVENT_NAMES.PERSONAL_INFO_UPDATED, {
      //   changed_fields: ['job_title', 'first_name', 'last_name', 'phone'].filter(field => this.profile[field] !== this.formData[field])
      // })
      this.isLoading = false
    }
  }
}
</script>