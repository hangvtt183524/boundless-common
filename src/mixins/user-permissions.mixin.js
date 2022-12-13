import {mapActions, mapGetters} from 'vuex'

import CurrentProductSelectionsMixin from "@/mixins/current-product-selections.mixin";

let UserPermissionsMixin = {
    mixins: [CurrentProductSelectionsMixin],
    computed: {
        ...mapGetters('user', ['currentUser']),
        ...mapGetters('layout', ['selectedWorkspace', 'selectedOrganization', 'selectedNode', 'userWorkspaces',
            'userWorkspaceOrganizations', 'userOrganizationNodes']),
        userActions () {
            const userActions = {}
            const userRoles = this.currentUser.roles ? this.currentUser.roles : []

            userRoles.forEach(userRole => {
                // eslint-disable-next-line no-prototype-builtins
                if (userActions.hasOwnProperty(userRole.node)) {
                    userRole.role_details.actions.forEach(actionData => {
                        const actionType = actionData.action.type
                        if (userActions[userRole.node].indexOf(actionType) === -1) {
                            userActions[userRole.node].push(actionType)
                        }
                    })
                } else {
                    if (!userRole.role_details || !userRole.role_details.actions) {
                        return
                    }
                    userActions[userRole.node] = userRole.role_details.actions.map(actionData => actionData.action.type)
                }
            })

            return userActions
        }
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
    hasDirectPermissionOnNode (action, nodeId) {
        // eslint-disable-next-line no-prototype-builtins
        return this.userActions.hasOwnProperty(nodeId) && this.userActions[nodeId].indexOf(action) > -1
    },
    hasAnyOrganizationPermission () {
        return this.userOrganizationNodes && this.userOrganizationNodes.length > 0
    },
    hasPermission (action, nodeId, productUserObject = null) {

    },
    isProductPermitted (product) {
        if (!product.product_permission_sets) {
            return true
        }
        const permissionCheckNodeId = this.organizationProducts.indexOf(product.identifier) > -1
            ? this.organizationId
            : this.workspaceId
        let hasPermission = false
        product.product_permission_sets.forEach(permissionSet => {
            let isPermissionSetPasses = true
            permissionSet.forEach(action => {
                isPermissionSetPasses = isPermissionSetPasses && (
                    // Must have permission defined on workspace / organization or global level
                    this.hasDirectPermissionOnNode(action, permissionCheckNodeId) ||
                    this.hasDirectPermissionOnNode(action, null)
                )
            })

            hasPermission = hasPermission || isPermissionSetPasses
        })

        return hasPermission
    }

}

export default UserPermissionsMixin