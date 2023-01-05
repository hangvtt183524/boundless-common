import VenueRoutes from './venues'
import MonitoringRoutes from './monitoring'
import MarketingRoutes from './marketing'
import SettingsRoutes from './settings'
import WifiSettingsRoutes from './wifi'
import SecurityRoutes from './security'

export default [
  ...VenueRoutes,
  ...MonitoringRoutes,
  ...MarketingRoutes,
  ...SettingsRoutes,
  ...WifiSettingsRoutes,
  ...SecurityRoutes,
  {
    path: '/',
    name: 'OrganizationHome',
    meta: {
      nodeRoles: ['organization']
    }
  },
  {
    path: 'inventory',
    name: 'OrganizationInventory',
    meta: {
      roles: ['internal', 'admin'],
      nodeRoles: ['organization'],
      title: 'Device Inventory',
      descriptiveName: 'Device Listing'
    }
  },
  {
    path: 'setup-wifi-network',
    name: 'OrganizationSetupWifiNetwork',
    props: (route) => ({
      isQuickSetup: true
    }),
    meta: {
      roles: ['internal', 'admin'],
      nodeRoles: ['organization'],
      title: 'Organization Setup',
      descriptiveName: 'Hardware Setup'
    }
  },
  {
    path: 'hardware-setup',
    name: 'HardwareSetup',
    props: (route) => ({
      isQuickSetup: false
    }),
    meta: {
      roles: ['internal', 'admin'],
      nodeRoles: ['organization'],
      title: 'Hardware Setup'
    }
  }
]
