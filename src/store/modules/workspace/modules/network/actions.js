import axios from 'axios'
import * as types from './mutation-types'

const API_URL = process.env.VUE_APP_API_URL

export const fetchUserDashboards = ({ commit }, { workspaceId }) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/workspace/${workspaceId}/user-dashboard/`, { params: { page_size: 0 } }).then((response) => {
            commit(types.UPDATE_USER_DASHBOARDS, {
                workspaceId,
                items: response.data.data
            })

            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}

export const fetchLongRunningJob = ({ commit, dispatch, state }, { workspaceId, jobId }) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/workspace/${workspaceId}/meraki/job/${jobId}/`).then((response) => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getMerakiEntities = ({ commit, state }, { workspaceId, entityType, ...filters }) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/workspace/${workspaceId}/meraki/entity/${entityType}/`, { params: filters }).then((response) => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}