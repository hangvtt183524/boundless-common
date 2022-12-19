<template>
  <div class="permissions-table">
    <base-table
        :table-headers="userPermissionsHeaders"
        :items="permissions"
        :loading="isLoading"
        use-default-pagination
        @reloadData="fetchPermissions"
        item-key="id"
        hide-icon
    >
      <template slot="row-action" slot-scope="props">
        <v-tooltip bottom color="#9AA9C4" light>
          <template v-slot:activator="{ on }">
            <div class="row-popover-item" @click="showDeleteDialog(props.item)" v-on="on">
              <v-icon>delete</v-icon>
            </div>
          </template>

          <span>Delete</span>
        </v-tooltip>
      </template>
    </base-table>

    <confirm-dialog ref="confirmDialog" />
  </div>
</template>

<script>
import BaseTable from "@/components/common/base-table";
import ConfirmDialog from "@/components/common/confirm-dialog";
import {mapActions} from "vuex";

export default {
  props: {
    userId: {
      type: [String, Number]
    },
    isReload: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BaseTable,
    ConfirmDialog
  },
  data () {
    return {
      permissions: [],
      isLoading: true,
      userPermissionsHeaders: [
        { text: `Workspace/Site/group`, sortable: true, value: 'organization', selected: true },
        { text: 'Role', sortable: true, align: 'left', value: 'role', selected: true },
        { text: 'Reload', sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true }
      ]
    }
  },
  mounted () {
    this.fetchPermissions()
  },
  methods: {
    ...mapActions('user', ['fetchUserRoles', 'removeRoleFromUser']),
    fetchPermissions () {
      this.isLoading = true
      this.fetchUserRoles(this.userId).then(response => {
        this.permissions = response.data.data.results.map(item => {
          return {
            id: item.id,
            organization: item.node ? item.node_details.name : '',
            role: item.role ? item.role_details.title : ''
          }
        })
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    showDeleteDialog (item) {
      this.$refs.confirmDialog.open(
          'Remove Role', 'Are you sure to remove this role from user?', { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.removeRoleFromUser(item.id).then((response) => {
            global.toastr['success']('Deleted selected items from workspace successfully', 'Success')
            this.fetchPermissions()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  },
  watch: {
    isReload: {
      handler (val) {
        if (!val) {
          this.fetchPermissions()
        }
      }
    }
  }
}
</script>