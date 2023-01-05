export default [
  {
    path: 'logs/syslog-servers',
    name: 'SyslogServerList',
    meta: {
      descriptiveName: 'Syslog Servers Listing'
    }
  },
  {
    path: 'logs/syslog-servers/new',
    name: 'NewSyslogServer',
    meta: {
      title: 'Launch Syslog Server',
      descriptiveName: 'Syslog Server Detail'
    }
  },
  {
    path: 'logs/syslog-servers/:syslogServerId',
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
