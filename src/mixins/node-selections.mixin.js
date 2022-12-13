import _ from 'lodash'
import Ls from '@/services/ls'
import { mapActions, mapGetters } from 'vuex'
import ProductOrganizationsMixin from "@/mixins/product-organizations.mixin";
import CurrentProductSelectionsMixin from "@/mixins/current-product-selections.mixin";
import CurrentNodeSelectionsMixin from "@/mixins/current-node-selections.mixin";

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
        CurrentNodeSelectionsMixin,
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
        'fetchUserWorkspaceOrganizations', 'selectOrganization', 'selectNode', 'clearOrganizationSelections',
        'fetchUserOrganizationNodes']),

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
        },
        getMenuItemRoute (menuItem) {
            return menuItem.route
        },
        redirectToNode (parentNode, childNodeId) {
            const paramOrgId = this.$route.params.orgId
            const paramNodeId = this.$route.params.nodeId
            const paramWorkspaceId = this.$route.params.workspaceId

            const routeLayouts = this.getRouteLayouts()

            if (
                (parentNode.type === this.rootNodeTypes.organization && routeLayouts.second === this.layouts.organization &&
                    paramOrgId === parentNode.id && paramNodeId === childNodeId) ||
                (parentNode.type === this.rootNodeTypes.workspace && routeLayouts.second === this.layouts.workspace &&
                    paramWorkspaceId === parentNode.id)
            ) {
                return false
            }

            if (parentNode.type === this.rootNodeTypes.workspace && this.isOnOrganizationProduct) {
                // If changing workspace on an organization product, do not proceed with redirection. We will redirect to
                // organization home on organizations load
                return false
            }

            const params = { ...this.$route.params }
            const query = { ...this.$route.query }

            let name = this.$route.name

                // Redirecting to workspace node
            if (parentNode.type === this.rootNodeTypes.workspace) {
                params.workspaceId = Number.parseInt(parentNode.id) || 0

                // Open product home for newly selected workspace
                name = this.activeProduct.default_page
            } else if (parentNode.type === this.rootNodeTypes.organization) {
                params.orgId = Number.parseInt(parentNode.id) || 0
                params.nodeId = Number.parseInt(childNodeId) || 0

                // Open product home for newly selected organization
                name = this.activeProduct.default_page
            }

            this.$router.push({ name: name, params: params, query: query })
        },
        fetchCurrentOrganizationManagedNodes () {
            return this.fetchUserOrganizationNodes({
                orgId: this.organizationId,
                filters: {
                    layout: 'flat',
                    types: 'organization,group,site,floor'
                }
            })
        },
        getProductsForRoute (route) {
            const products = []
            for (let index = 0; index < this.menu.length; index++) {
                const product = this.menu[index]

                for (let menuIndex = 0; menuIndex < product.submenu.length; menuIndex++) {
                    const subMenuItem = product.submenu[menuIndex]

                    if ((this.getMenuItemRoute(subMenuItem) === this.$route.name) &&
                        (!subMenuItem.route_parameters || _.some([this.$route.params], subMenuItem.route_parameters))) {
                        products.push(index)

                        // Continue with next product
                        break
                    }

                    // Current route matches one of menu item's tags
                    if ((subMenuItem.tabs && subMenuItem.tabs.map(tab => this.getMenuItemRoute(tab)).indexOf(this.$route.name) > -1)) {
                        products.push(index)

                        // Continue with next product
                        break
                    }
                }
            }
            return products
        }
    }
}

export default NodeSelectionsMixin