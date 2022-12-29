<template>
  <div :id="id">
    <div class="picker-color vertical-center">
      <div class="box-color" :class="{'active': colorPicking}"><div class="color" @click="colorPicking = true" :style="{ 'background-color': color }"></div></div>
      <field-input class="hexa" :blur="blur" :value.sync="myColorText"></field-input>
      <!--div class="text pl-1" @click="colorPicking = true">{{color}}</div-->
      <div class="picker" v-show="colorPicking">
        <picker v-model="myColor"></picker>
        <b-button class="push-right mt-03 pt-03 pb-03" size="sm" @click="colorPicking = false">Cerrar</b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Sketch } from 'vue-color'
export default {
  props: ['color', 'id'],
  components: { 'picker': Sketch },
  data () {
    return {
      myColor: 'black',
      myColorText: 'black',
      colorPicking: false
    }
  },
  watch: {
    color () {
      this.myColor = { hex: this.color || '#FFFFFF' }
    },
    myColor () {
      this.myColorText = this.myColor.hex
      this.$emit('update:color', this.myColorText)
    }, 
    myColorText () {
      if (/^#[0-9A-F]{6}$/i.test(this.myColorText)) this.myColor = { hex: this.myColorText }
    }
  },
  mounted () {
    const id = this.id
    this.myColor = { hex: this.color || '#FFFFFF' }
    window.addEventListener('click', (e) => {
      if (!document.getElementById(id) || !document.getElementById(id).contains(e.target)) {
        this.colorPicking = false
      }
    })
  },
  methods: {
    blur (name, value) {
      if (/^#[0-9A-F]{6}$/i.test(this.myColorText)) this.myColor = { hex: this.myColorText }
      else this.myColorText = this.myColor.hex
    }
  }
}
</script>
<style lang="scss">
  .picker-color{
    display: flex;
    flex-direction: rows;
    cursor: pointer;
    .picker{
      position: absolute;
      z-index: 10;
      top: 100%;
    }
    .box-color{
      min-width: 15px;
      width: 60px;
      height: 37.98px;
      padding: 3px;
      border: 1px solid #d8d6de;
      border-radius: 0.357rem;
      transition: border 0.2s ease;
      // border-right: 0px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      &.active {
        border: 1px solid #044389;
      }
      >.color{
        width: 100%;
        height: 100%;
        border-radius: 3px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      }
    }
    .hexa {
      width: -webkit-fill-available;
      .form-group .form-control{
        left: -2px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        padding: 0.2rem .5rem !important;
      }
    }
  }
</style>