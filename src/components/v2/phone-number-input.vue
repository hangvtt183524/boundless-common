<template>
  <div class="base-text-input phone-number-input"
       :class="[{'base-text-input--invalid': isValidationStateVisible && !isValid}, {'base-text-input--required': isRequired}, {'base-text-input--has-pre-icon': preIcon}, {'phone-number-input--dropdown-open': isCountryDropdownOpen}]"
  >
    <label class="base-text-label" v-if="label">
      {{ label }}
    </label>

    <div class="base-text-input__input-container">
      <v-icon class="base-text-input__pre-icon">$vuetify.icons.phone</v-icon>

      <button class="phone-number-input__country-selection-trigger"
              @click.stop="toggleDropdown"
      >
        <div :class="activeCountry.vtelClass">
          <v-icon class="phone-number-input__country-selection-trigger__icon">
            {{ isCountryDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}
          </v-icon>
        </div>
      </button>

      <input
          :type="type"
          :value="value"
          @input="$emit('input', selectionValue.number)"
          @blur="onBlur"
          :placeholder="placeholderValue"
          :disabled="disabled"
          :formatter="format"
          v-on:keypress="isNumber()"
          v-model="phone"
      >

      <slot></slot>

      <perfect-scrollbar
          class="phone-number-input__country-selection-dropdown"
          :class="{open: isCountryDropdownOpen}"
          :options="scrollBarOptions"
          ref="dropdown"
          v-click-outside="clickedOutside"
      >
        <ul>
          <li class="phone-number-input__country-selection-dropdown__item"
              :class="optionHighlight(index, pb)"
              :key="pb['iso2']"
              @click.prevent="selectItem(index)"
              @mouseenter.self="pointerSet(index)"
              v-for="(pb, index) in allCountries"
          >
            <div :class="pb.vtelClass"></div>

            <strong>{{ pb.name }}</strong>
            <span class="dial-code">+{{ pb.dialCode }}</span>
          </li>
        </ul>
      </perfect-scrollbar>
    </div>

    <div class="base-text-input__error-container"
         v-if="errors && errors.length > 0 && touched"
    >
      <div class="base-text-input__error-container__error"
           v-for="(error, index) of errors"
           :key="index"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import BaseTextInput from "@/components/v2/base-text-input";

import { format, AsYouType, isValidNumber } from 'libphonenumber-js'
import phoneTemp from 'libphonenumber-js/examples.mobile.json'

const allCountries = [
  ['Afghanistan (???????????????????????????)', 'af', '93'],
  ['Albania (Shqip??ri)', 'al', '355'],
  ['Algeria (???????????????????????)', 'dz', '213'],
  ['American Samoa', 'as', '1684'],
  ['Andorra', 'ad', '376'],
  ['Angola', 'ao', '244'],
  ['Anguilla', 'ai', '1264'],
  ['Antigua and Barbuda', 'ag', '1268'],
  ['Argentina', 'ar', '54'],
  ['Armenia (????????????????)', 'am', '374'],
  ['Aruba', 'aw', '297'],
  ['Australia', 'au', '61', 0],
  ['Austria (??sterreich)', 'at', '43'],
  ['Azerbaijan (Az??rbaycan)', 'az', '994'],
  ['Bahamas', 'bs', '1242'],
  ['Bahrain (???????????????????????)', 'bh', '973'],
  ['Bangladesh (????????????????????????)', 'bd', '880'],
  ['Barbados', 'bb', '1246'],
  ['Belarus (????????????????)', 'by', '375'],
  ['Belgium (Belgi??)', 'be', '32'],
  ['Belize', 'bz', '501'],
  ['Benin (B??nin)', 'bj', '229'],
  ['Bermuda', 'bm', '1441'],
  ['Bhutan (???????????????)', 'bt', '975'],
  ['Bolivia', 'bo', '591'],
  ['Bosnia and Herzegovina (?????????? ?? ??????????????????????)', 'ba', '387'],
  ['Botswana', 'bw', '267'],
  ['Brazil (Brasil)', 'br', '55'],
  ['British Indian Ocean Territory', 'io', '246'],
  ['British Virgin Islands', 'vg', '1284'],
  ['Brunei', 'bn', '673'],
  ['Bulgaria (????????????????)', 'bg', '359'],
  ['Burkina Faso', 'bf', '226'],
  ['Burundi (Uburundi)', 'bi', '257'],
  ['Cambodia (?????????????????????)', 'kh', '855'],
  ['Cameroon (Cameroun)', 'cm', '237'],
  [
    'Canada',
    'ca',
    '1',
    1,
    [
      '204',
      '226',
      '236',
      '249',
      '250',
      '289',
      '306',
      '343',
      '365',
      '387',
      '403',
      '416',
      '418',
      '431',
      '437',
      '438',
      '450',
      '506',
      '514',
      '519',
      '548',
      '579',
      '581',
      '587',
      '604',
      '613',
      '639',
      '647',
      '672',
      '705',
      '709',
      '742',
      '778',
      '780',
      '782',
      '807',
      '819',
      '825',
      '867',
      '873',
      '902',
      '905'
    ]
  ],
  ['Cape Verde (Kabu Verdi)', 'cv', '238'],
  ['Caribbean Netherlands', 'bq', '599', 1],
  ['Cayman Islands', 'ky', '1345'],
  ['Central African Republic (R??publique centrafricaine)', 'cf', '236'],
  ['Chad (Tchad)', 'td', '235'],
  ['Chile', 'cl', '56'],
  ['China (??????)', 'cn', '86'],
  ['Christmas Island', 'cx', '61', 2],
  ['Cocos (Keeling) Islands', 'cc', '61', 1],
  ['Colombia', 'co', '57'],
  ['Comoros (????????? ????????????????)', 'km', '269'],
  ['Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)', 'cd', '243'],
  ['Congo (Republic) (Congo-Brazzaville)', 'cg', '242'],
  ['Cook Islands', 'ck', '682'],
  ['Costa Rica', 'cr', '506'],
  ['C??te d???Ivoire', 'ci', '225'],
  ['Croatia (Hrvatska)', 'hr', '385'],
  ['Cuba', 'cu', '53'],
  ['Cura??ao', 'cw', '599', 0],
  ['Cyprus (????????????)', 'cy', '357'],
  ['Czech Republic (??esk?? republika)', 'cz', '420'],
  ['Denmark (Danmark)', 'dk', '45'],
  ['Djibouti', 'dj', '253'],
  ['Dominica', 'dm', '1767'],
  [
    'Dominican Republic (Rep??blica Dominicana)',
    'do',
    '1',
    2,
    ['809', '829', '849']
  ],
  ['Ecuador', 'ec', '593'],
  ['Egypt (???????????????)', 'eg', '20'],
  ['El Salvador', 'sv', '503'],
  ['Equatorial Guinea (Guinea Ecuatorial)', 'gq', '240'],
  ['Eritrea', 'er', '291'],
  ['Estonia (Eesti)', 'ee', '372'],
  ['Ethiopia', 'et', '251'],
  ['Falkland Islands (Islas Malvinas)', 'fk', '500'],
  ['Faroe Islands (F??royar)', 'fo', '298'],
  ['Fiji', 'fj', '679'],
  ['Finland (Suomi)', 'fi', '358', 0],
  ['France', 'fr', '33'],
  ['French Guiana (Guyane fran??aise)', 'gf', '594'],
  ['French Polynesia (Polyn??sie fran??aise)', 'pf', '689'],
  ['Gabon', 'ga', '241'],
  ['Gambia', 'gm', '220'],
  ['Georgia (??????????????????????????????)', 'ge', '995'],
  ['Germany (Deutschland)', 'de', '49'],
  ['Ghana (Gaana)', 'gh', '233'],
  ['Gibraltar', 'gi', '350'],
  ['Greece (????????????)', 'gr', '30'],
  ['Greenland (Kalaallit Nunaat)', 'gl', '299'],
  ['Grenada', 'gd', '1473'],
  ['Guadeloupe', 'gp', '590', 0],
  ['Guam', 'gu', '1671'],
  ['Guatemala', 'gt', '502'],
  ['Guernsey', 'gg', '44', 1],
  ['Guinea (Guin??e)', 'gn', '224'],
  ['Guinea-Bissau (Guin?? Bissau)', 'gw', '245'],
  ['Guyana', 'gy', '592'],
  ['Haiti', 'ht', '509'],
  ['Honduras', 'hn', '504'],
  ['Hong Kong (??????)', 'hk', '852'],
  ['Hungary (Magyarorsz??g)', 'hu', '36'],
  ['Iceland (??sland)', 'is', '354'],
  ['India (????????????)', 'in', '91'],
  ['Indonesia', 'id', '62'],
  ['Iran (???????????????????)', 'ir', '98'],
  ['Iraq (?????????????????????)', 'iq', '964'],
  ['Ireland', 'ie', '353'],
  ['Isle of Man', 'im', '44', 2],
  ['Israel (???????????????????)', 'il', '972'],
  ['Italy (Italia)', 'it', '39', 0],
  ['Jamaica', 'jm', '1876'],
  ['Japan (??????)', 'jp', '81'],
  ['Jersey', 'je', '44', 3],
  ['Jordan (?????????????????????)', 'jo', '962'],
  ['Kazakhstan (??????????????????)', 'kz', '7', 1],
  ['Kenya', 'ke', '254'],
  ['Kiribati', 'ki', '686'],
  ['Kosovo', 'xk', '383'],
  ['Kuwait (?????????????????????)', 'kw', '965'],
  ['Kyrgyzstan (????????????????????)', 'kg', '996'],
  ['Laos (?????????)', 'la', '856'],
  ['Latvia (Latvija)', 'lv', '371'],
  ['Lebanon (???????????????????)', 'lb', '961'],
  ['Lesotho', 'ls', '266'],
  ['Liberia', 'lr', '231'],
  ['Libya (???????????????????)', 'ly', '218'],
  ['Liechtenstein', 'li', '423'],
  ['Lithuania (Lietuva)', 'lt', '370'],
  ['Luxembourg', 'lu', '352'],
  ['Macau (??????)', 'mo', '853'],
  ['Macedonia (FYROM) (????????????????????)', 'mk', '389'],
  ['Madagascar (Madagasikara)', 'mg', '261'],
  ['Malawi', 'mw', '265'],
  ['Malaysia', 'my', '60'],
  ['Maldives', 'mv', '960'],
  ['Mali', 'ml', '223'],
  ['Malta', 'mt', '356'],
  ['Marshall Islands', 'mh', '692'],
  ['Martinique', 'mq', '596'],
  ['Mauritania (???????????????????????????)', 'mr', '222'],
  ['Mauritius (Moris)', 'mu', '230'],
  ['Mayotte', 'yt', '262', 1],
  ['Mexico (M??xico)', 'mx', '52'],
  ['Micronesia', 'fm', '691'],
  ['Moldova (Republica Moldova)', 'md', '373'],
  ['Monaco', 'mc', '377'],
  ['Mongolia (????????????)', 'mn', '976'],
  ['Montenegro (Crna Gora)', 'me', '382'],
  ['Montserrat', 'ms', '1664'],
  ['Morocco (?????????????????????)', 'ma', '212', 0],
  ['Mozambique (Mo??ambique)', 'mz', '258'],
  ['Myanmar (Burma) (??????????????????)', 'mm', '95'],
  ['Namibia (Namibi??)', 'na', '264'],
  ['Nauru', 'nr', '674'],
  ['Nepal (???????????????)', 'np', '977'],
  ['Netherlands (Nederland)', 'nl', '31'],
  ['New Caledonia (Nouvelle-Cal??donie)', 'nc', '687'],
  ['New Zealand', 'nz', '64'],
  ['Nicaragua', 'ni', '505'],
  ['Niger (Nijar)', 'ne', '227'],
  ['Nigeria', 'ng', '234'],
  ['Niue', 'nu', '683'],
  ['Norfolk Island', 'nf', '672'],
  ['North Korea (?????? ???????????? ?????? ?????????)', 'kp', '850'],
  ['Northern Mariana Islands', 'mp', '1670'],
  ['Norway (Norge)', 'no', '47', 0],
  ['Oman (???????????????????)', 'om', '968'],
  ['Pakistan (???????????????????????)', 'pk', '92'],
  ['Palau', 'pw', '680'],
  ['Palestine (?????????????????????)', 'ps', '970'],
  ['Panama (Panam??)', 'pa', '507'],
  ['Papua New Guinea', 'pg', '675'],
  ['Paraguay', 'py', '595'],
  ['Peru (Per??)', 'pe', '51'],
  ['Philippines', 'ph', '63'],
  ['Poland (Polska)', 'pl', '48'],
  ['Portugal', 'pt', '351'],
  ['Puerto Rico', 'pr', '1', 3, ['787', '939']],
  ['Qatar (???????????????)', 'qa', '974'],
  ['R??union (La R??union)', 're', '262', 0],
  ['Romania (Rom??nia)', 'ro', '40'],
  ['Russia (????????????)', 'ru', '7', 0],
  ['Rwanda', 'rw', '250'],
  ['Saint Barth??lemy', 'bl', '590', 1],
  ['Saint Helena', 'sh', '290'],
  ['Saint Kitts and Nevis', 'kn', '1869'],
  ['Saint Lucia', 'lc', '1758'],
  ['Saint Martin (Saint-Martin (partie fran??aise))', 'mf', '590', 2],
  ['Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)', 'pm', '508'],
  ['Saint Vincent and the Grenadines', 'vc', '1784'],
  ['Samoa', 'ws', '685'],
  ['San Marino', 'sm', '378'],
  ['S??o Tom?? and Pr??ncipe (S??o Tom?? e Pr??ncipe)', 'st', '239'],
  ['Saudi Arabia (????????????????? ?????????????? ??????????????????????)', 'sa', '966'],
  ['Senegal (S??n??gal)', 'sn', '221'],
  ['Serbia (????????????)', 'rs', '381'],
  ['Seychelles', 'sc', '248'],
  ['Sierra Leone', 'sl', '232'],
  ['Singapore', 'sg', '65'],
  ['Sint Maarten', 'sx', '1721'],
  ['Slovakia (Slovensko)', 'sk', '421'],
  ['Slovenia (Slovenija)', 'si', '386'],
  ['Solomon Islands', 'sb', '677'],
  ['Somalia (Soomaaliya)', 'so', '252'],
  ['South Africa', 'za', '27'],
  ['South Korea (????????????)', 'kr', '82'],
  ['South Sudan (??????????? ????????????????????)', 'ss', '211'],
  ['Spain (Espa??a)', 'es', '34'],
  ['Sri Lanka (??????????????? ???????????????)', 'lk', '94'],
  ['Sudan (???????????????????????)', 'sd', '249'],
  ['Suriname', 'sr', '597'],
  ['Svalbard and Jan Mayen', 'sj', '47', 1],
  ['Swaziland', 'sz', '268'],
  ['Sweden (Sverige)', 'se', '46'],
  ['Switzerland (Schweiz)', 'ch', '41'],
  ['Syria (???????????????????)', 'sy', '963'],
  ['Taiwan (??????)', 'tw', '886'],
  ['Tajikistan', 'tj', '992'],
  ['Tanzania', 'tz', '255'],
  ['Thailand (?????????)', 'th', '66'],
  ['Timor-Leste', 'tl', '670'],
  ['Togo', 'tg', '228'],
  ['Tokelau', 'tk', '690'],
  ['Tonga', 'to', '676'],
  ['Trinidad and Tobago', 'tt', '1868'],
  ['Tunisia (?????????????????)', 'tn', '216'],
  ['Turkey (T??rkiye)', 'tr', '90'],
  ['Turkmenistan', 'tm', '993'],
  ['Turks and Caicos Islands', 'tc', '1649'],
  ['Tuvalu', 'tv', '688'],
  ['U.S. Virgin Islands', 'vi', '1340'],
  ['Uganda', 'ug', '256'],
  ['Ukraine (??????????????)', 'ua', '380'],
  ['United Arab Emirates (??????????????????? ?????????????? ????????????????????)', 'ae', '971'],
  ['United Kingdom', 'gb', '44', 0],
  ['United States', 'us', '1', 0],
  ['Uruguay', 'uy', '598'],
  ['Uzbekistan (O??zbekiston)', 'uz', '998'],
  ['Vanuatu', 'vu', '678'],
  ['Vatican City (Citt?? del Vaticano)', 'va', '39', 1],
  ['Venezuela', 've', '58'],
  ['Vietnam (Vi???t Nam)', 'vn', '84'],
  ['Wallis and Futuna (Wallis-et-Futuna)', 'wf', '681'],
  ['Western Sahara (????????????????? ????????????????????)', 'eh', '212', 1],
  ['Yemen (???????????????????)', 'ye', '967'],
  ['Zambia', 'zm', '260'],
  ['Zimbabwe', 'zw', '263'],
  ['??land Islands', 'ax', '358', 1]
]

export default {
  name: 'phone-number-input',
  extends: BaseTextInput,
  props: {
    itemHeight: {
      type: Number,
      default: 48
    },
    maxContainerHeight: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      phone: '',
      allCountries,
      activeCountry: [],
      isCountryDropdownOpen: false,
      pointer: 73,
      countryCode: 33,
      placeholderValue: this.placeholder,
      scrollBarOptions: {
        wheelPropagation: false
      }
    }
  },
  mounted () {
    this.setCountryCode()
    this.selectActiveCountry()
  },
  destroyed () {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  computed: {
    mode () {
      if (!this.phone) {
        return ''
      }
      if (this.phone[0] === '+') {
        return 'code'
      }
      if (this.phone[0] === '0') {
        return 'prefix'
      }
      return 'normal'
    },
    labelText () {
      if (!this.label) {
        return ''
      }
      let requiredText = (this.required) ? '*' : ''
      return this.label + requiredText
    },
    formattedInternationalResult () {
      if (!this.mode || !this.allCountries) {
        return ''
      }
      let phone = this.phone
      if (this.mode === 'code') {
        // If user manually type the country code
        const formatter = new AsYouType()// eslint-disable-line
        formatter.input(this.phone)
      } else if (this.mode === 'prefix') {
        // Remove the first '0' if this is a '0' prefix number
        // Ex: 0432421999
        phone = this.phone.slice(1)
      }

      return format(phone, this.activeCountry && this.activeCountry.iso2, 'International')
    },
    formattedResult () {
      // Calculate phone number based on mode
      if (!this.mode || !this.allCountries) {
        return ''
      }
      let phone = this.phone
      if (this.mode === 'code') {
        // If user manually type the country code
        const formatter = new AsYouType()// eslint-disable-line
        formatter.input(this.phone)
      } else if (this.mode === 'prefix') {
        // Remove the first '0' if this is a '0' prefix number
        // Ex: 0432421999
        phone = this.phone.slice(1)
      }
      return format(phone, this.activeCountry && this.activeCountry.iso2, 'National')
    },
    state () {
      return isValidNumber(this.formattedInternationalResult)
    },
    isValid: function () {
      if (this.validations) {
        if (this.validations.required && !this.value) {
          return false
        }

        if (this.value && this.validations.methods) {
          for (let i = 0; i < this.validations.methods.length; i++) {
            const methodData = this.validations.methods[i]
            if (!methodData.method(this.value)) {
              return false
            }
          }
        }
      }

      return this.value ? isValidNumber(this.formattedInternationalResult) : true
    },
    selectionValue () {
      let number = this.formattedInternationalResult && this.formattedInternationalResult.replace(/ /g, '')
      return {
        number,
        isValid: this.state,
        country: this.activeCountry.name
      }
    },
    pointerPosition () {
      return this.pointer * this.itemHeight
    },
    visibleElements () {
      return this.maxContainerHeight / this.itemHeight
    }
  },
  watch: {
    state (value) {
      if (value) {
        // If mode is 'prefix', keep the number as user typed,
        // Otherwise format it
        if (this.mode !== 'prefix') {
          this.phone = this.formattedResult
        }
      }
    },
    isCountryDropdownOpen (value) {
      if (value) {
        window.removeEventListener('keydown', this.onKeyDown)
        window.addEventListener('keydown', this.onKeyDown)
      } else {
        window.removeEventListener('keydown', this.onKeyDown)
      }
    },
    value (value) {
      this.phone = value
      if (value !== '') this.setCountryCode()
      this.selectActiveCountry()
      this.phone = this.formattedResult
    }
  },
  methods: {
    isNumber (evt) {
      if (!evt) {
        evt = window.event
      }
      const charCode = (evt.which) ? evt.which : evt.keyCode

      if (charCode < 48 || charCode > 57) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    pointerDown () {
      if (this.pointer < this.allCountries.length - 1) {
        this.pointer++
        if (this.$refs.dropdown.$el.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.itemHeight) {
          this.$refs.dropdown.$el.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.itemHeight
        }
      }
    },
    pointerUp () {
      if (this.pointer > 0) {
        this.pointer--
        if (this.$refs.dropdown.$el.scrollTop >= this.pointerPosition) {
          this.$refs.dropdown.$el.scrollTop = this.pointerPosition
        }
      }
    },
    pointerSet (index) {
      this.pointer = index
    },
    selectActiveCountry () {
      this.activeCountry = allCountries[this.pointer]
      this.placeholderValue = format(`+${this.activeCountry.dialCode}${phoneTemp[this.activeCountry.iso2]}`, this.activeCountry && this.activeCountry.iso2, 'National')
    },
    setCountryCode () {
      const that = this
      allCountries.forEach(function (d, i) {
        if (that.phone.includes('+' + d.dialCode)) {
          that.pointer = i
          that.countryCode = d.dialCode
          return true
        }
      })
    },
    selectItem (index) {
      if (this.countryCode === allCountries[index].dialCode) return

      this.pointer = index
      this.countryCode = allCountries[index].dialCode
      this.selectActiveCountry()

      this.$emit('input', this.selectionValue.number)
      // Emit the response, includes phone, validity and country
      this.$emit('blur')
      this.isCountryDropdownOpen = false
    },
    format (value) {
      return new AsYouType(this.activeCountry.iso2).input(value)// eslint-disable-line
    },
    onBlur () {
      this.touched = true
    },
    openDropdown () {
      this.isCountryDropdownOpen = true
      window.addEventListener('keydown', this.onKeyDown)
    },
    onKeyDown (e) {
      e.preventDefault()

      if (e.code === 'ArrowDown') {
        this.pointerDown()
      } else if (e.code === 'ArrowUp') {
        this.pointerUp()
      }

      if (e.code === 'Enter') {
        this.selectItem(this.pointer)
      }

      // Scroll to country item if an alphabet key is pressed
      if (this.isCharacterKey(e.keyCode)) {
        let countryIndex = this.allCountries.findIndex((item) => {
          return item.name.toLowerCase().indexOf(e.key) === 0
        })

        if (countryIndex >= 0) {
          this.pointer = countryIndex
          this.$refs.dropdown.$el.scrollTop = this.pointerPosition
        }
      }
    },
    isCharacterKey (charCode) {
      return ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8)
    },
    toggleDropdown () {
      if (!this.readonly) {
        this.isCountryDropdownOpen = !this.isCountryDropdownOpen
      }
    },
    closePhone () {
      this.isCountryDropdownOpen = false
    },
    clickedOutside () {
      this.isCountryDropdownOpen = false
    },
    optionHighlight (index, option) {
      return {
        'highlight': index === this.pointer,
        'active': option.iso2 === this.activeCountry.iso2
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.base-text-input {

  &__input-container {
    position: relative;
  }

  input {
    background: $white;
    border: 1px solid $gray-light;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 12px 13px;
    width: 100%;
    outline: 0;

    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: $text-medium;

    &::placeholder {
      color: rgba($text-medium, 0.5);
    }

    &:focus {
      border: 2px solid $blue-medium;
      padding: 11px 12px;
    }

    &:disabled {
      border-color: $gray-light;
      background-color: rgba(#C8CCD5, 0.15);
      cursor: not-allowed;
    }
  }

  &__pre-icon.v-icon {
    position: absolute;
    top: 50%;
    left: 13px;
    transform: translate(0,-50%);
    font-size: 16px;
    color: $blue-reserve;
  }

  .v-icon:not(.base-text-input__pre-icon) {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translate(0,-50%);
    opacity: .5;
    font-size: 18px;
  }

  label {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 41px;
    color: $text-medium;
    margin-right: 30px;
  }

  &__suggestions {
    position: fixed;
    background-color: $white;
    z-index: 999;

    border: 1px solid $blue-medium;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;

    &__scroll-holder {
      max-height: 240px;
    }

    &__suggestion {
      padding: 0 13px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 36px;
      color: $text-dark;
      cursor: pointer;

      &:hover {
        background: $gray-xlight;
        color: $blue-medium;
      }

      &:nth-child(2n + 1):not(:hover) {
        background-color: rgba($gray-xlight, 0.5);
      }
      &:nth-child(2n):not(:hover) {
        background-color: $white;
      }
    }
  }

  &--suggestions-visible:not(.base-text-input--suggestions-upwards) {
    input {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &--suggestions-visible.base-text-input--suggestions-upwards {
    input {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  &--suggestions-upwards {
    .base-text-input__suggestions {
      border-radius: 4px  4px 0 0;
    }
  }

  &__error-container {
    &__error {
      font-family: Fira Sans;
      font-style: italic;
      font-weight: 300;
      font-size: 12px;
      line-height: 28px;
      color: $text-medium;
    }
  }

  &--small {
    input {
      padding: 7px 13px;
      line-height: 16px;
      &:focus {
        padding: 6px 12px;
      }
    }

    label {
      line-height: 30px;
    }

    .base-text-input__suggestions {
      &__suggestion {
        line-height: 26px;
      }
    }
  }

  &--multiline {
    label {
      display: block;
    }
  }

  &--invalid {
    input {
      border-color: $danger;
    }
  }

  &--required {
    label:after {
      content: '*';
      color: $danger;
      margin-left: 5px;
      font-size: 12px;
    }
  }

  &--has-pre-icon {
    input {
      padding-left: 40px;

      &:focus {
        padding-left: 39px;
      }
    }
  }
}

.phone-number-input {

  &__country-selection-trigger {
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    left: 40px;
    outline: 0;

    .iti-flag {
      transform: scale(0.9);
      position: relative;
    }

    .phone-number-input__country-selection-trigger__icon.v-icon {
      position: absolute;
      right: -20px;
    }
  }

  input {
    padding-left: 80px;

    &:focus {
      padding-left: 80px;
    }
  }

  .base-text-input__input-container {
    position: relative;

    .phone-number-input__country-selection-dropdown {
      margin: 0;
      padding-left: 0;
      border: 1px solid $blue-medium;
      border-top-width: 0;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: $white;
      z-index: 999;
      text-align: left;
      list-style: none;
      position: absolute;
      left: 0;
      width: 100%;
      max-height: 200px;
      top: 40px;

      visibility: hidden;

      &.open {
        visibility: visible;
      }

      ul {
        display: flex;
        flex-direction: column;
        padding-left: 0;
      }

      &__item {
        width: 100%;
        padding: .45rem 16px;
        clear: both;
        font-weight: 400;
        color: $text-dark;
        text-align: inherit;
        white-space: nowrap;
        background-color: transparent;
        border: 0;
        display: flex;
        flex-direction: row;
        height: 48px;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        cursor: pointer;

        .iti-flag {
          transform: scale(0.9);
          margin-right: 8px;
        }

        &.active {
          color: $text-dark;
        }

        &.highlight {
          background-color: #f3f3f3;
        }

        img {
          width: 25px;
          margin-right: 25px;
        }

        .dial-code {
          margin-left: 5px;
          color: #9ba9c4;
        }
      }
    }
  }

  &--dropdown-open {
    input {
      border-color: $blue-medium;
    }
  }

}
</style>