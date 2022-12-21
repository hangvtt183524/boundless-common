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