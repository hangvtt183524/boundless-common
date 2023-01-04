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
      this.setActiveProductIndex(1)
      // this.redirectToProductDefaultPage(this.menu[1])
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
      console.log('reload workspace organization')
      return new Promise((resolve) => {
        this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId }).then(() => {
          const workspaceOrganizationIds = this.captivePortalOrganizations.map(organization => organization.id)
          if (workspaceOrganizationIds.indexOf(this.selectedOrganization.id) === -1) {
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
    currentUser (user) {
      if (user && user.profile) {
        // EventTracker.identifyUser(user.email, {
        //   email: user.email,
        //   firstName: user.profile.first_name ? user.profile.first_name : '',
        //   lastName: user.profile.last_name ? user.profile.last_name : '',
        //   user_uuid: user.secret_id
        // })

        // if (window.HelpCrunch) {
        //   HelpCrunchService.updateUser({
        //     user_id: user.secret_id,
        //     email: user.email,
        //     name: user.profile.full_name ? user.profile.full_name : '',
        //     phone: user.profile.phone ? user.profile.phone : ''
        //   })
        //
        //   if (user.profile.language) {
        //     HelpCrunchService.setLanguage(user.profile.language)
        //   }
        // }

        if (window.pendo) {
          window.pendo.initialize({
            visitor: {
              id: user.secret_id,
              email: user.email,
              full_name: user.profile.full_name ? user.profile.full_name : ''
            },
            account: {
              id: this.workspaceId
            }
          })
        }
      }
    },
    selectedWorkspace (value, oldValue) {
      if (value.id && (!oldValue || value.id !== oldValue.id)) {
        if (oldValue && oldValue.id) {
          this.reloadWorkspaceOrganizations().then(() => {
            if (this.isOnOrganizationProduct) {
              if (this.selectedOrganization.id !== null) {
                this.redirectToNode(this.selectedOrganization, this.selectedOrganization.id)
              } else {
                this.openOrganizationCreatePage()
              }
            }
          })
        }

        // eslint-disable-next-line no-prototype-builtins
        if (!this.userDashboards.hasOwnProperty(value.id)) {
          this.fetchUserDashboards({ workspaceId: value.id })
        }

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

      // if (window.HelpCrunch) {
      //   HelpCrunchService.setCustomData({
      //     organization: (value && value.name) ? value.name : ''
      //   })
      // }
    },

    selectedOrganization (value, oldValue) {
      if (value.id && (!oldValue || value.id !== oldValue.id)) {
        this.fetchCurrentOrganizationManagedNodes().then(() => {
          if (this.selectedOrganizationDataFetched) {
            this.performOrganizationSwitchChecks()
          } else {
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
        const routeProducts = this.getProductsForRoute(newValue, this.menu)
        if (routeProducts.length > 0 && routeProducts.indexOf(this.activeProductIndex) === -1) {
          this.setActiveProductIndex(routeProducts[0])
        }
      },
      immediate: true
    },

    menu: {
      handler: function (newValue, oldValue) {
        if (newValue.length > 0 && oldValue.length === 0) {
          const routeProducts = this.getProductsForRoute(this.$route, this.menu)
          if (routeProducts.length > 0 && routeProducts.indexOf(this.activeProductIndex) === -1) {
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