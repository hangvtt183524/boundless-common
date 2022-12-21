<template>
  <base-modal
      class="job-tracking-modal"
      :show="show"
      @close="close"
      max-width="520px"
      :persistent="persistent"
  >
    <template v-slot:default>
      <div class="job-tracking-modal__content">
        <div class="progress" v-if="status === jobStatuses.pending || status === jobStatuses.running">
          <div class="progress__title" v-html="title"></div>

          <div class="progress__icon-container">
            <v-progress-circular class="progress__icon-container__icon" :size="50" indeterminate color="#15ac2f" />
          </div>

          <div class="progress__description">| {{ text }}</div>

          <div class="progress__info" v-if="progressInfo">
            {{ eventsText[progressInfo.code] }}
            <span v-if="progressInfo.extra_info"
                  v-html="getFormattedMessageExtraInfo(progressInfo)"
            ></span>
          </div>
        </div>

        <div class="post-run-messages" v-if="isFinished && displayPostRunMessages && postRunMessages.length > 0">
          <div class="post-run-messages__title">| {{ title }}</div>

          <div class="post-run-messages__description">
            Job execution messages:
          </div>

          <ul>
            <li class="post-run-messages__message"
                v-for="(message, index) of postRunMessages"
                :key="index"
                :class="[
                    {'post-run-messages__message--error': errors.indexOf(message) > -1},
                    {'post-run-messages__message--warning': warnings.indexOf(message) > -1}
                ]"
            >
              <span v-html="eventsText[message.code]"></span>

              <span v-if="message.extra_info"
                    v-html="getFormattedMessageExtraInfo(message)"
              ></span>

              <div class="post-run-messages__message" v-if="message.text"
                   v-html="'Error text: ' + message.text"
              ></div>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="job-tracking-modal__footer" v-if="(!persistent || dismissible || isFinished) && !closing">
        <v-layout row wrap>
          <v-flex xs12>
            <base-button class="base-button--green--negative" @click="close">
              {{ isFinished ? 'Close' : 'Hide' }}
            </base-button>

            <div class="job-tracking-modal__footer__dismiss-info"
                 v-if="dismissible && !isFinished && dismissInfo"
            >
              {{ dismissInfo }}
            </div>
          </v-flex>
        </v-layout>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "@/components/v2/base-modal";
import BaseButton from "@/components/v2/base-button";
import CurrentNodeSelectionsMixin from "@/mixins/current-node-selections.mixin";
import {mapActions} from "vuex";

