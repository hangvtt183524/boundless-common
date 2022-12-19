<template>
  <div>
    <div class="title">
      <v-layout row>
        <v-flex xs12 class="py-3">
          <slot name="title">
            <h3 class="small-heading">{{ title }}</h3>
          </slot>
        </v-flex>
      </v-layout>
    </div>

    <v-layout row wrap :class="{ disabled: disabled, readonly: disabled }">
      <v-card class="body panel-container" :class="{ readonly: readonly }">
        <v-card-text class="pt-0 pb-4 px-4">
          <slot></slot>
        </v-card-text>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
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