import Vue from 'vue'
import Router from 'vue-router'

// Authen
// ----------------------------------
import LoginAuthToken from "@/components/login/login-auth-token";

// Users
// ----------------------------------
import EmailVerification from '@/components/registration/email-verification'
import InviteSignup from '@/components/registration/invite-signup'
import AuthTokenSignup from "@/components/registration/auth-token-signup";

// Layouts
// ----------------------------------
import LayoutLogin from "@/components/layouts/layout-login";

// Errors
// ----------------------------------
import ErrorPage from '@/components/pages/error-page'

// Routes
// ----------------------------------
import AuthRoutes from './auth'

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
            path: '/sign-up/invite',
            component: InviteSignup,
            name: 'invite-signup'
        },
        {
            path: '/sign-up/invite/:organizationSlug',
            component: InviteSignup,
            name: 'invite-signup',
            props: true
        },
        {
            path: '/sign-up/auth-token',
            component: AuthTokenSignup,
            name: 'auth-token-signup'
        },
        {
            path: '/error/:errorCode',
            name: 'error',
            component: ErrorPage,
            props: true
        },
        {
            path: '/',
            component: LayoutLogin,
            meta: { requiresUnAuthenticated: true },
            children: [
                ...AuthRoutes
            ]
        },
    ],
    mode: 'history'
})

export default router