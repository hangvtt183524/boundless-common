import axios from 'axios'
import * as types from './mutation-types'
import Ls from '@/services/ls'

const API_URL = process.env.VUE_APP_API_URL

export const clearWorkspaceUserSecurityChecks = () => {
    commit(types.UPDATE_USER_SECURITY_CHECKS, {})
}

export const setPendingInvitationId = ({ commit }, invitationId) => {
    commit(types.SET_PENDING_INVITATION_ID, invitationId)
}