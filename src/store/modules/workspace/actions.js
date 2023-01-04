import axios from 'axios'
import * as types from './mutation-types'
import Ls from '@/services/ls'

const API_URL = process.env.VUE_APP_API_URL

export const clearWorkspaceUserSecurityChecks = ({ commit }) => {
    commit(types.UPDATE_USER_SECURITY_CHECKS, {})
}

export const setPendingInvitationId = ({ commit }, invitationId) => {
    commit(types.SET_PENDING_INVITATION_ID, invitationId)
}

export const fetchActivityLogs = ({ commit }, { filters }) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/action-log/`, { params: filters }).then(response => {
            const results = response.data.data.results.map(item => {
                item.node_name = item.entities && item.entities.length && item.entities[0].node ? item.entities[0].node.name : ''
                return item
            })

            commit(types.UPDATE_ACTIVITY_LOGS, results)
            commit(types.UPDATE_ACTIVITY_LOGS_COUNT, response.data.data.count)
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}

export const resetWorkspaceState = ({ commit, dispatch, state }) => {
    // To be called when workspace changes, clears workspace-specific state data
    commit(types.RESET)
}

export const retrieveWorkspace = ({ commit, dispatch, state }, { id }) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/workspace/${id}/`, { suppressErrors: true }).then((response) => {
            resolve(response)
        }).catch(err => {
            if (err && err.response && err.response.data && err.response.data.error &&
                err.response.data.error.status === 404) {
                // Clear workspace from layout state and on 404 errors
                Ls.updateInJson('layout.state', 'workspace', null)
            }

            reject(err)
        })
    })
}