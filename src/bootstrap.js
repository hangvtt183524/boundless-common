import Vue from 'vue'
import Vuetify from "vuetify"
import colors from 'vuetify/es5/util/colors'
import VueClipboard from 'vue-clipboard2'
import VueTouch from 'vue-touch'
import Vuelidate from 'vuelidate'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VueNativeSock from 'vue-native-websocket'
import VueMask from 'v-mask'

import Ls from '@/services/ls'

/**
 * Globals
 */
global.VueScrollTo = require('vue-scrollto')
global.axios = require('axios')
global.toastr = require('toastr')
global._ = require('lodash')
global.RandExp = require('randexp')
global.touchMap = new WeakMap()

/**
 * CSS Imports
 */

import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

/**
 * Global Axios Request Interceptor
 */
global.toastr.options = {
    positionClass: 'toast-top-full-width',
    closeButton: true,
    preventDuplicates: true,
    closeHtml: '<button><i class="icon material-icons">close</i></button>'
}

const trimStringData = data => {
    if (data instanceof FormData) {
        for (let item of data) {
            if (typeof item[1] === 'string') {
                data.set(item[0], item[1].trim())
            }
        }
    } else if (data instanceof Object) {
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') {
                data[key] = data[key].trim()
            }
        })
    }
}

/**
 * Global Axios Request Interceptor
 */


global.axios.interceptors.request.use(config => {
    if (['post', 'put', 'patch'].includes(config.method)) {
        trimStringData(config.data)
    }

    const AUTH_TOKEN = Ls.get('auth.token')
    if (AUTH_TOKEN) {
        config.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
    }

    return config
}, error => {
    return Promise.reject(error)
})

/**
 * Global Axios Response Interceptor
 */

global.axios.interceptors.response.use(undefined, error => {
    return new Promise((resolve, reject) => {
        const exemptedCodes = ['reset_token_invalid', 'wrong_credentials', 'account_email_not_verified']

        if (!error.response) return
        if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
            let errorCode = error.response.data.error.detail.code
            console.log('Error: ', errorCode)

            if (!exemptedCodes.includes(errorCode)) {
                if (errorCode !== 'refresh_expired') {
                    console.log('Refreshing')
                    return 'dispatch den refreshToken trong store/auth'
                } else {
                    console.log('REFRESH EXPIRED!')
                    // dispatch store/auth/logout
                    console.log('Unauthorized! Logging out.')
                }
            }
        } else if (error.response.status === 403) {
            const requestUrl = error.response.config.url

            if (!error.response.config.suppressErrors) {
                const errorDetail = error.response.data.error
                errorDetail.messages.forEach(errorMessage => {
                    if (errorMessage.code === 'permission_denied') {
                        if (error.response.config.suppressErrors ||
                            (requestUrl && (requestUrl.indexOf('api/signin') > -1 || requestUrl.indexOf('api/me') > -1))) {
                            // Skip generic permission error for authentication or background requests
                            return
                        }
                    }
                    global.toastr['error'](`Could not find a workspace api key with access or higher for organization`)
                })
            }

            if (requestUrl && requestUrl.indexOf('api/signin') === -1
                && requestUrl.indexOf('api/me') === -1
                && requestUrl.indexOf('user-security-checks') === -1
            ) {
                // fetch workspace user security check
            }

            throw error
        } else if (error.response.status === 500) {
            // go to page Error
        } else {
            const errorDetail = error.response.data.error
            if (error.response.status === 400) {
                if (!error.response.config.suppressErrors) {
                    global.toastr['error']('Bad Request Error 400: API with parameters no existed')
                }
            }

            if (errorDetail && errorDetail.status === 404) {
                global.toastr['error']('Command not support')
                setTimeout(() => window.location = '/', 2000)

                throw error
            } else {
                throw error
            }
        }
    })
})

/**
 * Plugins
 */

Vue.use(Vuetify, {
    theme: {
        primary: '#4b83f0',
        secondary: '#3260D3',
        accent: colors.purple.base,
        error: '#EC5F59',
        warning: colors.orange.base,
        info: colors.yellow.base,
        success: '#62d862'
    },
    //icons: customIcons
})

Vue.use(global.VueScrollTo)
Vue.use(VueClipboard)
Vue.use(VueTouch)
Vue.use(Vuelidate)
Vue.use(PerfectScrollbar)
Vue.use(VueMoment, { moment })
Vue.use(VueNativeSock, process.env.VUE_APP_WEBSOCKET_URL, { connectManually: true })
Vue.use(VueMask)

/**
 * Custom Directive
 */

Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        el.event = function (event) {
            // here I check that click was outside the el and his childrens
            if (!(el === event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event)
            }
        }
        document.body.addEventListener('click', el.event)
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.event)
    }
})

/**
 * Register Global Filters
 */
Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.prototype.$eventHub = new Vue() // Global event bus