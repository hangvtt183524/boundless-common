<template>
  <editable-panel
      data-test="preferences"
      :is-editing="isEditing"
      :is-loading="isLoading"
      title="Preferences"
      @cancel="cancel"
      @edit="edit"
      @submit="submit"
  >
    <v-form slot-scope="{readonly}">
      <v-layout row wrap>
        <v-flex xs12 md6 px-3>
          <v-select
              class="language"
              data-test="language"
              :items="getChoices('language')"
              label="Language"
              :readonly="readonly"
              item-text="display_name"
              placeholder="--"
              v-model="formData.language"
          />
        </v-flex>

        <v-flex xs12 md6 px-3>
          <v-select
              class="timezone"
              data-test="timezone"
              :items="getChoices('timezone')"
              label="Timezone"
              :readonly="readonly"
              item-text="display_name"
              placeholder="--"
              v-model="formData.timezone"
          />
        </v-flex>

        <v-flex xs12 md6 px-3>
          <v-select
              class="date-format"
              data-test="date-format"
              :items="getChoices('date-format')"
              label="Date Format"
              :readonly="readonly"
              item-text="display_name"
              placeholder="--"
              v-model="formData.date_format"
          />
        </v-flex>

        <v-flex xs12 md6 px-3>
          <v-select
              class="time-format"
              data-test="time-format"
              :items="getChoices('time-format')"
              label="Time Format"
              :readonly="readonly"
              item-text="display_name"
              placeholder="--"
              v-model="selectedTimeFormat"
          />
        </v-flex>

        <v-flex xs12 md6 px-3>
          <v-select
              class="first-day-of-week"
              data-test="first-day-of-week"
              :items="getChoices('first-day-of-week')"
              label="First Day of Week"
              :readonly="readonly"
              item-text="display_name"
              placeholder="--"
              v-model="formData.first_day_of_week"
          />
        </v-flex>
      </v-layout>
    </v-form>
  </editable-panel>
</template>

<script>
import EditablePanel from "@/components/common/editable-panel";

import EditablePanelMixin from "@/mixins/editable-panel.mixin";
import CurrentUserMixin from "@/mixins/current-user.mixin";
import ErrorHandlerMixin from "@/mixins/error-handler.mixin";
import timezoneList from '@/utils/timezone-list'

export default {
  name: 'Preferences',
  components: {
    EditablePanel
  },
  mixins: [
      CurrentUserMixin,
      EditablePanelMixin,
      ErrorHandlerMixin
  ],
  data () {
    return {
      formData: {
        language: '',
        date_format: '',
        timeFormat: '',
        timezone: '',
        first_day_of_week: ''
      },
      selectedTimeFormat: '',
      timeFormatChoices: [
        { value: '12-hour', text: '12-hour time' },
        { value: '24-hour', text: '24-hour time' }
      ]
    }
  },
  mounted() {
    this.setFormData()
  },
  methods: {
    setFormData () {
      const profile = this.profile
      this.formData = Object.assign({}, this.formData, {
        language: profile.language,
        date_format: profile.date_format,
        timezone: profile.timezone,
        use_24h_clock: profile.use_24h_clock,
        first_day_of_week: profile.first_day_of_week
      })
      this.selectedTimeFormat = profile.use_24h_clock ? '24-hour' : '12-hour'
    },
    submit () {
      this.isLoading = true

      const use24hClock = this.selectedTimeFormat === '24-hour'
      this.$set(this.formData, 'use_24h_clock', use24hClock)

      this.updateCurrentUser({ profile: this.formData }).then(response => {
        this.isLoading = false
        this.isEditing = false
        this.showSuccessMessage()
        window.location.reload()
      }).catch(err => {
        this.isLoading = false
        this.setErrorData(err)
      })

      // EventTracker.sendEvent(EVENT_NAMES.PROFILE_PREFERENCES_UPDATED, {
      //   changed_fields: ['language', 'date_format', 'timezone', 'use_24h_clock', 'first_day_of_week'].filter(field => this.profile[field] !== this.formData[field])
      // })
    },
    getChoices (key) {
      try {
        if (key === 'language') {
          if (this.formData.language === 'en') {
            return [
              { display_name: 'English', value: 'en' },
              { display_name: 'French', value: 'fr' }
            ]
          }
          if (this.formData.language === 'fr') {
            return [
              { display_name: 'English', value: 'en' },
              { display_name: 'Francais', value: 'fr' }
            ]
          }
        } else if (key === 'first_day_of_week') {
          if (this.formData.language === 'en') {
            return [
              { display_name: 'Sunday', value: 0 },
              { display_name: 'Monday', value: 1 }
            ]
          }
          if (this.formData.language === 'fr') {
            return [
              { display_name: 'Dimanche', value: 0 },
              { display_name: 'Lundi', value: 1 }
            ]
          }
        } else if (key === 'time_format') {
          if (this.formData.language === 'en') {
            return [
              { value: '12-hour', display_name: '12-hour time' },
              { value: '24-hour', display_name: '24-hour time' }
            ]
          }
          if (this.formData.language === 'fr') {
            return [
              { value: '12-hour', display_name: '12 heures' },
              { value: '24-hour', display_name: '24 heures' }
            ]
          }
        } else if (key === 'timezone') {
          return timezoneList
        } else if (key === 'date_format') {
          return [
            { display_name: 'mm/dd/YYYY', value: 'mdy' },
            { display_name: 'dd/mm/YYYY', value: 'dmy' }
          ]
        }
      } catch (TypeError) {
        return []
      }
    }
  }
}
</script>