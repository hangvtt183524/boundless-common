<template>
  <div class="activity-log">
    <base-table
        :items="activityLogs"
        :headers="headers"
        :custom-pagination="pagination"
        :is-expandable="true"
        :is-external-sort="true"
        :page-size-options="[15, 30, 50]"
        @pageLinkClick="onTablePageLinkClick"
        @pageSizeInput="onTablePageSizeInput"
        @sortOrderChange="onSortOrderChange"
        @rowExpand="onRowExpand"
    >
      <template v-slot:row-expand-area='props'>
        <div class="activity-log__entities-row">
          <base-table
              :items="props.props.item.entities"
              :headers="entityTableHeaders"
              :sortable="false"
              @rowClick="onEntityRowClick"
          />
        </div>
      </template>
    </base-table>

    <div class="activity-log__loading-indicator" v-if="loading">
      <v-progress-circular :size="50" indeterminate color="#15ac2f" />
    </div>

    <activity-log-detail-modal
        :show="showActivityLogDetailDialog"
        :entity="selectedEntity"
        @close="onDetailModalClose"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/common/base-table";
import ActivityLogDetailModal from "@/components/activity-log/activity-log-detail-modal"

import UserPermissionsMixin from "@/mixins/user-permissions.mixin";
import CurrentUserMixin from "@/mixins/current-user.mixin";
import CurrentOrgMixin from "@/mixins/current-org.mixin";
import {mapActions, mapGetters} from "vuex";

import * as GlobalCellFormatters from '@/utils/global-cell-formatters'

export default {
  name: 'ActivityLog',
  components: {
    BaseTable,
    ActivityLogDetailModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentOrgMixin,
    CurrentUserMixin
  ],
  props: {
    userId: {
      type: Number,
      default: 0
    },
    ancestorId: {
      type: Number,
      required: true
    },
    workspaceId: {
      required: false
    },
    pageSize: {
      type: Number,
      default: 30
    },
    search: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      entityTableHeaders: [
        {
          text: 'State Before',
          value: 'state_before',
          formatter: this.jsonFormatter,
          type: 'json'
        },
        {
          text: 'State After',
          value: 'state_after',
          formatter: this.jsonFormatter,
          type: 'json'
        }
      ],
      loading: false,
      page: 1,
      showActivityLogDetailDialog: false,
      selectedEntity: {},
      ordering: null
    }
  },
  computed: {
    ...mapGetters('workspace', ['activityLogs', 'activityLogsCount']),
    headers () {
      const headers = [
        {
          text: 'Date',
          value: 'time',
          formatter: GlobalCellFormatters.dateTimeFormatter
        },
        {
          text: 'User',
          value: 'user.profile.full_name',
          sortKey: 'user__profile__first_name'
        },
        {
          text: 'Site group',
          value: 'node_name',
          sortKey: 'entities__node__name'
        },
        {
          text: 'Action',
          value: 'action_type'
        },
        {
          text: 'Content',
          value: 'content_type',
          sortKey: 'content_type__model'
        }
      ]

      if (this.userId) {
        headers.splice(1, 1)
      }

      if (this.workspaceId) {
        headers.splice(2, 0, {
          text: 'Workspace / Organization',
          value: 'parent_name',
          sortable: false
        })
      }

      return headers
    },
    pagination () {
      return {
        page: this.page,
        pageSize: this.pageSize,
        total: this.activityLogsCount
      }
    }
  },
  mounted () {
    this.fetchLogs()
  },
  methods: {
    ...mapActions('workspace', ['fetchActivityLogs']),
    fetchLogs () {
      let filters = {
        page_size: this.pageSize,
        page: this.page
      }

      if (this.workspaceId) {
        filters.workspace = this.workspaceId
      }

      if (this.ancestorId > -1) {
        filters.ancestor = this.ancestorId
      }

      if (this.userId) {
        filters.user = this.userId
      }

      if (this.search) {
        filters.search = this.search
      }

      if (this.ordering) {
        filters.ordering = this.ordering
      }

      this.loading = true
      this.fetchActivityLogs({ filters }).then((response) => {
        this.loading = false
      })
    },
    onTablePageLinkClick (pageNumber) {
      this.page = pageNumber
      this.fetchLogs()
    },
    onTablePageSizeInput (pageSize) {
      // xem lai doan nay
      // this.pageSize = pageSize
      this.page = 1

      this.fetchLogs()
    },
    onSortOrderChange (ordering) {
      this.ordering = ordering
      this.page = 1

      this.fetchLogs()
    },
    onRowExpand () {
      // EventTracker.sendEvent(EVENT_NAMES.ACTIVITY_LOG_ENTRY_VIEWED)
    },
    onEntityRowClick (row) {
      this.selectedEntity = row
      this.showActivityLogDetailDialog = true
    },
    onDetailModalClose () {
      this.showActivityLogDetailDialog = false
    }
  },
  watch: {
    ancestorId () {
      this.page = 1

      this.fetchLogs()
    },
    search: {
      handler: function () {
        this.page = 1
        this.fetchLogs()

        // EventTracker.sendEvent(EVENT_NAMES.ACTIVITY_LOG_SEARCHED)
      },
      deep: true
    }
  },
}
</script>