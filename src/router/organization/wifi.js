export default [
  {
    path: 'wifi/authorization-parameters',
    redirect: 'wifi/authorization-parameters/guest',
    name: 'WifiSettingsParameters',
    children: [
      {
        path: 'guest',
        name: 'WifiSettingsParametersGuest',
        meta: {
          nodeRoles: ['organization', 'group', 'site'],
          title: 'Guest'
        }
      },
      {
        path: 'secured',
        name: 'WifiSettingsParametersSecured',
        meta: {
          nodeRoles: ['organization', 'group', 'site']
        }
      }
    ]
  },
  {
    path: 'wifi/self-registration',
    name: 'SelfRegistration',
    meta: {
      roles: ['internal', 'admin', 'manage'],
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Wifi Config',
      descriptiveName: 'Session Limits'
    }
  },
  {
    path: 'wifi/sponsored-access',
    name: 'SponsoredAccess',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Sponsor Access',
      descriptiveName: 'Sponsored Visitor Listing'
    }
  },
  {
    path: 'wifi/sponsored-access/sponsor',
    name: 'AddSponsors',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Access Codes',
      descriptiveName: 'Sponsor Management'
    }
  },
  {
    path: 'wifi/ticketing',
    name: 'Ticketing',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Ticketing',
      descriptiveName: 'Ticket Listing'
    }
  },
  {
    path: 'wifi/ticketing/access-ticket',
    name: 'AddTicket',
    meta: {
      nodeRoles: ['organization', 'group', 'site']
    }
  },
  {
    path: 'wifi/access-codes',
    name: 'AccessCodes',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Vouchers',
      descriptiveName: 'Access Code Listing'
    }
  },
  {
    path: 'wifi/access-codes/:voucherId',
    name: 'VoucherCodes',
    props: true,
    meta: {
      title: 'Voucher Codes'
    }
  },
  {
    path: 'wifi/access-codes/multiple-access',
    name: 'GenerateCodes',
    meta: {
      nodeRoles: ['organization', 'group', 'site']
    }
  },
  {
    path: 'wifi/ldap-authentication',
    name: 'LdapAuthentication',
    meta: {
      roles: ['internal', 'admin', 'manage'],
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Ldap Authentication Config',
      descriptiveName: 'LDAP Authentication Configuration'
    }
  },
  {
    path: 'wifi/single-sign-on',
    name: 'SSOAuthentication',
    meta: {
      roles: ['internal', 'admin', 'manage'],
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Single Sign On Config',
      descriptiveName: 'SSO Authentication Configuration'
    }
  }
]
