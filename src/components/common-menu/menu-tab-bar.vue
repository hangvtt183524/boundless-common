<template>
  <div class="menu-tab-bar">
    <ul>
      <li v-for="tab in tabs"
          :key="tab.translation"
          :class="{'active': currentTab === tab}"
          v-show="isTabHeaderVisible(tab)"
      >
        <router-link class="page-link"
                     v-if="isMenuItemEnabled(tab) && !tab.labelOnly"
                     :to="{ name: getMenuItemRoute(tab) }"
        >
          {{ menu[tab.translation] }}
        </router-link>

        <a class="page-link" v-else>
          {{ menu[tab.translation] }}
        </a>

        <span class="link-splitter"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import UserPermissionsMixin from "@/mixins/user-permissions.mixin";
import MenuItemDisplayConditionsMixin from "@/mixins/menu-item-display-conditions.mixin";

export default {
  name: 'menu-tab-bar',
  mixins: [
    UserPermissionsMixin,
    MenuItemDisplayConditionsMixin
  ],
  props: {
    tabs: Array,
    currentTab: Object,
    selectedOrg: {
      type: Object,
      default: () => {
        return { id: 0 }
      }
    }
  },
  data () {
    return {
      menu: {
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
      },
    }
  },
  methods: {
    isMenuItemEnabled (tab) {
      return this.checkMenuItemConditions(tab)
    },

    getMenuItemRoute (menuItem) {
      // Route is plain string or undefined
      return menuItem.route
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.menu-tab-bar {
  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  background-color: #132A54;

  ul {
    list-style: none;
    user-select: none;
    padding-left: 0;

    li {
      display: inline-block;
      height: 45px;

      .link-splitter {
        height: 22px;
        margin-top: 12px;
      }

      .page-link {
        padding: 12px 25px;
        line-height: 45px;
        font-family: Fira Sans;
        font-style: normal;
        font-size: 15px;
        color: $white;
        text-decoration: none;
      }

      &.active {
        background-color: $blue-reserve;

        .page-link {
          font-weight: 600;
        }
      }

      &.disabled {
        cursor: not-allowed;
        background: $gray-light;
      }

      &:not(:last-child) {
        .link-splitter {
          border-right: 1px solid rgba($gray-dark, .2)
        }
      }
    }
  }
}
</style>