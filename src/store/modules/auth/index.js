import Ls from '@/services/ls.js'

import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const initialState = {
    token: Ls.get('auth.token'),
    tfaMode: '',
    tfaToken: '',
    status: '',
    validateTokenError: '',
    validateTokenSuccess: '',
    registeredEmail: ''
}

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations
}