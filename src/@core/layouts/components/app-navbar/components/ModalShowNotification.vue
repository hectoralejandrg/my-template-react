<template>
  <div class="rule-dialog">
    <b-modal id="modalShowNotification" :ok-title="acceptText" size="lg" ok-variant="warning" modal-class="no-header modal-notification"
      ok-only no-close-on-esc no-close-on-backdrop centered no-footer>
      <div v-for="notification in notifications" :key="notification.id">
        <div v-if="notification.index === myIndex" :key="notification.index" :class="[`content-notification-${notification.index}`, notification.index !== myIndex ? 'hidden' : '']">
          <div v-html="notification.content"></div>
        </div>

      </div>
      <template #modal-footer="">
        <div class="w-full">
          <div class="col-xs-12">
            <b-button v-if="myIndex !== 0" class="push-left" variant="outline-success" @click="_ => toIndex(-1)"><feather-icon icon="ArrowLeftIcon"/> {{$t('Anterior')}}</b-button>
            <b-button class="push-right ml-2" variant="outline-danger" @click="close">{{$t('Cerrar')}}</b-button>
            <b-button v-if="myIndex !== notifications.length - 1" class="push-right" variant="outline-success" @click="_ => toIndex(1)">{{$t('Siguiente')}} <feather-icon icon="ArrowRightIcon"/></b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: 'modal-show-notification',
  props: ['notifications', 'indexNotification'],
  data () {
    return {
      acceptText: 'Cerrar',
      myIndex: 0,
      notificationsRead: [],
      refUser: null
    }
  },
  watch: {
    indexNotification () {
      this.myIndex = this.indexNotification
    },
    myIndex () {
      this.$emit('update:indexNotification', this.myIndex)
    }
  },
  mounted () {
    this.myIndex = this.indexNotification
  },
  methods: {
    close () {
      this.$bvModal.hide('modalShowNotification')
    },
    toIndex (sum) {
      this.myIndex = this.myIndex + sum
    }
  }
}
</script>


<style lang="scss">
.modal-notification.modal > .modal-dialog > .modal-content > .modal-body {
  & img {
    max-width: 100%;
  }
  & p {
    margin-bottom: 0 !important;
  }
}
.label-bold {
  font-size: 12px;
}
.contenedor-searchable {
  .is-criteria {
    margin-top: 5px;
    margin-left: 5px;
    font-size: 10px;
    font-weight: 600;
  }
  .vs-checkbox {
    width: 12px;
    height: 12px;
  }
}
</style>
<style scoped lang="scss">
div[class^="content-notification"] {
}
.tip {
  /*border-left: 4px solid #3ebc6d;*/
  background: #cfcbf9;
  color: #5247c7;
  padding:3px 5px;
  width:380px;
  text-align: center;
  margin:auto;
  margin-top: 20px;
}
.rule-dialog {
  .vs-dialog {
    height: 1900px;
  }
}
kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
  line-height: 10px;
  color: #1708ad;
  vertical-align: middle;
  background-color: #d2cef9;
  border: 1px solid #594ee9;
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 #d1d5da;
}
/*.vs-dialog-cancel-button {*/
/*  display: none !important;*/
/*}*/
.boton {
  margin:auto;
  margin-top: 20px;
}
.btn-remove {
  cursor: pointer;
  background: #ccc !important;
  &:hover {
    background: #ea5455 !important;
  }
}
</style>