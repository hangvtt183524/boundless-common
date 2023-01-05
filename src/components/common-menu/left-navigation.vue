<template>
  <v-navigation-drawer
      class="sidebar-main"
      dark app stateless
      v-model="drawer"
      v-show="userWorkspaces.length > 0"
  >
    <side-menu />
    <left-toolbar />
  </v-navigation-drawer>
</template>

<script>
import SideMenu from "@/components/common-menu/side-menu";
import LeftToolbar from "@/components/common-menu/left-toolbar";
import NodeSelectionsMixin from "@/mixins/node-selections.mixin";
import ToggleDrawerMixin from "@/mixins/toggle-drawer.mixin";
import {mapGetters} from "vuex";

export default {
  mame: 'LeftNavigation',
  data () {
    return {
      hasTabBar: false
    }
  },
  components: {
    SideMenu,
    LeftToolbar
  },
  mixins: [
      NodeSelectionsMixin,
      ToggleDrawerMixin
  ],
  computed: {
    ...mapGetters(['drawer']),
    ...mapGetters('layout', ['userWorkspaces']),
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (value) {
        this.$store.commit('UPDATE_DRAWER', value)
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import "styles/v2/colors.scss";

.v-navigation-drawer.sidebar-main {
  margin-top: 0 !important;
  z-index: 101;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: #132a54 !important;
  width: 265px !important;
  overflow: visible;
  will-change: auto;
  transform: none !important;
  position: unset !important;
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 60px !important;
  }

  &.v-navigation-drawer--fixed {
    @media (max-width: 767px) {
      position: fixed;
      top: 0;
      right: 0;
      left: auto;
      width: 265px !important;
      &.v-navigation-drawer--close {
        transform: translateX(300px) !important;
      }
    }
  }
}

.application .theme--dark.navigation-drawer,
.theme--dark .navigation-drawer {
  background-color: #132A54;
}
</style>