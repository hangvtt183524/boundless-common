<template>
  <v-app
      class="layout-main"
      :class="{'layout-main--full-width': isFullWidthMode}"
      data-test='logged-in'
      v-if="!loading"
  >
    <left-navigation />
    <div class="overlay" :class="{'visible': drawer}" @click.stop="toggleDrawer"></div>
    <div class="layout-main-content">
      <toolbar @tabBarStateChange="onTabBarStateChange" />
      <v-content :class="{'has-tab-bar': hasTabBar}" v-if="isCommonSetting">
        <v-container class="main-container" fluid :loading="loading">
          <v-layout>
            <router-view></router-view>
          </v-layout>
        </v-container>
      </v-content>

      <activity-indicator :show="showActivityIndicator" />

      <no-permissions-info-modal :show="showNoPermissionsModal" @close="closeNoPermissionsModal" />

      <security-check-failure-info-modal :show="showSecurityCheckFailureInfoModal" @close="closeSecurityCheckFailureInfoModal" />
    </div>
  </v-app>

  <v-app v-else>
    <v-container fill-height class="main-container">
      <b-loader />
    </v-container>
  </v-app>
</template>

<script>
import ToggleDrawerMixin from "@/mixins/toggle-drawer.mixin";
import UserPermissionsMixin from "@/mixins/user-permissions.mixin";
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import {mapActions, mapGetters} from "vuex";

import LeftNavigation from "@/components/common-menu/left-navigation";
import Toolbar from "@/components/common-menu/toolbar";
import ActivityIndicator from "@/components/common/activity-indicator";
import NoPermissionsInfoModal from '@/components/organization/no-permission-info-modal'
import SecurityCheckFailureInfoModal from "@/components/organization/security-check-failure-info-modal";
import BLoader from "@/components/common/b-loader";

import * as $ from 'jquery'

const productPaths = [
  '/network',
  '/access',
  '/captive',
  '/logs'
]

