import store from '../store'
import Ls from '@/services/ls'
import { checkPermissions } from '@/utils/permissions'

const getWorkspaceId = function (route) {
  // Try to get from store, route parameters or local storage
  return store.getters['layout/selectedWorkspace'].id ||
    route.params.workspaceId ||
    Number.parseInt(Ls.getJson('layout.state', {}).workspace)
}

export const checkWorkspaceApiKey = function (to, from, next) {
  if (store.getters['workspace/hasApiKeys'] === null) {
    // Api key state not fetched yet, fetch it first
    const workspaceId = getWorkspaceId(to)
    if (!workspaceId) {
      return next()
    }

    return store.dispatch('workspace/retrieveWorkspaceSetupStatus', { id: workspaceId }).then(() => {
      // hasApiKeys value set at this point
      return checkWorkspaceApiKey(to, from, next)
    }).catch(() => {
      // Could not fetch api key status, proceed to page
      return next()
    })
  }

  if (store.getters['workspace/hasApiKeys']) {
    // Has api keys
    return next()
  } else {
    // Does not have api keys
    const menu = store.getters['layout/menu']
    const activeProductIndex = store.getters['layout/activeProductIndex']
    let productName = menu[activeProductIndex].translation
    if (productName === 'network_management') {
      productName = 'automation'
    }
    return next({ name: 'ExternalApiKeysSetup', params: { nextPage: to.name, workspaceId: to.params.workspaceId, waitImportCompletion: true, backButtonHidden: true, productName: productName } })
  }
}

export const checkBeforeEachRoute = function(vuexStore, to, from, next) {
  if (!vuexStore.getters['auth/isAuthenticated']) {
    // Redirect to login when unauthenticated user
    if (to.matched.some(route => route.meta.requiresAuth)) {
      return next({ name: 'login' })
    } else if (to.path === '/') {
      // This is necessary since auth urls match path `/`
      // so we'll redirect it to login page
      return next({ name: 'login' })
    }
  } else {
    checkPermissions(vuexStore, to, from, next)

    if (to.path === '/') {
      const orgId = Number.parseInt(Ls.getJson('layout.state', {}).organization)
      if (orgId && vuexStore.dispatch['layout/hasOrganization']) {
        // Redirect to appropriate org url
        return next({ name: 'OrganizationHome', params: { orgId: orgId } })
      } else if (!to.name) {
        // Check if `to.name` is undefined, this means that the user
        // visits directly the home page by inputting the url
        // in the address bar.  Checking the name first avoids
        // infinite loop of redirection
        return next({ name: 'home' })
      }
    } else if (to.matched.some(route => route.meta.requiresUnAuthenticated)) {
      // When authenticated, if going to saml-router or auth token login screens, proceed so that user can login with
      // new credentials.
      // Otherwise block and redirect to home page
      if (!(to.path.indexOf('/saml-router') > -1 || to.path.indexOf('/login/auth-token') > -1)) {
        return next({ name: 'home' })
      }
    }
    // else if (to.matched.some(route => route.meta.requiresApiKey)) {
    //   // If route requires api key, check if workspace has api keys, redirect to api key setup page if not
    //   return checkWorkspaceApiKey(to, from, next)
    // }
  }
  return next()
}
