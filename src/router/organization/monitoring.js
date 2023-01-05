export default [
  {
    path: 'monitoring/wifi-analytics',
    name: 'WifiAnalytics',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Wifi Analytics',
      descriptiveName: 'Portal Analytics'
    },
    children: [
      {
        path: ':time/:group',
        name: 'WifiAnalyticsSearch',
      }
    ]
  },
  {
    path: 'monitoring/presence-analytics',
    name: 'PresenceAnalytics',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Presence Analytics'
    },
    children: [
      {
        path: ':time/:group',
        name: 'PresenceAnalyticsSearch',
      }
    ]
  },
  {
    path: 'monitoring/connected-visitors',
    name: 'Visitors',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Connected Visitors',
      descriptiveName: 'Visitor Listing'
    }
  },
  {
    path: 'monitoring/connected-visitors/:visitorId',
    name: 'VisitorDetails',
    props: true,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Visitor Detail',
      descriptiveName: 'Visitor Detail'
    }
  },
  {
    path: 'monitoring/mv-sense',
    name: 'MVSense',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'MV Sense'
    }
  }
]
