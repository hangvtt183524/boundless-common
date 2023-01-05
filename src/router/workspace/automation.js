export default [
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
