import { mapGetters } from 'vuex'

import UserPermissionsMixin from "@/mixins/user-permissions.mixin";
import CurrentNodeSelectionsMixin from "@/mixins/current-node-selections.mixin";

export default {
    mixins: [
        UserPermissionsMixin,
        CurrentNodeSelectionsMixin
    ],
    computed: {
        ...mapGetters('layout', ['activeProductIndex', 'selectedOrganization']),
        ...mapGetters('workspace/network', ['userDashboards'])
    },
    methods: {
        isMenuItemVisible (menuItem) {
            return menuItem
        },
        checkMenuItemConditions (menuItem) {
            if (menuItem.conditions && menuItem.conditions.length) {
                for (let i = 0; i < menuItem.conditions.length; i++) {
                    const condition = menuItem.conditions[i]
                    const method = typeof condition === 'object' ? condition.method : condition
                    const methodArguments = typeof condition === 'object' ? (condition.arguments || []) : []

                    if (typeof condition === 'object' && condition.environments &&
                        condition.environments.indexOf(process.env.VUE_APP_MODE) === -1) {
                        // Condition is limited to environments and that list doesn't contain current environment
                        continue
                    }

                    if (!this[method] || !this[method](...(methodArguments))) {
                        return false
                    }
                }
            }

            return true
        },
        isTabHeaderVisible (tab) {
            // Check permissions
            if (!this.isMenuItemPermitted(tab)) {
                return false
            }

            // Check display conditions
            if (!this.checkMenuItemConditions(tab)) {
                return false
            }

            return true
        },
    }
}