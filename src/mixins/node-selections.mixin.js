import _ from 'lodash'
import Ls from '@/services/ls'
import { mapActions, mapGetters } from 'vuex'
import ProductOrganizationsMixin from "@/mixins/product-organizations.mixin";
import CurrentProductSelectionsMixin from "@/mixins/current-product-selections.mixin";

let NodeSelectionsMixin = {
    data () {
        return {
            rootNodeTypes: {
                workspace: 'workspace',
                organization: 'organization'
            },
            layouts: {
                workspace: 'LayoutWorkspace',
                organization: 'LayoutOrganization',
                home: 'Home',
                login: 'LayoutLogin',
                oauthLogin: 'LoginAuthToken',
                main: 'LayoutMain',
                inviteSignup: 'InviteSignup',
                oauthSignup: 'OauthSignup',
                register: 'Register'
            }
        }
    },
    mixins: [
        CurrentProductSelectionsMixin,
        ProductOrganizationsMixin
    ],
    computed: {
        ...mapGetters('layout', ['userWorkspaces', 'userWorkspaceOrganizations', 'userOrganizationNodes', 'toolbarMenu',
            'hasWorkspaces', 'hasOrganizations', 'selectedWorkspace',
            'selectedWorkspace', 'selectedOrganization', 'selectedNode'])
    },
    methods: {
        ...mapActions('layout', ['fetchUserWorkspaces', 'selectWorkspace', 'clearWorkspaceSelections',
        'fetchUserWorkspaceOrganizations', 'selectOrganization', 'selectNode', 'clearOrganizationSelections']),

        selectActiveWorkspace () {
            let workspaceId = Number.parseInt(this.$route.params.workspaceId)
            if (!workspaceId) {
                workspaceId = Number.parseInt(Ls.getJson('layout.state', {}).workspace)
            }

            let workspace = this.getWorkspaceById(workspaceId)
            if (!workspace && this.hasWorkspaces) {
                workspace = this.userWorkspaces[0]
            }

            if (workspace) {
                this.selectWorkspace(workspace)
            } else {
                // No workspaces for user
                this.clearWorkspaceSelections()
                this.loadInitialPage()
                return
            }

            // If current product is not an organization product, directly load initial page
            if (!this.isOnOrganizationProduct) {
                this.loadInitialPage()
            }

            this.fetchUserWorkspaceOrganizations({ workspaceId: workspace.id }).then(() => {
                this.selectActiveOrganization()
            })
        },
        getWorkspaceById (id) {
            return this.userWorkspaces.find(org => org.id === id)
        },
        loadInitialPage () {
            if (!(this.selectedWorkspace && this.selectedWorkspace.id)) {
                this.$router.push({ name: 'CreateWorkspace' })
                return
            }

            if (this.isOnOrganizationProduct && this.userWorkspaceOrganizations.length <= 0) {
                this.$router.push({ name: 'CreateOrganizationModeSelect' })
                return
            }

            const routeLayouts = this.getRouteLayouts()
            if (routeLayouts.first === this.layouts.login
                || routeLayouts.first === this.layouts.oauthLogin
                || routeLayouts.first === this.layouts.inviteSignup
                || routeLayouts.first === this.layouts.oauthSignup
                || routeLayouts.first === this.layouts.register
                || routeLayouts.second === this.layouts.home
            ) {
                // const layoutState = Ls.getJson('layout.state', {})
                // if (!_.isNil(layoutState.activeProductIndex)) {
                //     this.redirectToProductDefaultPage(this.menu[layoutState.activeProductIndex])
                // } else {
                //     this.$router.push({ name: 'home' })
                // }
                this.redirectToProductDefaultPage(this.menu[1])
            }
        },
        selectActiveOrganization () {
            let orgId = Number.parseInt(this.$route.params.orgId)
            let nodeId = Number.parseInt(this.$route.params.nodeId)

            if (!orgId) {
                orgId = Number.parseInt(Ls.getJson('layout.state', {}))
            }

            let organization = this.getCaptivePortalOrganizationById(orgId)
            if (!organization) {
                if (orgId && this.isOnOrganizationProduct) {
                    organization = { id: orgId }
                } else {
                    organization = this.captivePortalOrganizations[0]
                }
            }
            if (organization) {
                if (!nodeId) {
                    nodeId = organization.id
                }
                this.selectOrganization(organization)
                this.selectNode({ id: nodeId })
            } else {
                this.clearOrganizationSelections()
            }

            if (this.isOnOrganizationProduct) {
                this.loadInitialPage()
            }
        },
        getCaptivePortalOrganizationById (id) {
            return this.captivePortalOrganizations.find(org => org.id === id)
        },
        getRouteLayouts () {
            const layoutData = {}
            if (this.$route.matched.length > 0) {
                layoutData.first = this.$route.matched[0].components.default.name
            }
            if (this.$route.matched.length > 1) {
                if (this.$route.matched[1].components.default) {
                    layoutData.second = this.$route.matched[1].components.default.name
                } else {
                    layoutData.second = undefined
                }
            }

            return layoutData
        },
        getRouteParams () {
            return {
                workspaceId: this.selectedWorkspace ? this.selectedWorkspace.id : null,
                orgId: this.selectedOrganization ? this.selectedOrganization.id : null,
                nodeId: this.selectedNode ? this.selectedNode.id : null
            }
        },
        redirectToProductDefaultPage (product) {
            this.$router.push({ name: product.default_page, params: this.getRouteParams() })
        }
    }
}

export default NodeSelectionsMixin