export default {
  name: 'job-tracking-modal',
  components: {
    BaseModal,
    BaseButton
  },
  mixins: [
      CurrentNodeSelectionsMixin
  ],
  props: {
    persistent: {
      type: Boolean,
      default: false
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    displayPostRunMessages: {
      type: Boolean,
      default: false
    },
    dismissInfo: {
      type: String,
      required: false
    },
    suppressDefaultMessages: {
      type: Boolean,
      default: false
    },
    statusCheckInterval: {
      type: Number,
      default: 2000
    },
    messageInfoFormatter: {
      type: Function,
      required: false
    },
    ignoreWarningsForStatus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      jobStatuses: {
        pending: 'pending',
        running: 'running',
        successful: 'successful',
        failed: 'failed'
      },
      jobId: null,
      progressInfo: null,
      status: 'pending',
      title: null,
      text: null,
      show: false,
      closing: false,
      errors: [],
      warnings: [],
      successMessage: null,
      eventsText: {
        "configuration": "Setting configurations for network",
        "execution": "Executing changes on Meraki",
        "reading_configuration": "Reading configurations for network",
        "row_process": "Processing row ",
        "organization_create": "Creating organization ",
        "organization_import": "Started data synchronization for organization: ",
        "organization_import_complete": "Data synchronization completed for organization: ",
        "network_import": "Importing networks for organization: ",
        "network_import_complete": "Imported all networks for organization: ",
        "template_import": "Importing templates for organization: ",
        "template_import_complete": "Imported all templates for organization: ",
        "ssid_import": "Importing ssids for network: ",
        "ssid_import_complete": "Imported all ssids for network: ",
        "network_configuration_import": "Importing configurations for network: ",
        "network_configuration_import_complete": "Imported all configurations for network: ",
        "device_import": "Importing devices for organization: ",
        "device_import_complete": "Imported all devices for organization: ",
        "switch_stack_import": "Importing switch stacks for network: ",
        "switch_stack_import_complete": "Imported all switch stacks for network: ",
        "switch_port_aggregations_import": "Importing switch port aggregations for network: ",
        "switch_port_aggregations_import_complete": "Imported all switch port aggregations for network: ",
        "administrator_import": "Importing administrators for organization: ",
        "administrator_import_complete": "Imported all administrators for organization: ",
        "client_import": "Importing clients for organization: ",
        "client_import_complete": "Imported all recent clients for organization: ",
        "device_monitoring_import": "Importing device monitoring data for organization: ",
        "device_monitoring_import_complete": "Imported device monitoring data for organization: ",
        "network_clone": "Cloning network: ",
        "organization_clone_failure": "Failed to clone organization",
        "clone_network_create_failure": "Failed to create clone network: ",
        "clone_network_bind_failure": "Failed to bind clone network to config template: ",
        "action_batch_error": "Meraki API error.",
        "device_move_start": "Started moving device: ",
        "device_setting_read_error": "Failed to read setting for device: ",
        "device_move_success": "Moved device to target network. Now copying configurations: ",
        "device_move_error": "Failed to move device to target network: ",
        "device_setting_set_error": "Failed to configure setting for device: ",
        "device_move_complete": "Device has successfully been moved to target network: ",
        "switch_stack_setting_read_error": "Failed to read settings for switch stack: ",
        "switch_stack_setting_set_error": "Failed to configure settings for switch stack: ",
        "switch_port_aggregation_setting_read_error": "Failed to read settings for switch port aggregation: ",
        "switch_port_aggregation_setting_set_error": "Failed to configure settings for switch port aggretaion: ",
        "revert_move_start": "Device configuration failed. Reverting back into original network: ",
        "revert_move_success": "Successfully reverted device back into original network: ",
        "revert_move_error": "Failed to revert device back into original network: ",
        "device_move_across_shard_retry": "It will take a little bit longer for this device to be moved to its target. We will continue the operation in the background and notify you via email when complete: ",
        "organization_configuration_start": "Started configuring organization: ",
        "organization_configuration_complete": "Configuring complete for organization: ",
        "organization_disconnect_start": "Started disconnecting organization: ",
        "organization_disconnect_complete": "Disconnect complete for organization: ",
        "organization_user_migrate": "Migrating email login users to SAML",
        "user_add_success": "Successfully sent invitation for ",
        "user_add_failure": "Failed to send invitation for ",
        "user_remove_success": "Access revoke successful for ",
        "user_remove_failure": "Access revoke failed for ",
        "user_permission_update_success": "Access update successful for ",
        "user_permission_update_failure": "Access update failed for ",
        "organization_retrieve_api_failure": "Failed to retrieve organization data from Meraki. Please make sure you have at least 'read-only' access on the organization: ",
        "user_add_pending_invitation": "User needs to confirm their account first before being added to other organizations. We have saved this invitation, and will keep trying to send it as soon as user confirms their account. <br>User: ",
        "client_exports_start": "Started preparing export file",
        "client_exports_success": "Export file successfully prepared",
        "network_configuration_failure": "Network setting configuration failure: <br />",
        "target_network_get_failure": "Failed getting target network from Meraki. Please make sure your API key is valid, then refresh your Meraki Organization data and try again.<br />",
        "target_network_create_failure": "Failed creating target network on Meraki. Please make sure your API key is valid, and you don't have an existing network with the same on on target organization.<br />"
      }
    }
  },
  computed: {
    isFinished () {
      return this.status === this.jobStatuses.successful || this.status === this.jobStatuses.failed
    },
    postRunMessages () {
      return this.warnings.concat(this.errors)
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchLongRunningJob']),
    open (jobId, title, text, successMessage) {
      this.jobId = jobId
      this.title = title
      this.text = text
      this.successMessage = successMessage

      this.resetState()

      this.show = true

      this.trackJob()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    resetState () {
      this.progressInfo = null
      this.status = 'pending'
      this.errors = []
      this.warnings = []
      this.closing = false
    },
    trackJob () {
      const jobData = {
        workspaceId: this.workspaceId,
        jobId: this.jobId
      }

      this.fetchLongRunningJob(jobData).then(response => {
        const jobData = response.data.data

        this.status = jobData.status

        if (jobData.status === this.jobStatuses.successful || jobData.status === this.jobStatuses.failed) {
          this.onJobFinish(jobData)
        } else if (jobData.status === this.jobStatuses.pending || jobData.status === this.jobStatuses.running) {
          this.progressInfo = jobData.events.filter(event => {
            return event.type === 'info'
          }).slice(-1)[0]

          setTimeout(this.trackJob.bind(this), this.statusCheckInterval)
        }
      }).catch(() => {
        if (!this.suppressDefaultMessages) {
          global.toastr['error']('Job failed', 'Error')
        }

        this.status = this.jobStatuses.failed
        this.close(false)
      })
    },
    onJobFinish (jobData) {
      const isSuccess = jobData.status === this.jobStatuses.successful
      if (!this.suppressDefaultMessages) {
        if (isSuccess) {
          global.toastr['success']('Job has run successfully', 'Success')
        } else {
          global.toastr['error']('Job failed', 'Error')
        }
      }

      if (this.displayPostRunMessages) {
        this.errors = jobData.events.filter(event => {
          return event.type === 'error' && this.eventsText[event.code]
        })

        this.warnings = jobData.events.filter(event => {
          return event.type === 'warning' && this.eventsText[event.code]
        })

        if (this.postRunMessages.length === 0) {
          this.close(isSuccess)
        }
      } else {
        this.close(isSuccess)
      }
    },
    close (result) {
      if (result === undefined) {
        result = this.status === this.jobStatuses.successful &&
            (this.ignoreWarningsForStatus || this.warnings.length === 0)
      }

      this.closing = true
      this.resolve(result)

      this.show = false
    },
    getFormattedMessageExtraInfo (message) {
      if (this.messageInfoFormatter) {
        return this.messageInfoFormatter(message)
      }

      return message.extra_info
    },
  },
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.job-tracking-modal {

  &__content {
    padding: 35px 0 45px 0;

    .progress {
      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 26px;
        line-height: 31px;
        text-align: center;
        color: $blue-dark;
      }

      &__icon-container {
        text-align: center;
        margin-top: 50px;
      }

      &__description {
        width: 320px;
        margin: 50px auto 0 auto;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;

        text-align: center;
        color: $text-dark;
      }

      &__info {
        margin-top: 10px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;

        text-align: center;
        color: $blue-reserve;

        span {
          margin-left: 10px;
        }
      }
    }

    .post-run-messages {
      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 26px;
        line-height: 31px;
        text-align: center;
        color: $blue-dark;
      }

      &__description {
        width: 360px;
        margin: 50px auto;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;

        text-align: center;
        color: $text-dark;
      }

      &__message {
        margin-bottom: 15px;

        &__text {
          margin-top: 5px;
        }

        &--error {
          color: $danger;
        }

        &--warning {
          color: $warning;
        }
      }
    }
  }

  &__footer {
    margin-top: 30px;
    text-align: center;

    &__dismiss-info {
      margin-top: 10px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;

      text-align: center;
      color: $text-medium;
    }
  }
}
</style>