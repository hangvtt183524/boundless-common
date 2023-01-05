export default [
  {
    path: 'venues',
    name: 'Venues',
    meta: {
      nodeRoles: ['organization'],
      title: 'Venues',
      descriptiveName: 'Venue Listing'
    }
  },
  {
    path: 'venues/detail',
    name: 'SiteGroupDetail',
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Venues Detail',
      descriptiveName: 'Venue Detail'
    }
  }
]
