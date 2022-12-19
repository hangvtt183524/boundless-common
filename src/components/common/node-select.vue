<template>
  <div class="node-select">
    <v-select
        class="tree-style"
        v-if="!searchEnabled"
        :value="value"
        :items="computedNodes"
        @input="$emit('input', $event)"
        :menu-props="{ contentClass:'tree-style' }"
        v-bind="$attrs"
    >
      <template slot="item" slot-scope="data" class="disabled">
        <div class="item-wrap" :style="indent(data.item.level)">
          <span>
            <brief-case-icon v-if="data.item.type === 'organization'" />
            <group-folder-icon v-else-if="data.item.type === 'group'" />
            <floor-icon v-else-if="data.item.type == 'floor'" />
            <map-marker-icon v-else />
          </span>

          <span class="pre-wrap">{{ data.item.text }}</span>
        </div>
      </template>
    </v-select>

    <v-autocomplete
        class="tree-style"
        v-if="searchEnabled"
        :value="value"
        :items="computedNodes"
        @input="$emit('input', $event)"
        :menu-props="{ contentClass:'tree-style' }"
        v-bind="$attrs"
        @blur="$refs.select.isMenuActive = false"
        ref="select"
    >
      <template slot="item" slot-scope="data" class="disabled">
        <div class="item-wrap" :style="indent(data.item.level)">
          <span>
            <brief-case-icon v-if="data.item.type === 'organization'" />
            <group-folder-icon v-else-if="data.item.type === 'group'" />
            <floor-icon v-else-if="data.item.type == 'floor'" />
            <map-marker-icon v-else />
          </span>

          <span class="pre-wrap">{{ data.item.text }}</span>
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import ManageableNodesMixin from "@/mixins/manageable-nodes.mixin";

import BriefCaseIcon from '@/components/icons/briefcase'
import GroupFolderIcon from '@/components/icons/group-folder'
import MapMarkerIcon from '@/components/icons/map-marker'
import FloorIcon from '@/components/icons/floor'

export default {
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    indentLevel: {
      type: Number,
      default: 1
    },
    items: {
      type: Array,
      default: null
    },
    nodeTypes: {
      type: Array,
      default: () => {
        return [
          'organization',
          'group',
          'site',
          'floor',
          'device'
        ]
      }
    },
    searchEnabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BriefCaseIcon,
    GroupFolderIcon,
    MapMarkerIcon,
    FloorIcon
  },
  mixins: [
    ManageableNodesMixin
  ],
  computed: {
    computedNodes () {
      if (this.items) {
        return this.items
      }
      return this.getNodesByType(this.nodeTypes)
    }
  },
  data () {
    return {

    }
  },
  methods: {
    indent (level) {
      return { transform: `translate(${(level - this.indentLevel) * 25}px)` }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-menu__content {
  &.tree-style {
    transform: translateY(34px);

    .s-icon {
      width: 25px;
      height: 15px;
      display: block;
      color: #9ba9c4;
      margin-right: 12px;
    }

    .item-wrap {
      display: flex;
      transform: translate(20px);
      width: 100%;
      align-items: center;
    }
  }
}
</style>