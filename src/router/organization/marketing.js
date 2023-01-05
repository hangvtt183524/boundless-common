export default [
  {
    path: 'marketing/campaigns',
    name: 'Campaigns',
    meta: {
      title: 'Campaigns',
      descriptiveName: 'Campaign Listing'
    }
  },
  {
    path: 'marketing/campaigns/:campaignId',
    name: 'CampaignDetail',
    props: true,
    meta: {
      title: 'Campaign Detail',
      descriptiveName: 'Campaign Detail'
    }
  },
  {
    path: 'marketing/splash-pages',
    name: 'SplashPages',
    meta: {
      title: 'Splash Pages',
      descriptiveName: 'Splash Page Templates'
    }
  },
  {
    path: 'marketing/media-library',
    name: 'MediaLibrary',
    meta: {
      title: 'Media Library',
      descriptiveName: 'Media Library'
    }
  }

]
