import Vue from 'vue'
import Router from 'vue-router'

// Authen
// ----------------------------------
import LoginAuthToken from "@/components/login/login-auth-token";

// Users
// ----------------------------------
import EmailVerification from '@/components/registration/email-verification'

// Errors
// ----------------------------------
import ErrorPage from '@/components/pages/error-page'

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/login/auth-token',
            name: 'LoginAuthToken',
            component: LoginAuthToken,
            meta: {
                descriptiveName: 'Login',
                requiresUnAuthenticated: true
            }
        },
        {
            path: '/email-verification/:token/:email',
            name: 'email-verification',
            component: EmailVerification,
            props: true
        },
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