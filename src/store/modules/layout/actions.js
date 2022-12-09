import axios from 'axios'
import * as types from './mutation-types'
import Ls from '@/services/ls'
const API_URL = process.env.VUE_APP_API_URL

export const fetchUserWorkspaces = ({ commit }) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/workspace/related/`, { params: { page_size: 0 } }).then(response => {
            commit(types.UPDATE_USER_WORKSPACES, response.data.data)
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

export const selectWorkspace = ({ commit, dispatch, state }, workspace) => {
    Ls.updateInJson('layout.state', 'workspace', workspace.id)

    commit(types.RESET)
    commit(types.SELECT_WORKSPACE, workspace)
    commit(types.UPDATE_SELECTED_WORKSPACE_STATE, false)
    commit(types.UPDATE_USER_WORKSPACE_ORGANIZATIONS_LOAD_STATE, false)

    dispatch('workspace/resetWorkspaceState', {}, { root: true})
    dispatch('workspace/retrieveWorkspace', { id: workspace.id }, { root: true }).then(response => {
        if (workspace.id === state.selectedWorkspace.id) {
            commit(types.SELECT_WORKSPACE, response.data.data)
            commit(types.UPDATE_SELECTED_WORKSPACE_STATE, true)
        }
    })
}

export const clearWorkspaceSelections = ({ commit }) => {
    Ls.updateInJson('layout.state', 'workspace', null)
    commit(types.SELECT_WORKSPACE, { id: null })
}

export const fetchUserWorkspaceOrganizations = ({ commit }, { workspaceId }) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/workspace/${workspaceId}/organization/`, { params: { page_size: 0 }, suppressErrors: true }).then(response => {
            commit(types.UPDATE_USER_WORKSPACE_ORGANIZATIONS, response.data.data)
            commit(types.UPDATE_USER_WORKSPACE_ORGANIZATIONS_LOAD_STATE, true)
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

export const selectOrganization = ({ commit, dispatch, state }, organization) => {
    Ls.updateInJson('layour.state', 'organization', organization.id)

    commit(types.SELECT_ORGANIZATION, organization)
    commit(types.UPDATE_SELECTED_ORGANIZATION_STATE, false)

    dispatch('organization/fetchOrganization', organization.id, { root: true }).then(response => {
        if (organization.id === state.selectedOrganization.id) {
            commit(types.SELECT_ORGANIZATION, response.data.data)
            commit(types.UPDATE_SELECTED_ORGANIZATION_STATE, true)

            if (state.selectedWorkspace.id !== response.data.data.parent_workspace) {
                dispatch('layout/selectWorkspace', { id: response.data.data.parent_workspace }, { root: true })
            }
        }
    })
}

export const selectNode = ({ commit, dispatch, state }, node) => {
    commit(types.SELECT_NODE, node)
    commit(types.UPDATE_SELECTED_NODE_STATE, false)

    dispatch('organization/node/retrieveNode', { nodeId: node.id }, { root: true }).then(response => {
        if (node.id === state.selectedNode.id) {
            if (state.userOrganizationNodes.map(node => node.id).indexOf(response.data.data.id) === -1 &&
            response.data.data.id !== state.selectedOrganization.id) {
                dispatch('layout/selectNode', { id: state.selectedOrganization.id, correction: true }, { root: true })
            } else {
                commit(types.SELECT_NODE, response.data.data)
                commit(types.UPDATE_SELECTED_NODE_STATE, true)
            }
        }
    })
}

export const clearOrganizationSelections = ({ commit }) => {
    Ls.updateInJson('layout.state', 'organization', null)
    commit(types.SELECT_ORGANIZATION, { id: null })
    commit(types.SELECT_NODE, { })
}