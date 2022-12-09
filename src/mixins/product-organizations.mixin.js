import { mapGetters } from "vuex";

let ProductOrganizationsMixin = {
    data() {
        return {
            productIdentifiers: {
                captivePortal: 'captive_portal',
                networkManagement: 'network_management',
                accessControl: 'access_control'
            }
        }
    },
    computed: {
        ...mapGetters('layout', ['userWorkspaceOrganizations']),
        captivePortalOrganizations () {
            return this.getUserWorkspaceOrganizationsForProduct(this.productIdentifiers.captivePortal)
        }
    },
    methods: {
        getUserWorkspaceOrganizationsForProduct (productKey, requireMerakiSetup = false) {
            const organizations = requireMerakiSetup ?
                this.userWorkspaceOrganizations.filter(workspaceOrganization => workspaceOrganization.meraki_organization)
                : this.userWorkspaceOrganizations
            return organizations.filter(workspaceOrganization => workspaceOrganization.connected_products.indexOf(productKey) > -1)
        }
    }
}

export default ProductOrganizationsMixin