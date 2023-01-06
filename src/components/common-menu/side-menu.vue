<template>
  <div class="main-menu" v-click-outside="clickedOutside">
    <div class="top-title"
         @click="onProductMenuTriggerClick"
         :class="{'activated': !isProductMenuOpen, [activeProductItem.class]: true}"
    >
      <span v-if="isProductMenuOpen">Select a product</span>
      <span v-else>{{ menuSelectionLabel[activeProductItem.translation]}}</span>
      <div class="top-title__expand">+</div>
      <div class="top-title__separator-line"></div>
    </div>

    <div class="top-product-container" v-if="isProductMenuOpen">
      <perfect-scrollbar class="main-menu__scroll-area">
        <div class="top-product"
             v-for="(menuItem, index) in products"
             :key="index"
             v-show="isMenuItemVisible(menuItem) && !menuItem.is_shared_subgroup"
             app
             :class="menuItem.class"
             @click="selectProduct(index)"
        >
          <div class="top-product__title">{{ menuSelectionLabel[menuItem.translation] }}</div>
          <div class="top-product__description">{{ menuItem.description }}</div>
        </div>
      </perfect-scrollbar>
    </div>

    <div v-else>
      <v-list class="top-subgroup-container">
        <div class="menu-blocker" v-if="isMenuBlocked"></div>
        <perfect-scrollbar class="main-menu__scroll-area">
          <component
              v-for="(subGroupItem, sgindex) in activeProductItem.subgroups"
              :is="subGroupItem.always_open ? 'div': 'v-list-group'"
              v-show="isMenuItemVisible(subGroupItem)"
              :class="{'always_open': subGroupItem.always_open}"
              :key="sgindex"
          >
            <div class="v-list__group__header" v-if="subGroupItem.always_open">
              <v-list-tile
                  class="top-subgroup"
                  @click.native="redirectLink(getFitSubMenu(subGroupItem, activeProductItem.submenu))"
              >
                <div class="top-subgroup__title-icon">
                  <img :src="getSubGroupIcon(subGroupItem)" />
                </div>
                <div class="top-subgroup__title">{{ subGroupItem.name }}</div>
              </v-list-tile>
            </div>

            <template v-slot:activator v-if="!subGroupItem.always_open">
              <v-list-tile class="top-subgroup"
                           @click.native="redirectLink(getFitSubMenu(subGroupItem, activeProductItem.submenu))"
                           :class="{
                             'menu-item': subGroupItem.leaf,
                             'active-link': fitSubMenuIsActive(subGroupItem, activeProductItem.submenu),
                             'disabled-item': !fitSubmenuHasActiveRoute(subGroupItem, activeProductItem.submenu)}
                            "
              >
                <v-list-tile-action class="top-subgroup__title-icon">
                  <img :src="getSubGroupIcon(subGroupItem)" />
                </v-list-tile-action>

                <v-list-tile-title class="top-subgroup__title">
                  <span>{{ subGroupItem.name }}</span>
                  <div class="top-subgroup__title__expand" v-if="!subGroupItem.leaf">+</div>
                </v-list-tile-title>
              </v-list-tile>
            </template>

            <v-list-tile
                v-for="(subMenuItem, index) in subGroupItem.submenu"
                v-show="!subGroupItem.leaf && isMenuItemVisible(subMenuItem)"
                :key="index"
                @click.native="redirectLink(subMenuItem)"
                :class="{'menu-item': true, 'submenu-item': true, 'active-link': menuIsActive(subMenuItem), 'disabled-item': !hasActiveRoute(subMenuItem)}"
            >
              <v-list-tile-title
                  class="top-subgroup-item"
              >

              </v-list-tile-title>
            </v-list-tile>
          </component>
        </perfect-scrollbar>
      </v-list>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from "vuex"
import MenuItemDisplayConditionsMixin from "@/mixins/menu-item-display-conditions.mixin";
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import ToggleDrawer from "@/mixins/toggle-drawer.mixin";

