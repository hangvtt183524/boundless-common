export default [
  {
    path: 'access/applications',
    name: 'AccessApplicationList',
    meta: {
      descriptiveName: 'Access Application Listing'
    }
  },
  {
    path: 'access/applications/configuration',
    name: 'AccessApplicationConfiguration',
    meta: {
      descriptiveName: 'Access Application Configuration'
    }
  },
  {
    path: 'access/vendor-roles',
    name: 'AccessVendorRoleList',
    meta: {
      descriptiveName: 'Access Vendor Role Listing'
    }
  },
  {
    path: 'access/vendor-roles/new',
    name: 'NewAccessVendorRole',
    meta: {
      title: 'Create Vendor Role',
      descriptiveName: 'Vendor Role Create'
    }
  },
  {
    path: 'access/vendor-roles/:vendorRoleId',
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
    path: 'access/access-control',
    name: 'AccessUserVendorRoleList',
    meta: {
      descriptiveName: 'Access Control Listing'
    }
  },
  {
    path: 'access/access-control/new',
    name: 'NewAccessUserVendorRole',
    meta: {
      title: 'Create Access Control',
      descriptiveName: 'Access Control Create'
    }
  },
  {
    path: 'access/access-control/:userVendorRoleId',
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
    path: 'access/saml-users',
    name: 'AccessSAMLUserList',
    meta: {
      descriptiveName: 'Access SAML User Listing'
    }
  },
  {
    path: 'access/user-management',
    name: 'UserManagementList',
    meta: {
      descriptiveName: 'Access User Management Listing'
    }
  },
  {
    path: 'access/user-management/invitation',
    name: 'UserManagementInvitation',
    meta: {
      descriptiveName: 'Access User Management Invitation'
    },
    props: route => ({
      selectedUsers: route.params.selectedUsers
    })
  },
  {
    path: 'access/user-management/removal',
    name: 'UserManagementRemoval',
    meta: {
      descriptiveName: 'Access User Management Removal'
    },
    props: route => ({
      selectedUsers: route.params.selectedUsers
    })

  },
  {
    path: 'access/user-management/:merakiUserId',
    name: 'UserManagementUserDetail',
    meta: {
      descriptiveName: 'Access User Detail'
    },
    props: route => ({
      merakiUserId: route.params.merakiUserId
    })
  },
  {
    path: 'access/user-management/organization/:ownerOrganizationId/:merakiOrganizationUserId',
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
