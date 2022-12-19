<template>
  <v-layout row wrap class="mb-3">
    <v-flex xs12 md6 class="pa-2 pt-3">
      <personal-info />
    </v-flex>

    <v-flex xs12 md6 class="pa-2 pt-3">
      <preferences />
    </v-flex>

    <v-flex xs12 md6 class="pa-2 pt-3">
      <email-info />
    </v-flex>

    <v-flex xs12 md6 class="pa-2 pt-3">
      <password-info />
    </v-flex>

    <v-flex xs12 md6 class="pa-2 pt-3">
      <boundless-api-info />
    </v-flex>

    <v-flex xs12 md6 class="pa-2 pt-3">
      <tfa-info />
    </v-flex>

    <v-flex xs12 class="pa-2 pt-4">
      <h3 class="small-heading pb-3">Account authorization</h3>
      <permissions-table :user-id="currentUser.id" />
    </v-flex>
  </v-layout>
</template>

<script>
import PersonalInfo from "@/components/user/personal-info";
import Preferences from "@/components/user/preferences";
import EmailInfo from "@/components/user/emai-info"
import PasswordInfo from "@/components/user/password-info";
import BoundlessApiInfo from "@/components/user/boundless-api-info";
import TfaInfo from "@/components/user/tfa-info";
import PermissionsTable from "@/components/user/permissions-table";

import UserPermissionsMixin from "@/mixins/user-permissions.mixin";
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'UserProfile',
  components: {
    PersonalInfo,
    Preferences,
    EmailInfo,
    PasswordInfo,
    BoundlessApiInfo,
    TfaInfo,
    PermissionsTable
  },
  mixins: [
    UserPermissionsMixin
  ],
  data () {
    // each field is represented by a value property and its validation rule
    return {
      headers: [
        { text: 'Organization', align: 'left', value: 'name' },
        { text: 'Site/ Group', align: 'right', value: 'site' },
        { text: 'Admin', align: 'right', value: 'admin' },
        { text: 'Manage', align: 'right', value: 'manage' },
        { text: 'Edit', align: 'right', value: 'edit' },
        { text: 'Read', align: 'right', value: 'read' }
      ],
      desserts: [
        {
          value: false,
          name: 'Etam France',
          site: 'Rue de Rennes',
          admin: true,
          manage: false,
          edit: false,
          read: false
        },
        {
          value: false,
          name: 'Etam France',
          site: 'Rue de Rennes',
          admin: true,
          manage: false,
          edit: false,
          read: true
        },
        {
          value: false,
          name: 'Etam France',
          site: 'Rue de Rennes',
          admin: true,
          manage: false,
          edit: false,
          read: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'userOptions'])
  },

  methods: {
    ...mapActions('user', ['fetchUserOptions'])
  }
}
</script>