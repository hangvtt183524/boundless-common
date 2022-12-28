<template>
  <div class="base-filter" v-click-outside="onClickOutside">
    <div class="base-filter--header">
      <v-layout>
        <v-flex justify-center text-xs-center base-filter--checkbox-container>
          <base-check-box
              class="base-check-box--small select-all-button"
              v-model="value.selected"
              @click="onCheckBoxClick"
          ></base-check-box>
        </v-flex>
        <v-flex @click="onExpandClick">
          <span class="base-filter--header--filter-name">
            {{ value.name }}
          </span>
        </v-flex>
        <v-flex>
          <v-icon v-if="!sectionsExpanded" class="base-filter--header--icon expand-icon">arrow_drop_up</v-icon>
          <v-icon v-if="sectionsExpanded" class="base-filter--header--icon expand-icon">arrow_drop_down</v-icon>
        </v-flex>
      </v-layout>
    </div>

    <transition name="slide">
      <div class="base-filter--sections" v-show="sectionsExpanded">
        <div class="base-filter-ssids">
          <div v-for="ssid of value.ssids" :key="ssid.id"
               class="base-filter--ssid base-filter--section-item"
          >
            <v-layout >
              <v-flex justify-center text-xs-center base-filter--checkbox-container>
                <base-check-box
                    v-model="ssid.selected"
                    @input="onSelectionChange"
                    class="base-check-box--small ssid-checkbox"></base-check-box>
              </v-flex>
              <v-flex class="section-name-container" @click="onClickLabel(ssid)">
                <span class="section-name">
                  {{ ssid.name }}
                </span>
              </v-flex>
            </v-layout>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import BaseCheckBox from "@/components/v2/base-check-box";

export default {
  name: 'base-filter',
  components: { BaseCheckBox },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      sectionsExpanded: false
    }
  },
  mounted () {
    this.$set(this.value, 'selected', !!this.value.selected)
    this.value.ssids.forEach(ssid => {
      this.$set(ssid, 'selected', !!ssid.selected)
    })
  },
  methods: {
    onExpandClick: function () {
      this.sectionsExpanded = !this.sectionsExpanded
    },
    onCheckBoxClick: function () {
      if (!this.value.selected) {
        // Select all items
        this.value.selected = true
        this.value.ssids.forEach(ssid => {
          ssid.selected = true
        })
        this.sectionsExpanded = true
        this.value.selected = true
      } else {
        // De-select all
        this.value.selected = false
        this.value.ssids.forEach(ssid => {
          ssid.selected = false
        })
        this.value.selected = false
        this.sectionsExpanded = false
      }

      // Trigger selection change
      this.$emit('input', this.value)
    },
    onClickOutside: function () {
      this.sectionsExpanded = false
    },
    onClickLabel (ssid) {
      ssid.selected = !ssid.selected
      this.onSelectionChange()
    },
    onSelectionChange: function () {
      let subItemSelected = false
      for (let i = 0; i < this.value.ssids.length; i += 1) {
        if (this.value.ssids[i].selected) {
          subItemSelected = true
          break
        }
      }
      if (subItemSelected) {
        this.value.selected = true
      } else {
        this.value.selected = false
      }
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-filter {
  box-sizing: border-box;

  &--checkbox-container {
    width: 36px;
    min-width: 36px;
    max-width: 36px;
    margin-top: 2px;
  }

  &--header {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    color: $text-medium;

    &--filter-name {
      cursor: pointer;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      user-select: none;
    }

    &--icon {
      color: $text-medium;
      font-size: 15px;
    }
  }

  &--sections {
    background: #FFFFFF;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.12);
    padding: 2px;
    width: 300px;

    .base-filter-ssids {
      .base-filter--ssid {
        &:nth-child(2n + 1) {
          background-color:  rgba(#EFF3F8, 0.5);
        }
        &:nth-child(2n) {
          background-color: $white;
        }
      }
    }

    .base-filter--sd-wan {
      box-sizing: content-box;
      padding: 10px;
    }
  }

  &--section-item {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: $text-medium;
    line-height: 32px;
    height: 32px;

    .section-name-container {
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &--icon {
      font-size: 15px;
    }
  }

  .slide-enter-active {
    transition-duration: 0.1s;
    transition-timing-function: linear;
  }

  .slide-leave-active {
    transition-duration: 0.1s;
    transition-timing-function: linear;
  }

  .slide-enter-to, .slide-leave {
    max-height: 100px;
    overflow: hidden;
  }

  .slide-enter, .slide-leave-to {
    overflow: hidden;
    max-height: 0;
  }
}
</style>