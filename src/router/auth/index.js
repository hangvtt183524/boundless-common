const Register = () => import('@/components/registration/registration')
const EmailVerificationInfo = () => import('@/components/registration/email-verication-info')
const Login = () => import('@/components/login/login')
const Login2fa = () => import('@/components/login/login-2fa')
const Callback = () => import('@/components/login/callback')
const LoginOrganizationRouter = () => import('@/components/login/login-organization-router')
const ForgotPassword = () => import('@/components/login/forgot-password')
const ResetPassword = () => import('@/components/login/reset-password')
const SamlRouter = () => import('@/components/login/saml-router')
export default [
    {
        path: '/sign-up',
        name: 'register',
        component: Register,
        meta: {
            descriptiveName: 'Registration'
        }
    },
    {
        path: '/email-verification/pending',
        name: 'EmailVerificationInfo',
        component: EmailVerificationInfo
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            descriptiveName: 'Login'
        }
    },
    {
        path: '/login/:organizationSlug',
        name: 'login',
        component: Login,
        props: true
    },
    {
        path: '/login/2fa',
        name: 'login2fa',
        component: Login2fa
    },
    {
        path: '/callback',
        name: 'Callback',
        component: Callback
    },
    {
        path: '/login/organization-router',
        name: 'LoginOrganizationRouter',
        component: LoginOrganizationRouter,
        meta: {
            descriptiveName: 'Login SSO'
        }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword
    },
    {
        path: '/reset-password/:uidb64/:token',
        name: 'ResetPassword',
        component: ResetPassword
    },
    {
        path: '/saml-router',
        name: 'SamlRouter',
        component: SamlRouter
    }
]