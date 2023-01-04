import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { checkBeforeEachRoute } from './helpers'

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
import LayoutMain from "@/components/layouts/layout-main";

// Errors
// ----------------------------------
import ErrorPage from '@/components/pages/error-page'

import Home from '@/components/pages/home'
const UserProfile = () => import(/* webpackChunkName: "profile" */ '@/components/user/profile')

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
        {
            path: '/',
            component: LayoutMain,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: Home
                },
                {
                    path: 'profile',
                    name: 'UserProfile',
                    component: UserProfile,
                    meta: {
                        title: 'User Profile',
                        descriptiveName: 'Profile'
                    }
                },
                {
                    path: '/captive/workspace/create',
                    name: 'CreateWorkspace',
                },
                {
                    path: '/captive/organization/create',
                    name: 'CreateOrganizationModeSelect',
                },
                {
                    path: '/captive/organization/create/manual',
                    name: 'CreateOrganizationManual',
                },
                {
                    path: '/captive/organization/create/quick',
                    name: 'CreateOrganizationQuick',
                },
            ]
        }
    ],
    mode: 'history'
})

router.beforeEach((to, from, next) => checkBeforeEachRoute(store, to, from, next))

export default router