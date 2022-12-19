<template>
  <div>
    <div class="title" v-if="title || slotTitle">
      <v-layout row>
        <v-flex xs12 class="py-3">
          <slot name="title">
            <h3 class="small-heading">{{ title }}</h3>
          </slot>
        </v-flex>
      </v-layout>
    </div>

    <div class="editable-panel">
      <v-layout row wrap :class="{ disabled: disabled, readonly: disabled }">
        <v-card class="editable-card" :class="cardClass"
                data-test="editable-card"
                :readonly="!isEditing"
        >
          <div @mouseleave="isHovering = false" @mouseover="isHovering = true">
            <v-toolbar class="px-2 py-0" color="transparent" flat>
              <v-spacer />
              <v-fade-transition>
                <v-btn
                    data-test="edit-button"
                    @click="edit"
                    icon
                    small
                    v-show="showEditIcon"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-fade-transition>
            </v-toolbar>

            <v-card-text class="px-4 pt-0 pb-4">
              <slot :readonly="!isEditing"></slot>
            </v-card-text>
          </div>

          <v-fade-transition>
            <v-card-actions class="px-4 pb-5 pt-0" color="white" v-show="isEditing || isLoading">
              <slot name="actions">
                <v-spacer />
                <v-btn data-test="btn-cancel"
                       @click="cancel"
                       color="success"
                       outline
                       round
                >
                  Cancel
                </v-btn>

                <v-btn
                    data-test="btn-submit"
                    :disabled="disableSubmit"
                    :loading="isLoading"
                    @click="submit"
                    color="success"
                    round
                >
                  {{ submitText }}
                </v-btn>
              </slot>
            </v-card-actions>
          </v-fade-transition>
        </v-card>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditablePanel',
  props: {
    disableSubmit: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: 'Save'
    },
    title: {
      type: String,
      default: ''
    },
    slotTitle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    dataTest: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isHovering: false
    }
  },
  computed: {
    showEditIcon () {
      if (this.isReadonly) {
        return false
      }
      return !this.isEditing && this.isHovering
    },
    cardClass () {
      return {
        readonly: !this.isEditing,
        round: this.round,
        'elevation-10': this.isEditing,
        'showing-edit-icon': this.showEditIcon
      }
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    edit () {
      this.$emit('edit')
    },
    submit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
.title ::v-deep {
  .base-switch {
    margin-top: -1px !important;
  }

  .base-switch label {
    line-height: 24px !important;
    height: 24px !important;
  }

  .base-switch {
    .input-group__details {
      display: none !important;
    }

    .input-group__input {
      min-height: 24px !important;
    }
  }
}

.layout.disabled {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(#9BA9C4, 0.1);
  }
}

.layout {
  .v-card.body {
    padding-top: 40px !important;
  }
}

.editable-panel {
  padding-bottom: -20px;
}

.panel-container,
.editable-card {
  &.round {
    border-radius: 5px !important;
  }

  box-shadow: none !important;
  border-radius: 5px !important;

  div ::v-deep {
    .v-toolbar {
      height: 40px !important;
    }
  }

  &.showing-edit-icon {
    background-color: #fafafa !important;
  }

  &.readonly ::v-deep {
    .input-group--select .input-group__input {
      cursor: auto;
    }

    .input-group__details:before,
    .input-group__details:after,
    .input-group__input i,
    .input-group__counter,
    .dropdown-arrow {
      display: none;
    }

    .tel-input {
      .selection {
        cursor: default;
        .flag {
          margin-right: 0;
        }
      }

      .input-wrapper {
        &::before {
          background-color: transparent !important;
          border: none !important;
        }
        &::after {
          display: none;
        }

        // Hide flag icon if readonly state has no value
        &.no-value {
          .selection {
            display: none;
          }
        }

        label {
          transform: translateY(-18px) scale(.75);
          left: 0;
        }

        input {
          padding-left: 0;
        }
      }
    }
  }

  .with-label ::v-deep {
    .subheader {
      font-size: 16px;
      font-weight: bolder;
      height: 30px;;
      padding: 0;
    }

    .input-group--single-line,
    .tel-input {
      padding-top: 0;
    }
  }
}
</style>
