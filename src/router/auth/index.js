const Register = () => import('@/components/registration/registration')
const EmailVerificationInfo = () => import('@/components/registration/email-verication-info')
const Login = () => import('@/components/login/login')
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
]