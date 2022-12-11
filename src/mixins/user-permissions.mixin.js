import {mapActions, mapGetters} from 'vuex'

import CurrentProductSelectionsMixin from "@/mixins/current-product-selections.mixin";

let UserPermissionsMixin = {
    mixins: [CurrentProductSelectionsMixin],
    computed: {
        ...mapGetters('user', ['currentUser']),
        ...mapGetters('layout', ['selectedWorkspace', 'selectedOrganization', 'selectedNode', 'userWorkspaces',
            'userWorkspaceOrganizations', 'userOrganizationNodes']),

    },
    methods: {
        isMenuItemPermitted (menuItem) {
            if (menuItem.permission_sets) {
                let nodeId
                if (menuItem.permission_scope) {
                    if (menuItem.permission_scope === 'workspace') {
                        nodeId = this.selectedWorkspace ? this.selectedWorkspace.id : null
                    } else if (menuItem.permission_scope === 'organization') {
                        nodeId = this.selectedOrganization ? this.selectedOrganization.id : null
                    } else if (menuItem.permission_scope === 'node') {
                        nodeId = this.selectedNode ? this.selectedNode.id : null
                    }
                } else {
                    nodeId = this.selectedWorkspace ? this.selectedWorkspace.id : null
                }

                let hasPermission = false
                menuItem.permission_sets.forEach(permissionSet => {
                    let isPermissionSetPasses = true
                    permissionSet.forEach(action => {
                        isPermissionSetPasses = (isPermissionSetPasses && this.hasPermission(action, nodeId))
                    })
                    hasPermission = hasPermission || isPermissionSetPasses
                })

                if (!hasPermission) {
                    return false
                }
            }
            return true
        }
    },
    hasPermission (action, nodeId, productUserObject = null) {

    }
}

export default UserPermissionsMixin