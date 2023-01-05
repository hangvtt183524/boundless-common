import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { checkBeforeEachRoute } from './helpers'

// Layouts
// ----------------------------------
import LayoutLogin from '@/components/layouts/layout-login'
// import LayoutOrganization from '@/components/layouts/layout-organization'
import LayoutMain from '@/components/layouts/layout-main'
// import LayoutBuilder from '@/components/layouts/layout-builder'
// import LayoutAdministration from '@/components/layouts/layout-administration'
// import LayoutWorkspace from '@/components/layouts/layout-workspace'

// Users
// ----------------------------------
import LoginAuthToken from '@/components/login/login-auth-token'
import EmailVerification from '@/components/registration/email-verification'
import InviteSignup from '@/components/registration/invite-signup'
import AuthTokenSignup from '@/components/registration/auth-token-signup'

// Errors
// ----------------------------------
// import ErrorPage from '@/components/pages/error-page'

// Routes
// ----------------------------------
import AuthRoutes from './auth'
// import WorkspaceRoutes from './workspace'
// import BuilderRoutes from './builder'
// import AdministrationRoutes from './administration'
import OrganizationRoutes from './organization'

import Home from '@/components/pages/home'
const UserProfile = () => import(/* webpackChunkName: "profile" */ '@/components/user/profile')

