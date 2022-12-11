import Vue from 'vue'
import Vuex from 'vuex'

import state from "@/store/state"
import getters from "@/store/getters"
import mutations from "@/store/mutations"
import actions from "@/store/actions"

import auth from './modules/auth'
import user from './modules/user'
import layout from './modules/layout'
import workspace from './modules/workspace'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state,
    getters,
    mutations,
    actions,

    modules: {
        auth,
        user,
        layout,
        workspace
    }
})