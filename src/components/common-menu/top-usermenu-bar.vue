<template>
  <div class="usermenu-bar">
    <span class="splitter" v-show="!menuVisible"></span>

    <v-menu close-delay="user-menu action"
            top right offset-y open-on-hove
            content-class="top-usermenu-bar-custom-menu"
            v-model="menuVisible"
    >
      <div class="user-profile-container d-flex"
           slot="activator"
           :class="{ 'active': menuVisible }"
      >
        <div class="profile-image-container">
          <img :src="require('@/assets/images/profile-avatar.svg')"
               class="profile-image"
          >
        </div>

        <div class="profile-name">
           {{currentUser.profile.full_name}}
        </div>

        <v-icon class="user-profile-trigger__icon" v-if="!menuVisible">
          arrow_drop_down
        </v-icon>

        <v-icon class="user-profile-trigger__icon" v-if="menuVisible">
          arrow_drop_up
        </v-icon>
      </div>

      <v-list @click.native="stopPropagation">
        <v-list-tile v-show="userWorkspaces.length > 0"
                     class="menu-item"
                     :to="{name: 'UserProfile'}"
        >
          <v-list-tile-action class="menu-item__icon">
            <img :src="require('@/assets/images/settings_black.svg')">
          </v-list-tile-action>

          <span>My Profile</span>
        </v-list-tile>

        <v-list-tile @click="logoutUser">
          <v-list-tile-action class="menu-item__icon logout">
            <img :src="require('@/assets/images/logout.svg')">
          </v-list-tile-action>

          <span>Logout</span>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import {mapActions, mapGetters} from "vuex";

export default {
  mixins: [NodeSelectionsMixin],
  data () {
    return {
      menuVisible: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('layout', ['userWorkspaces']),
  },
  methods: {
    ...mapActions('auth', ['logout']),

    logoutUser () {
      this.logout()

      // EventTracker.sendEvent(EVENT_NAMES.USER_LOGGED_OUT)
    },

    stopPropagation () {

    }
  }
}
</script>

<style lang="scss">
@import "styles/v2/colors.scss";

.usermenu-bar {
  padding: 0;
  margin-left: 24px;

  .splitter {
    border-left: solid 2px #e2e8f1;
    font-size: 33px;
    vertical-align: middle;
  }
  .user-profile-container {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: $text-dark;
    display: inline-block;
    margin-right: 5px;
    padding: 17px 20px 17px 14px;
    vertical-align: middle;

    &.active {
      background: rgba(#EFF3F8, .5);
    }

    .profile-image-container {
      width: 26px;
      height: 26px;
      display: inline-block;
      vertical-align: middle;

      .profile-image {
        width: 26px;
        height: 26px;
        object-fit: scale-down;
      }
    }
    .profile-name {
      margin: 0 0 0 16px;
      display: inline-block;
      vertical-align: middle;
      width: 94px;
      line-height: 26px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      font-family: Overpass;
      font-style: normal;
      font-size: 14px;
      letter-spacing: 1.5px;
      color: $text-dark;
    }
    .user-profile-trigger__icon {
      color: #E2E8F1;
    }
  }
}
.top-usermenu-bar-custom-menu {
  width: 198px !important;
  top: 54px !important;
  right: 0 !important;
  left: unset !important;
  z-index: 3000 !important;

  .menu-item__icon {
    position: absolute;
    left: 17px;

    &.logout {
      left: 19px;
    }
  }

  .v-list {
    padding: 0 !important;
  }
  .v-list__tile__title {
    padding-left: 37px;
  }
}
</style>