// import documentation from '@/components/documentation/documentation'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login/auth-token',
      name: 'LoginAuthToken',
      component: LoginAuthToken,
      meta: {
        descriptiveName: 'Login',
        requiresUnAuthenticated: true
      }
    },
    {
      path: '/email-verification/:token/:email',
      name: 'email-verification',
      component: EmailVerification,
      props: true
    },
    {
      path: '/sign-up/invite',
      component: InviteSignup,
      name: 'invite-signup'
    },
    {
      path: '/sign-up/invite/:organizationSlug',
      component: InviteSignup,
      name: 'invite-signup',
      props: true
    },
    {
      path: '/sign-up/auth-token',
      component: AuthTokenSignup,
      name: 'auth-token-signup'
    },
    {
      path: '/error/:errorCode',
      name: 'error',
      component: () => '<div>Error</div>',
      props: true
    },
    {
      path: '/',
      component: LayoutLogin,
      meta: { requiresUnAuthenticated: true },
      children: [
        ...AuthRoutes
      ]
    },
    {
      path: '/',
      component: LayoutMain,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: UserProfile,
          meta: {
            title: 'User Profile',
            descriptiveName: 'Profile'
          }
        },
        {
          path: '/captive/workspace/create',
          name: 'CreateWorkspace',
        },
        {
          path: '/captive/organization/create',
          name: 'CreateOrganizationModeSelect',
        },
        {
          path: '/captive/organization/create/manual',
          name: 'CreateOrganizationManual',
        },
        {
          path: '/captive/organization/create/quick',
          name: 'CreateOrganizationQuick',
        },
        // {
        //   path: '/administration',
        //   component: LayoutAdministration,
        //   meta: { requiresAuth: true },
        //   children: [
        //     ...AdministrationRoutes
        //   ]
        // },
        // {
        //   path: '/workspace/:workspaceId',
        //   component: LayoutWorkspace,
        //   children: [
        //     ...WorkspaceRoutes
        //   ]
        // },
        {
          path: '/captive/:orgId/:nodeId',
          children: [
            ...OrganizationRoutes
          ]
        }
      ]
    },
    {
      path: '/network',
      component: LayoutMain,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'workspace/:workspaceId',
          children: [
            {
              path: 'automation/organizations',
              name: 'OrganizationList',
              meta: {
                descriptiveName: 'Managed Organizations Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/organizations/import',
              name: 'OrganizationImport',
              meta: {
                descriptiveName: 'Organization Import',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/organizations/:workspaceOrganizationId',
              name: 'OrganizationDetail',
              props: (route) => ({
                workspaceOrganizationId: route.params.workspaceOrganizationId
              }),
              meta: {
                title: 'Organization',
                descriptiveName: 'Managed Organization Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/flextemplates',
              name: 'TemplateList',
              meta: {
                title: 'Network FlexTemplates',
                descriptiveName: 'FlexTemplates',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/flextemplates/:templateId',
              name: 'TemplateDetail',
              props: (route) => ({
                templateId: route.params.templateId
              }),
              meta: {
                title: 'Update Template',
                descriptiveName: 'FlexTemplate Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/flextemplates/:templateId/customizations',
              name: 'TemplateCustomizations',
              props: (route) => ({
                templateId: route.params.templateId
              }),
              meta: {
                title: 'Update Template Customizations',
                descriptiveName: 'FlexTemplate Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/flextemplates/:templateId/deployment',
              name: 'TemplateDeployment',
              props: (route) => ({
                templateId: route.params.templateId
              }),
              meta: {
                title: 'Deploy Template',
                descriptiveName: 'FlexTemplate Deployment',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/monitoring/clients',
              name: 'WifiClients',
              meta: {
                title: 'Clients',
                descriptiveName: 'Client Monitoring Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/monitoring/clients/:clientId',
              name: 'WifiClientDetail',
              props: (route) => ({
                clientId: route.params.clientId
              }),
              meta: {
                title: 'Clients',
                descriptiveName: 'Client Monitoring Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/monitoring/devices',
              name: 'MerakiDevices',
              meta: {
                title: 'Devices',
                descriptiveName: 'Device Monitoring Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/monitoring/devices/:deviceId',
              name: 'MerakiDeviceDetail',
              props: (route) => ({
                deviceId: route.params.deviceId
              }),
              meta: {
                title: 'Devices',
                descriptiveName: 'Device Monitoring Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/monitoring/networks',
              name: 'MerakiNetworks',
              meta: {
                title: 'Networks',
                descriptiveName: 'Network Monitoring Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/monitoring/switch-ports',
              name: 'MerakiSwitchPorts',
              meta: {
                title: 'Switch Ports',
                descriptiveName: 'Switch Port Monitoring Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/security',
              name: 'SecurityCompliance',
              meta: {
                title: 'Security Compliance',
                descriptiveName: 'Security Compliance Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/security/new',
              name: 'NewSecurityComplianceRuleSet',
              meta: {
                title: 'Create Rule Set',
                descriptiveName: 'Security Compliance Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/security/:ruleSetId',
              name: 'SecurityComplianceRuleSetDetail',
              props: (route) => ({
                ruleSetId: route.params.ruleSetId
              }),
              meta: {
                title: 'Update Rule Set',
                descriptiveName: 'Security Compliance Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/security/alert/:complianceCheckId',
              name: 'SecurityComplianceCheckDetail',
              props: (route) => ({
                complianceCheckId: route.params.complianceCheckId
              }),
              meta: {
                title: 'Compliance Alert Details',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/names',
              name: 'NameCompliance',
              meta: {
                nodeRoles: ['organization'],
                title: 'Name Compliance',
                descriptiveName: 'Name Compliance Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/names/new',
              name: 'NewNameComplianceRuleSet',
              meta: {
                title: 'Create Rule Set',
                descriptiveName: 'Name Compliance Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/names/:ruleSetId',
              name: 'NameComplianceRuleSetDetail',
              props: (route) => ({
                ruleSetId: route.params.ruleSetId
              }),
              meta: {
                title: 'Update Rule Set',
                descriptiveName: 'Name Compliance Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/names/alert/:complianceCheckId',
              name: 'NameComplianceCheckDetail',
              props: (route) => ({
                complianceCheckId: route.params.complianceCheckId
              }),
              meta: {
                title: 'Compliance Alert Details',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/configuration',
              name: 'ConfigurationCompliance',
              meta: {
                title: 'Configuration Compliance',
                descriptiveName: 'Configuration Compliance Listing',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/configuration/new',
              name: 'NewConfigurationComplianceRuleSet',
              meta: {
                title: 'Create Rule Set',
                descriptiveName: 'Configuration Compliance Rule Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/configuration/:ruleSetId',
              name: 'ConfigurationComplianceRuleSetDetail',
              props: (route) => ({
                ruleSetId: route.params.ruleSetId
              }),
              meta: {
                title: 'Update Rule Set',
                descriptiveName: 'Configuration Compliance Rule Detail',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/tags',
              name: 'Tags',
              meta: {
                nodeRoles: ['organization'],
                title: 'Tags',
                descriptiveName: 'Tag Manager Tags',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/tags/resources',
              name: 'TagsResources',
              meta: {
                nodeRoles: ['organization'],
                title: 'Tags',
                descriptiveName: 'Tag Manager Resources',
                requiresApiKey: true
              }
            },
            {
              path: 'automation/compliance/configuration/alert/:complianceCheckId',
              name: 'ConfigurationComplianceCheckDetail',
              props: (route) => ({
                complianceCheckId: route.params.complianceCheckId
              }),
              meta: {
                title: 'Compliance Alert Details',
                requiresApiKey: true
              }
            }
          ]
        }
      ]
    },
    {
      path: '/access',
      component: LayoutMain,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'workspace/:workspaceId',
          children: [
            {
              path: 'applications',
              name: 'AccessApplicationList',
              meta: {
                descriptiveName: 'Access Application Listing'
              }
            },
            {
              path: 'applications/configuration',
              name: 'AccessApplicationConfiguration',
              meta: {
                descriptiveName: 'Access Application Configuration'
              }
            },
            {
              path: 'vendor-roles',
              name: 'AccessVendorRoleList',
              meta: {
                descriptiveName: 'Access Vendor Role Listing'
              }
            },
            {
              path: 'vendor-roles/new',
              name: 'NewAccessVendorRole',
              meta: {
                title: 'Create Vendor Role',
                descriptiveName: 'Vendor Role Create'
              }
            },
            {
              path: 'vendor-roles/:vendorRoleId',
              name: 'AccessVendorRoleDetail',
              props: (route) => ({
                vendorRoleId: route.params.vendorRoleId
              }),
              meta: {
                title: 'Update Vendor Role',
                descriptiveName: 'Vendor Role Detail'
              }
            },
            {
              path: 'access-control',
              name: 'AccessUserVendorRoleList',
              meta: {
                descriptiveName: 'Access Control Listing'
              }
            },
            {
              path: 'access-control/new',
              name: 'NewAccessUserVendorRole',
              meta: {
                title: 'Create Access Control',
                descriptiveName: 'Access Control Create'
              }
            },
            {
              path: 'access-control/:userVendorRoleId',
              name: 'AccessUserVendorRoleDetail',
              props: (route) => ({
                userVendorRoleId: route.params.userVendorRoleId
              }),
              meta: {
                title: 'Update Access Control',
                descriptiveName: 'Access Control Detail'
              }
            },
            {
              path: 'saml-users',
              name: 'AccessSAMLUserList',
              meta: {
                descriptiveName: 'Access SAML User Listing'
              }
            },
            {
              path: 'user-management',
              name: 'UserManagementList',
              meta: {
                descriptiveName: 'Access User Management Listing'
              }
            },
            {
              path: 'user-management/invitation',
              name: 'UserManagementInvitation',
              meta: {
                descriptiveName: 'Access User Management Invitation'
              },
              props: route => ({
                selectedUsers: route.params.selectedUsers
              })
            },
            {
              path: 'user-management/removal',
              name: 'UserManagementRemoval',
              meta: {
                descriptiveName: 'Access User Management Removal'
              },
              props: route => ({
                selectedUsers: route.params.selectedUsers
              })

            },
            {
              path: 'user-management/:merakiUserId',
              name: 'UserManagementUserDetail',
              meta: {
                descriptiveName: 'Access User Detail'
              },
              props: route => ({
                merakiUserId: route.params.merakiUserId
              })
            },
            {
              path: 'user-management/organization/:ownerOrganizationId/:merakiOrganizationUserId',
              name: 'UserManagementOrganizationUserDetail',
              meta: {
                descriptiveName: 'Access Organization User Detail'
              },
              props: route => ({
                ownerOrganizationId: route.params.ownerOrganizationId,
                merakiOrganizationUserId: route.params.merakiOrganizationUserId
              })
            }
          ]
        }
      ]
    },
    {
      path: '/logs',
      component: LayoutMain,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'workspace/:workspaceId',
          children: [
            {
              path: 'syslog-servers',
              name: 'SyslogServerList',
              meta: {
                descriptiveName: 'Syslog Servers Listing'
              }
            },
            {
              path: 'syslog-servers/new',
              name: 'NewSyslogServer',
              meta: {
                title: 'Launch Syslog Server',
                descriptiveName: 'Syslog Server Detail'
              }
            },
            {
              path: 'syslog-servers/:syslogServerId',
              name: 'SyslogServerDetail',
              props: (route) => ({
                syslogServerId: route.params.syslogServerId
              }),
              meta: {
                title: 'Server Details',
                descriptiveName: 'Syslog Server Detail'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/captive',
      meta: { requiresAuth: true },
      children: [
        {
          path: ':orgId/:nodeId',
          children: [
            {
              path: 'page-builder/:splashId',
              name: 'SplashPageBuilder',
            },
          ]
        }
      ]
    },
    // {
    //   path: '/documentation',
    //   component: documentation,
    //   name: 'documentation',
    //   meta: { requiresAuth: true }
    // },
    {
      path: '*',
      redirect: '/error/404',
      name: 'error-404'
    }
  ],
  mode: 'history'
})

// router.beforeEach((to, from, next) => checkBeforeEachRoute(store, to, from, next))

export default router