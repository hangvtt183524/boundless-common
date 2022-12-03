import Vue from 'vue'
import Router from 'vue-router'

// Errors
// ----------------------------------
import ErrorPage from '@/components/pages/error-page'

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/error/:errorCode',
            name: 'error',
            component: ErrorPage,
            props: true
        }
    ],
    mode: 'history'
})

export default router