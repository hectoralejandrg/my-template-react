import Vue from 'vue'
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue'
import { VueEditor } from 'vue2-editor'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardCode from '@core/components/b-card-code'
import { heightFade } from '@core/directives/animations'
import Ripple from 'vue-ripple-directive'
import {
  BFormInvalidFeedback,
  BFormValidFeedback,
  BPagination,
  BInputGroupAppend,
  BFormCheckboxGroup,
  BFormCheckbox,
  BFormTags,
  BForm,
  BTabs,
  BBadge,
  BTab,
  BImg,
  BSpinner,
  BAlert,
  BInputGroup,
  BFormTextarea,
  BFormGroup,
  BFormInput,
  BFormRadioGroup,
  BFormRadio,
  BSkeleton,
  BSkeletonTable,
  BSkeletonImg,
  BCard,
  BCardBody,
  BButton,
  BCardTitle,
  BCardHeader,
  BTable,
  BTooltip,
  VBTooltip,
  BDropdown,
  BDropdownItem,
  BAvatar,
  BFormFile,
  BMediaBody,
  BCardText,
  BMediaAside,
  BMedia,
  BCol,
  BRow,
  BListGroup,
  BListGroupItem,
  BProgress,
  BFormTimepicker
} from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'

import FilterSwapper from '@/views/components/custom/filter-swapper/FilterSwapper.vue'
import ModularPermissions from '@/views/components/custom/modular-permissions/ModularPermissions.vue'
import ModalIFrame from '@/views/components/custom/modal-iframe/ModalIFrame.vue'
import AlertsGeneric from '@/views/components/custom/alerts-generic/AlertsGeneric.vue'
import AvatarLabel from '@/views/components/custom/avatar-label/AvatarLabel.vue'
import Timeline from '@/views/components/custom/timeline/Timeline.vue'
import MediaInfo from '@/views/components/custom/media-info/MediaInfo.vue'
import Pagination from '@/views/components/custom/pagination/Pagination.vue'
import TableRender from '@/views/components/custom/table-render/TableRender.vue'
import TableRenderActions from '@/views/components/custom/table-render/TableRenderActions.vue'
import FormRender from '@/views/components/custom/form-render/FormRender.vue'
import FieldInput from '@/views/components/custom/form-render/fields/FieldInput.vue'
import FieldTextarea from '@/views/components/custom/form-render/fields/FieldTextarea.vue'
import FieldDatepicker from '@/views/components/custom/form-render/fields/FieldDatepicker.vue'
import FieldSelect from '@/views/components/custom/form-render/fields/FieldSelect.vue'
import FieldCheckbox from '@/views/components/custom/form-render/fields/FieldCheckbox.vue'
import FieldTags from '@/views/components/custom/form-render/fields/FieldTags.vue'
import FieldAutocomplete from '@/views/components/custom/form-render/fields/FieldAutocomplete.vue'

Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component('b-card-code', BCardCode)
Vue.component('vue-editor', VueEditor)

Vue.component('b-list-group', BListGroup)
Vue.component('b-list-group-item', BListGroupItem)
Vue.component('b-dropdown', BDropdown)
Vue.component('b-dropdown-item', BDropdownItem)
Vue.component('b-pagination', BPagination)
Vue.component('b-tabs', BTabs)
Vue.component('b-tab', BTab)
Vue.component('b-form', BForm)
Vue.component('b-form-tags', BFormTags)
Vue.component('b-badge', BBadge)
Vue.component('b-avatar', BAvatar)
Vue.component('b-img', BImg)
Vue.component('b-alert', BAlert)
Vue.component('b-form-invalid-feedback', BFormInvalidFeedback)
Vue.component('b-form-valid-feedback', BFormValidFeedback)
Vue.component('b-form-checkbox-group', BFormCheckboxGroup)
Vue.component('b-form-checkbox', BFormCheckbox)
Vue.component('b-input-group', BInputGroup)
Vue.component('b-input-group-append', BInputGroupAppend)
Vue.component('b-form-input', BFormInput)
Vue.component('b-form-file', BFormFile)
Vue.component('b-form-radio-group', BFormRadioGroup)
Vue.component('b-form-radio', BFormRadio)
Vue.component('b-form-textarea', BFormTextarea)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-card', BCard)
Vue.component('b-card-body', BCardBody)
Vue.component('b-button', BButton)
Vue.component('b-tooltip', BTooltip)
Vue.component('b-skeleton', BSkeleton)
Vue.component('b-skeleton-table', BSkeletonTable)
Vue.component('b-skeleton-img', BSkeletonImg)
Vue.component('b-card-title', BCardTitle)
Vue.component('b-card-header', BCardHeader)
Vue.component('b-table', BTable)
Vue.component('b-media-body', BMediaBody)
Vue.component('b-card-text', BCardText)
Vue.component('b-media-aside', BMediaAside)
Vue.component('b-media', BMedia)
Vue.component('b-col', BCol)
Vue.component('b-row', BRow)
Vue.component('b-spinner', BSpinner)
Vue.component('b-progress', BProgress)
Vue.component('b-form-timepicker', BFormTimepicker)

Vue.directive('b-tooltip', VBTooltip)
Vue.directive('height-fade', heightFade)
Vue.directive('ripple', Ripple)

Vue.component(Timeline.name, Timeline)
Vue.component(Pagination.name, Pagination)
Vue.component(FilterSwapper.name, FilterSwapper)
Vue.component(TableRender.name, TableRender)
Vue.component(TableRenderActions.name, TableRenderActions)
Vue.component(ModalIFrame.name, ModalIFrame)
Vue.component(AlertsGeneric.name, AlertsGeneric)
Vue.component(AvatarLabel.name, AvatarLabel)
Vue.component(FormRender.name, FormRender)
Vue.component(FieldInput.name, FieldInput)
Vue.component(FieldTextarea.name, FieldTextarea)
Vue.component(FieldDatepicker.name, FieldDatepicker)
Vue.component(FieldSelect.name, FieldSelect)
Vue.component(FieldCheckbox.name, FieldCheckbox)
Vue.component(FieldTags.name, FieldTags)
Vue.component(FieldAutocomplete.name, FieldAutocomplete)
Vue.component(MediaInfo.name, MediaInfo)
Vue.component(ModularPermissions.name, ModularPermissions)


Vue.component('app-collapse', AppCollapse)
Vue.component('app-collapse-item', AppCollapseItem)
Vue.component('toastification-content', ToastificationContent)
