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
        }
    }
}