export default {
  data () {
    return {
      isProductMenuOpen: false,
      menuSelectionLabel: {
        "selectProduct": "Select a product",

        "administration": "Administration",
        "permissions_manager": "Permissions Manager",
        "feature_activation": "Feature Activation",
        "internal_user_management": "Internal User management",
        "organizational_summary": "Organizational Summary",
        "workspaces": "Workspaces",

        "analytics": "Analytics",
        "captive_portal_analytics": "Captive Portal Analytics",
        "portal_analytics": "Portal Analytics",
        "connected_visitor_listing": "Connected Visitor Listing",
        "location_analytics": "Location Analytics",
        "camera_analytics": "Camera Analytics",
        "monitoring": "Monitoring",

        "captive_portal": "Captive Portal",
        "splash_pages": "Splash Pages",
        "splash_templates": "Templates",
        "campaigns": "Campaigns",
        "media_library": "Media Library",
        "authentication_settings": "Authentication Settings",
        "self_registration": "Session Limits",
        "sponsored_access": "Sponsored Access",
        "ticketing": "Ticketing",
        "access_codes": "Access Codes",
        "ldap_authentication": "Ldap Authentication",
        "single_sign_on": "Single Sign On",
        "hardware_setup": "Hardware Setup",

        "network_management": "Network Management",
        "firewall": "Firewall",
        "alerts": "Alerts",
        "tags": "Tags",
        "templates": "FlexTemplates",

        "deployment": "Deployment",
        "network_creation_flow": "Batch Network Creation",
        "migration_tools": "Migration Tools",
        "configuration": "Configuration",
        "firewall_rules": "Firewall Rules",
        "clients": "Clients",
        "devices": "Devices",
        "networks": "Networks",
        "switch_ports": "Switch Ports",
        "audit_and_compliance": "Audit and Compliance",
        "security": "Security",
        "names": "Names",
        "configurations": "Configurations",

        "organization": "Workspace",
        "venues": "Venues",
        "device_inventory": "Device Inventory",
        "users_and_permissions": "Users and Permissions",
        "users": "Users",
        "user_management": "User Management",
        "roles_and_permissions": "Roles and Permissions",
        "permissions": "Permissions",
        "settings": "Settings",
        "general": "General",
        "branding": "Branding",
        "external_integrations": "External Integrations",
        "captive_portal_settings": "Captive Portal",
        "activity_log": "Audit Log",
        "quick_setup": "Quick Setup",
        "meraki_api": "Meraki API",

        "meraki_connection": "Meraki Connection",
        "wifi_network": "WiFi Network",

        "raw_data": "Raw data",

        "boundless_security": "Boundless Security",

        "support": "Support",
        "getting_started": "Getting Started",
        "knowledge_base": "Knowledge Base",
        "make_a_wish": "Make a Wish?",

        "my_profile": "My Profile",

        "msp": "MSP",
        "api_keys": "API Keys",

        "custom_dashboards": "Custom Dashboards",

        "logs": "Logs",

        "access": "Access Control",
        "applications": "Applications",
        "saml_users": "SAML Users",
        "access_control": "Access Control",
        "access_control_lists": "Access Control Lists",
        "permission_roles": "Permission Roles",
        "organization_admins": "Organization Admins",
        "meraki_auth": "Meraki Auth"
      }
    }
  },
  mixins: [
    MenuItemDisplayConditionsMixin,
    NodeSelectionsMixin,
    ToggleDrawer
  ],
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters(['drawer']),
    ...mapGetters('layout', ['activeProductIndex', 'menu']),
    ...mapGetters('workspace/network', ['userDashboards']),

    products () {
      return this.menu.map(product => {
        return {
          ...product,
          subgroups: product.subgroups.map(subgroup => {
            return {
              ...subgroup,
              submenu: product.submenu
                  .filter(submenuItem => submenuItem.subgroup === subgroup.name)
                  .map(submenuItem => {
                    return {
                      ...submenuItem,
                      type: 'submenu'
                    }
                  }),
              type: 'subgroup'
            }
          }),
          type: 'product'
        }
      })
    },
    activeProductItem () {
      const activeProductItem = this.products[this.activeProductIndex]
      const dashboardsSubGroup = activeProductItem.subgroups.find(subgroup => subgroup.name === 'dashboards')
      if (dashboardsSubGroup) {
        return {
          ...activeProductItem,
          subgroups: activeProductItem.subgroups.map(subgroup => {
            if (subgroup.name === 'dashboards') {
              return {
                ...dashboardsSubGroup,
                submenu: dashboardsSubGroup.submenu.concat((this.getActiveUserDashboards() || []).map(userDashboard => {
                  return {
                    'subgroup': 'dashboards',
                    'title': userDashboard.name,
                    'route': 'UserDashboard',
                    'route_parameters': {
                      'dashboardId': userDashboard.id
                    }
                  }
                }))
              }
            }
            return subgroup
          })
        }
      }

      return activeProductItem
    },
    isMenuBlocked () {
      return this.isOnOrganizationProduct && this.userWorkspaceOrganizations.length <= 0
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('user', ['setContactDialogFlag']),
    ...mapActions('layout', ['setActiveProductIndex']),
    clickedOutside () {
      this.isProductMenuOpen = false
    },
    onProductMenuTriggerClick () {
      this.isProductMenuOpen = !this.isProductMenuOpen
      if (this.isProductMenuOpen) {
        // EventTracker.sendEvent(EVENT_NAMES.PRODUCT_SELECTOR_OPENED)
      }
    },
    selectProduct (index) {
      this.isProductMenuOpen = false
      if (this.activeProductItem === index) {
        return
      }
      this.setActiveProductIndex(index)
      this.redirectToProductDefaultPage(this.menu[index])
      // EventTracker.sendEvent(EVENT_NAMES.PRODUCT_SELECTED)
    },
    getActiveUserDashboards () {
      return this.userDashboards[this.workspaceId]
    },
    redirectLink (subItem, staticRouterName = '') {
      const routeParams = {
        ...this.getRouteParams(),
        ...(subItem.route_parameters || {})
      }

      if (!staticRouterName) {
        if (subItem.route) {
          this.$router.push({ name: this.getMenuItemRoute(subItem),
            params: routeParams,
            query: this.getRouteQuery(subItem)
          }).catch(error => {})
        } else if (subItem.tabs && subItem.tabs.length > 0) {
          for (let index = 0; index < subItem.tabs.length; index++) {
            const tab = subItem.tabs[index]
            if (this.isMenuItemPermitted(tab) && tab.route) {
              this.$router.push({ name: this.getMenuItemRoute(tab), params: routeParams, query: this.getRouteQuery(subItem) }).catch(error => {})
              break
            }
          }
        }
      } else {
        this.$router.push({ name: staticRouterName }).catch(error => {})
      }
    },
    getRouteQuery (subItem) {
      let query = {}
      if (subItem.keepQuery) {
        query = this.$route.query || {}
      }
      return query
    },
    getFitSubMenu (subGroupItem, submenu) {
      if (!subGroupItem.leaf) {
        return {}
      }
      for (let index = 0; index < submenu.length; index++) {
        if (submenu[index].subgroup === subGroupItem.name) {
          return submenu[index]
        }
      }
      return {}
    },
    getSubGroupIcon (subGroupItem) {
      if (!subGroupItem.icon) {
        return ''
      }
      return require(`@/assets/images/menu-icons/${subGroupItem.icon}.svg`)
    },
    fitSubMenuIsActive (subGroupItem, submenu) {
      let menuItem = this.getFitSubMenu(subGroupItem, submenu)
      return this.menuIsActive(menuItem)
    },
    menuIsActive (subItem) {
      if (!subItem) {
        return false
      }

      if (this.getMenuItemRoute(subItem) === this.$route.name
          && (!subItem.route_parameters || _.some([this.$route.params], subItem.route_parameters))
      ) {
        return true
      }

      if ((subItem.tabs && subItem.tabs.map(tab => this.getMenuItemRoute(tab)).indexOf(this.$route.name) > -1)) {
        return true
      }

      // const menuItems = [subItem, ...(subItem.tabs || [])].filter(item => !item.route)
      // const commonRouteParams = this.getRouteParams()

      // for (let index = 0; index < menuItems.length; index++) {
      //   const menuItem = menuItems[index]
      //   const routeParams = {
      //     ...commonRouteParams,
      //     ...(menuItem.route_parameters || {})
      //   }
      //
      //   const routePath = this.$router.resolve({ name: this.getMenuItemRoute(menuItem), params: routeParams }).route.path
      //
      //   if (!routePath || routePath === '/') {
      //     continue
      //   }
      //
      //   if (this.$route.path.indexOf(routePath) > -1) {
      //     return true
      //   }
      // }

      return false
    },
    fitSubmenuHasActiveRoute (subGroupItem, submenu) {
      let menuItem = this.getFitSubMenu(subGroupItem, submenu)
      return this.hasActiveRoute(menuItem)
    },
    hasActiveRoute (subItem) {
      const routeParams = {
        ...this.getRouteParams(),
        ...(subItem.route_parameters || {})
      }

      const link = this.$router.resolve({ name: this.getMenuItemRoute(subItem), params: routeParams })
      if (link && link.href !== '/') {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
@import "styles/v2/colors.scss";

.top-title {
  height: 55px;
  cursor: pointer;
  background: none;

  font-family: Overpass;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  align-items: center;
  color: #FFF;
  padding: 18px;
  user-select: none;
  position: relative;

  &__expand {
    position: absolute;
    right: 20px;
    top: 19px;
    transform: rotate(-45deg);
    transition: transform 0.5s;
  }
  &__separator-line {
    height: 2px;
    width: 100vw;
    position: absolute;
    top: 55px;
    left: 0;
  }

  &.network-management {
    .top-title__separator-line {
      background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
    }
  }
  &.captive-portal {
    .top-title__separator-line {
      background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
    }
  }
  &.deployment {
    .top-title__separator-line {
      background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
    }
  }
  &.boundless-security {
    .top-title__separator-line {
      background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
    }
  }
  &.logs {
    .top-title__separator-line {
      background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
    }
  }
  &.access {
    .top-title__separator-line {
      background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
    }
  }

  &.activated {
    &.network-management {
      background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
      .top-title__separator-line {
        background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
      }
    }
    &.captive-portal {
      background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
      .top-title__separator-line {
        background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
      }
    }
    &.deployment {
      background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
      .top-title__separator-line {
        background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
      }
    }
    &.boundless-security {
      background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
      .top-title__separator-line {
        background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
      }
    }
    &.logs {
      background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
      .top-title__separator-line {
        background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
      }
    }
    &.access {
      background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
      .top-title__separator-line {
        background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
      }
    }
    .top-title__expand {
      transform: rotate(0);
    }
  }
}
.top-product {
  height: 169px;
  padding: 27px 32px;
  cursor: pointer;

  &.network-management:hover {
    background: linear-gradient(148.06deg, #7671EE 1.43%, #4944C2 89.91%);
  }
  &.captive-portal:hover {
    background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
  }
  &.deployment:hover {
    background: linear-gradient(155.12deg, #B31D94 5.12%, #702AB2 110.94%);
  }
  &.boundless-security:hover {
    background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
  }
  &.logs:hover {
    background: linear-gradient(135.6deg, #28C69F 3.55%, #00AA81 63.15%);
  }
  &.access:hover {
    background: linear-gradient(138.45deg, #2260DD 4.36%, #1146AE 88.54%);
  }
  &__title {
    font-family: Overpass;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 16px;
    align-items: center;
    color: #FFF;
  }
  &__description {
    margin-top: 12px;
    font-family: Overpass;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #FFF;
  }
}
.top-subgroup-container {
  padding-top: 24px !important;
  height: calc(100vh - 120px);
  position: relative;

  .menu-blocker {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba($blue-dark, .9);
  }
}
.top-product-container {
  height: calc(100vh - 120px);
}

.top-subgroup {
  border-top: solid #173773 1px;
  padding: 0 0 0 24px !important;
  cursor: pointer;

  &__title-icon {
    width: 26px;
  }
  &__title {
    font-family: Overpass;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 23px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #FFF;
    user-select: none;

    &__expand {
      font-family: Overpass;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
      color: #FFF;
      position: absolute;
      right: 0;
      top: 3px;
    }
  }
}
.v-list__group__header--active {
  .top-subgroup__title__expand {
    transform: rotate(-45deg);
  }
}

.top-subgroup-item {
  padding-left: 32px;
  font-family: Fira Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #FFF;
}
.sidebar-mini {
  .sidebar-main {
    .main-menu {
      .v-list__group {
        &__header {
          pointer-events: none !important;
          .v-list__tile {
            &__expand__icon {
              display: none;
            }
          }
        }
      }
    }
    &:not(.no-hover):not(.sidebar-main--large):hover {
      width: 245px !important;
      .container-logo .logo-wrapper .thumb {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 18px;
        .close {
          display: block;
        }
        .logo-image {
          margin-left: 10px;
        }
      }
      .main-menu {
        .v-list__group {
          &__header {
            .v-list__tile {
              &__expand__icon {
                display: block;
              }
            }
          }
          .sidebar-mini-icon {
            display: none;
          }
        }
      }
    }
  }
}

.main-menu {
  height: calc(100vh - 65px);
  background-color: #132A54 !important;

  &__scroll-area {
    height: 100%;
    & > :first-child {
      .top-subgroup {
        border-top: none;
      }
    }
  }

  .v-list__group {
    .sidebar-mini-icon {
      display: none;
      @media (min-width: 768px) and (max-width: 1024px) {
        display: block;
      }
    }
    .v-list__tile__action {
      min-width: unset;
      @media (min-width: 768px) and (max-width: 1024px) {
        min-width: 20px;
      }
    }
    &__header {
      &:hover {
        background: linear-gradient(270deg, rgba(#2260DD, 0.5) 0%, rgba(34, 96, 221, 0) 130.57%) !important;
      }
      &--active {
        &:hover {
          background: transparent !important;
        }
        &.v-list__group__header--sub-group .v-list__group__header__prepend-icon .v-icon {
          transform: none;
          color: #FFF;
        }
        .v-list__tile {
          &__expand__icon {
            &:before{ transform: rotate(90deg); }
            &:after{ transform: rotate(180deg); }
          }
        }
      }
      .v-list__group__header__append-icon {
        display: none;
      }
      .menu-icon {
        width: 41px;
        padding-left: 23px;
        padding-right: 0;
        margin-right: 20px;
        min-width: unset;
        color: #FFF !important;
        @media (min-width: 768px) and (max-width: 1024px) {
          padding-left: 22px;
          margin-right: 15px;
        }
        .v-icon {
          font-size: 18px;
        }
      }
      .v-list__tile {
        padding-right: 30px;
        padding-left: 0;
        @media (min-width: 768px) and (max-width: 1024px) {
          padding-right: 24px;
        }
        .v-list__tile__action {
          @media (min-width: 768px) and (max-width: 1024px) {
            min-width: unset;
          }
        }
        &__expand__icon {
          position: relative;
          width: 12px;
          height: 12px;
          opacity: .7;
          &:before,
          &:after{
            content: "";
            position: absolute;
            background-color: #FFF;
            transition: transform 0.25s ease-out;
          }

          /* Vertical line */
          &:before{
            top: 0;
            left: 50%;
            width: 2px;
            height: 12px;
            margin-left: -1px;
          }

          /* horizontal line */
          &:after{
            top: 50%;
            left: 0;
            width: 100%;
            height: 2px;
            margin-top: -1px;
          }
        }
      }
    }
  }

  .always_open {
    .v-list__group__header {
      pointer-events: none !important;
    }
  }
  .v-list__group__header--active:hover {
    background: transparent;
  }

  .menu-item {
    cursor: pointer;

    &:hover {
      background: linear-gradient(270deg, rgba(#2260DD, 0.5) 0%, rgba(34, 96, 221, 0) 130.57%);
    }
    &.active-link {
      background: linear-gradient(270deg, #2260DD 0%, rgba(34, 96, 221, 0) 130.57%);
      position: relative;
      .top-subgroup__title {
        font-weight: bold;
      }
      .top-subgroup-item {
        font-weight: bold;
      }

      &.submenu-item {
        background: linear-gradient(270deg, #2B71FD -14.34%, rgba(34, 96, 221, 0) 148.3%);
      }
      .submenu__expand__icon {
        display: block;
      }
      .v-list__tile:hover {
        background-color: transparent !important;
      }
    }
    &.disabled-item {
      pointer-events: none;
      text-decoration: line-through !important;
    }
  }

  .mobile-side {
    display: none;
    @media (max-width: 767px) {
      display: block;
    }
  }

  .ps .ps__rail-y:hover, .ps .ps__rail-y:focus, .ps .ps__rail-y.ps--clicking {
    background: transparent;
  }
}
</style>