export default {
  name: 'LayoutMain',
  mixins: [
      ToggleDrawerMixin,
      UserPermissionsMixin,
      NodeSelectionsMixin
  ],
  data () {
    return {
      loading: true,
      hasTabBar: false,
      showNoPermissionsModal: false,
      showSecurityCheckFailureInfoModal: false,
      awaitingOrganizationSwitchChecks: false
    }
  },
  components: {
    LeftNavigation,
    Toolbar,
    ActivityIndicator,
    NoPermissionsInfoModal,
    SecurityCheckFailureInfoModal,
    BLoader
  },
  computed: {
    ...mapGetters(['showActivityIndicator']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('workspace/network', ['userDashboards']),
    ...mapGetters('workspace', ['userSecurityChecks']),
    ...mapGetters('layout', ['userOrganizationNodes', 'selectedOrganizationDataFetched', 'menu', 'userWorkspaces']),
    ...mapGetters(['drawer']),
    isFullWidthMode () {
      return this.userWorkspaces.length === 0
    },
    isCommonSetting () {
      const fullRoutePath = this.$route.fullPath
      if (!fullRoutePath || productPaths.findIndex(path => fullRoutePath.startsWith(path)) < 0) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions(['bootstrap']),
    ...mapActions('workspace', ['clearWorkspaceUserSecurityChecks', 'setPendingInvitationId']),
    ...mapActions('workspace/network', ['fetchUserDashboards']),
    ...mapActions('layout', ['setActiveProductIndex', 'fetchUserWorkspaces', 'fetchUserWorkspaceOrganizations',
      'selectNode', 'selectOrganization', 'clearOrganizationSelections']),
    onTabBarStateChange (hasTabBar) {
      this.hasTabBar = hasTabBar
    },
    openNoPermissionsModal () {
      this.showNoPermissionsModal = true
    },
    closeNoPermissionsModal () {
      this.showNoPermissionsModal = false
    },
    openSecurityCheckFailureInfoModal () {
      this.closeNoPermissionsModal()
      this.showSecurityCheckFailureInfoModal = true
    },
    closeSecurityCheckFailureInfoModal () {
      this.showSecurityCheckFailureInfoModal = false
      this.clearWorkspaceUserSecurityChecks()
    },
    performPermittedProductChecks () {
      // To be called after user roles loaded, if current product is not permitted for user, switches product to first
      // available one
      // Skips if we are on an organization product
      const permittedProducts = this.menu.filter(product => this.isProductPermitted(product))
      if (permittedProducts.length > 0 &&
          permittedProducts.map(product => product.identifier).indexOf(this.activeProduct.identifier) === -1 &&
          !this.isOnOrganizationProduct) {
        // Current product not permitted, switch
        const productIndex = this.menu.indexOf(permittedProducts[0])

        this.setActiveProductIndex(productIndex)
        this.redirectToProductDefaultPage(this.menu[productIndex])
      }
    },
    openWorkspaceCreatePage () {
      this.$router.push({ name: 'CreateWorkspace' })
    },
    openOrganizationCreatePage () {
      this.$router.push({ name: 'CreateOrganizationModeSelect' })
    },
    initializeUI () {
      const width = $(window).width()
      if (width < 1024 && width >= 768) {
        $('body').addClass('sidebar-mini')
      } else {
        $('body').removeClass('sidebar-mini')
      }

      if (width < 768 && this.drawer) {
        this.toggleDrawer()
      }

      $(window).resize((event) => {
        const width = event.target.outerWidth
        if (width < 1024 && width >= 768) {
          $('body').addClass('sidebar-mini')
        } else {
          $('body').removeClass('sidebar-mini')
        }
        if (width >= 768 && !this.drawer) {
          this.toggleDrawer()
        }
      })
    },
    reloadWorkspaceOrganizations () {
      // To be called when organizations deleted or selected workspace changed, re-loads workspace organizations
      // and if selected organization is not in the list, selects a new one

      return new Promise((resolve) => {
        this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId }).then(() => {
          const workspaceOrganizationIds = this.captivePortalOrganizations.map(organization => organization.id)
          if (workspaceOrganizationIds.indexOf(this.selectedOrganizationId) === -1) {
            // We deleted selected organization, select another organization
            const workspaceOrganization = this.captivePortalOrganizations[0]
            if (workspaceOrganization) {
              this.selectOrganization(workspaceOrganization)
              this.selectNode({ id: workspaceOrganization.id })
            } else {
              // No workspace organizations
              this.clearOrganizationSelections()
            }
          }

          resolve()
        })
      })
    },
    performOrganizationSwitchChecks () {
      this.awaitingOrganizationSwitchChecks = false
      if (this.showSecurityCheckFailureInfoModal === true) {
        return false
      }
      if (!this.hasAnyOrganizationPermission()) {
        this.openNoPermissionsModal()
      }
    }
  },
  mounted() {
    this.bootstrap().then(() => {
      this.$store.dispatch('user/fetchUserRoles', this.currentUser.id)
          .finally(() => {
            this.performPermittedProductChecks()

            this.loading = false
          })
    })

    this.fetchUserWorkspaces().then(response => {
      if (response.data.data.length === 0) {
        this.openWorkspaceCreatePage()
      }
      this.selectActiveWorkspace()
    })

    this.initializeUI()

    // HelpCrunchService.showWidget()
    // this.$eventHub.$on('NODE_LIST_CHANGE_EVENT', this.fetchCurrentOrganizationManagedNodes)
    // this.$eventHub.$on('ORGANIZATION_DELETE_EVENT', this.reloadWorkspaceOrganizations)
  },
  beforeDestroy() {
    this.$eventHub.$off('NODE_LIST_CHANGE_EVENT')

    // Hide chat widget when leaving main layout
    // HelpCrunchService.hideWidget()
  },
  watch: {
    selectedWorkspace (value, oldValue) {
      if (value.id && (!oldValue || value.id !== oldValue.id)) {
        // Workspace changed, load workspace organizations, if not initial load
        if (oldValue && oldValue.id) {
          this.reloadWorkspaceOrganizations().then(() => {
            // If on an organization product, redirect to organization node
            if (this.isOnOrganizationProduct) {
              if (this.selectedOrganization.id !== null) {
                this.redirectToNode(this.selectedOrganization, this.selectedOrganization.id)
              } else {
                // No workspace organizations, open organization creation page
                this.openOrganizationCreatePage()
              }
            }
          })
        }

        // On workspace change, fetch user dashboards if not fetched
        if (!this.userDashboards.hasOwnProperty(value.id)) {
          this.fetchUserDashboards({ workspaceId: value.id })
        }

        // Identify user here to set its organization field
        // EventTracker.identifyUser(this.currentUser.email, {
        //   email: this.currentUser.email,
        //   firstName: this.currentUser.profile.first_name,
        //   lastName: this.currentUser.profile.last_name,
        //   user_uuid: this.currentUser.secret_id
        // })
      }

      if (window.FS) {
        window.FS.identify(this.currentUser.id, {
          orgName: value.name,
          userName: this.currentUser.profile.full_name,
          email: this.currentUser.email
        })
      }

      // If help crunch integration is set, set user organization data
      // if (window.HelpCrunch) {
      //   HelpCrunchService.setCustomData({
      //     organization: (value && value.name) ? value.name : ''
      //   })
      // }
    },

    selectedOrganization (value, oldValue) {
      if (value.id && (!oldValue || value.id !== oldValue.id)) {
        // On organization change, fetch organization nodes
        this.fetchCurrentOrganizationManagedNodes().then(() => {
          // Call selectNode even if node has not changed here to update selected node fields
          if (this.selectedOrganizationDataFetched) {
            this.performOrganizationSwitchChecks()
          } else {
            // Full organization data not fetched yet, set this flag so that we can perform checks once data fetched
            this.awaitingOrganizationSwitchChecks = true
          }
        })
      }
    },

    selectedNode (value, oldValue) {
      if (value && oldValue && value.id && oldValue.id && (value.id !== oldValue.id)) {
        // On node change for correction, redirect to node if we are on an organization product
        if (value.correction === true && this.isOnOrganizationProduct) {
          this.redirectToNode(this.selectedOrganization, value.id)
        }
      }
    },

    selectedOrganizationDataFetched (value) {
      if (value && this.awaitingOrganizationSwitchChecks) {
        // Awaiting organization switch checks perform them
        this.performOrganizationSwitchChecks()
      }
    },

    userSecurityChecks (value) {
      if (value && value.success === false) {
        // Security checks updated to failure status. Display info modal.
        this.openSecurityCheckFailureInfoModal()
      }
    },

    $route: {
      handler: function (newValue, oldValue) {
        // Set active product depending on current url
        const routeProducts = this.getProductsForRoute(newValue, this.menu)
        if (routeProducts.length > 0 && routeProducts.indexOf(this.activeProductIndex) === -1) {
          // Route belongs to another product than current one. Switch to first one.
          this.setActiveProductIndex(routeProducts[0])
        }
      },
      immediate: true
    },

    menu: {
      handler: function (newValue, oldValue) {
        if (newValue.length > 0 && oldValue.length === 0) {
          // Set active product depending on current url, possible route handler triggered before menu was loaded
          const routeProducts = this.getProductsForRoute(this.$route, this.menu)
          if (routeProducts.length > 0 && routeProducts.indexOf(this.activeProductIndex) === -1) {
            // Route belongs to other products than current one. Switch to first one.
            this.setActiveProductIndex(routeProducts[0])
          }
        }
      }
    },

    activeProductIdentifier: {
      handler: function (newValue, oldValue) {
        if (!!oldValue && newValue !== oldValue &&
            this.isOnOrganizationProduct &&
            this.captivePortalOrganizations.length === 0
        ) {
          // No available organizations, open organization creation screen
          this.openOrganizationCreatePage()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.layout-main {
  // Add strict padding-top because Vuetify doesn't size the content with 2 toolbars properly
  .application--wrap {
    display: block;
    position: relative;
    top: 0;
    height: 100vh;
    overflow-x: hidden;
  }
  .overlay {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 99;
    position: fixed;
    display: none;
    @media (max-width: 767px) {
      &.visible {
        display: block;
        touch-action: none;
      }
    }
  }
  .v-content {
    padding-top: 85px !important;
    padding-left: 0 !important;
    max-height: 100vh;
    overflow-y: auto;
    position: absolute;
    top: -715px;
    width: 100%;

    @media (max-width: 767px) {
      padding-top: 125px !important;
    }

    &.has-tab-bar {
      padding-top: 130px !important;

      @media (max-width: 767px) {
        padding-top: 170px !important;
      }
    }
  }

  .main-container {
    padding-left: 30px !important;
    padding-right: 30px !important;
    padding-top: 0;
    padding-bottom: 30px;

    background: $gray-xlight;
  }

  .page-content {
    width: 100%;
    // margin-top: 55px;

    &.no-margin {
      margin-top: 0;
    }
  }

  .layout-main-content {
    position: relative;
    width: calc(100% - 265px);
    right: 0;
    float: right;
    top: -30px;
    z-index: 100;
    @media (min-width: 768px) and (max-width: 1024px) {
      width: calc(100% - 60px);
    }
    @media (max-width: 767px) {
      width: 100%;
    }
  }

  &--full-width {
    .layout-main-content {
      width: 100%;

      @media (min-width: 768px) and (max-width: 1024px) {
        width: 100%;
      }
    }
  }

  .v-tooltip__content {
    margin-top: 5px;
    padding: 3px 8px;
    &:before,
    &:after {
      display: none;
    }
    span {
      color: #FFF !important;
      font-size: 14px !important;
    }
  }
}

</style>