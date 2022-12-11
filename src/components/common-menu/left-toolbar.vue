<template>
  <div class="left-toolbar"
       color="white darken-3"
       app
       data-test="left-toolbar"
       :class="{'extended-icon-set': visibleSubGroups.length > 4}"
  >
    <div class="toolbar-wrap">
      <div class="bottom-menu">
        <div class="toolbar-actions">
          <v-menu
              class="user-menu action"
              v-for="subGroup of menuSubGroups"
              :key="subGroup.name"
              v-show="isMenuItemVisible(subGroup)"
              v-model="menuFlags[subGroup.name]"
              top left offset-y open-on-hover
              data-test="user-menu-1"
              content-class="left-toolbar-custom-user-menu"
          >
            <div
                class="doc-img-container d-flex"
                slot="activator"
                :class="{ 'active': menuFlags[subGroup.name] }"
            >
              <img class="documentation-image" :src="`@/assets/images/${subGroup.image}`" />
            </div>

            <v-list
                v-if="subGroup.name !== 'workspaces'"
                data-test="user-menu-list-1"
                @click.native="stopPropagation"
            >
              <v-list-tile class="menu-description">
                <v-list-tile-content>
                  <v-list-tile-title>{{ menuSelectionLabel[subGroup.translation] }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                  v-for="subMenu of subGroup.submenu"
                  :key="`${subGroup.name}_${subMenu.translation}`"
                  v-show="isMenuItemVisible(subMenu)"
                  :to="subMenu.route ? {name: subMenu.route, params: routeNodeParameters} : null"
                  :target="subMenu.target ? subMenu.target : ''"
                  :class="{'menu-item--active': subMenu.route && menuIsActive(subMenu.route)}"
                  @click="onMenuItemClick(subMenu)"
                  data-test="item-org-settings-general"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ menuSelectionLabel[subMenu.translation] }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

            <workspace-selector class="workspace-selector" v-if="subGroup.name === 'workspaces'" />

          </v-menu>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import UserPermissionsMixin from "@/mixins/user-permissions.mixin";
import MenuItemDisplayConditionsMixin from "@/mixins/menu-item-display-conditions.mixin";
import {mapGetters} from "vuex";

import WorkspaceSelector from "@/components/common-menu/workspace-selector";

export default {
  name: 'bottom-toolbar',
  mixins: [
      NodeSelectionsMixin,
      UserPermissionsMixin,
      MenuItemDisplayConditionsMixin
  ],
  components: {
    WorkspaceSelector
  },
  data () {
    return {
      showContactDialog: false,
      menuFlags: {},
      documentation: false,
      support_menu: false,
      profile_menu: false,
      user_roles_menu: false,
      supportSubGroupName: 'support',
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
  mounted() {

  },
  computed: {
    ...mapGetters('user', ['currentUser', 'showContactFlag']),
    menuSubGroups () {
      return this.toolbarMenu.subgroups.map(subGroupItem => {
        return {
          ...subGroupItem,
          type: 'subgroup',
          submenu: this.toolbarMenu.submenu.filter(subMenuItem => {
            return subMenuItem.subgroup === subGroupItem.name
          }).map(subMenuItem => {
            return {
              ...subMenuItem,
              type: 'submenu'
            }
          })
        }
      })
    },
    visibleSubGroups () {
      return this.menuSubGroups.filter(menuItem => this.isMenuItemVisible(menuItem))
    }
  },
  methods: {
    stopPropagation (event) {
      let classList = event.target.classList
      if (classList.contains('v-list') || event.target.closest('.menu-description')) {
        event.stopPropagation()
      }
    },
    menuIsActive (mainRoute) {
      let subItem = this.toolbarMenu.submenu.find(item => item.route === mainRoute)
      return !!(
          subItem &&
          ((subItem.route === this.$route.name) ||
              (subItem.tabs && subItem.tabs.map(tab => tab.route).indexOf(this.$route.name) > -1) ||
              (subItem.alternate_routes && subItem.alternate_routes.indexOf(this.$route.name) > -1))
      )
    },
    onMenuItemClick (menuItem) {
      if (menuItem.click_handler && this[menuItem.click_handler]) {
        this[menuItem.click_handler]()
      }

      if (menuItem.subgroup === this.supportSubGroupName) {
        // EventTracker.sendEvent(EVENT_NAMES.DOCUMENTATION_OPENED, {
        //   documentation_page: menuItem.translation
        // })
      }
    }
  },

}
</script>