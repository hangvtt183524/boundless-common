import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import Ls from '@/services/ls.js'

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
