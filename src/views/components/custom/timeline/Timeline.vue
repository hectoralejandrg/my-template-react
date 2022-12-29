<template>
  <div :style="{
      '--tracking_color': styleColor, 
      '--tracking_color_b': styleColor ? hexToRgba(styleColor, 0.5): ''
      }">
    <div class="container d-none d-md-block">
        <div class="row chronology">
            <div v-for="(stage, index) in timeline" :key="index" class="chronology-step horizontal-center"
            :class="[
              {'active': stage.active, 'disabled': !stage.active}, 
              (!styleColor ? color || stage.color || 'light' : 'personalized'),
              type
              ]" :style="[{'flex-direction': 'column', 'width': `${100 / timeline.length}%` }]"
              v-b-tooltip.hover.bottom="stage.tooltip">
              <div class="chronology-progress"><div class="progress-bar"></div></div>
              <div class="chronology-dot" ></div>
              <div class="chronology-stepname text-center v-step-5-1" :style="{ 'color': stage.colorTitle }">{{stage.title}}</div>
              <div v-if="stage.subtitle" class="chronology-info text-center" :style="{ 'color': stage.colorSubtitle }">{{stage.subtitle}}</div>
              <div v-if="stage.date" class="chronology-info text-center" :style="{ 'color': stage.colorTitle }"><small>{{stage.date}}</small></div>
              <div class="chronology-icon v-step-4-1" v-if="verifyTypeTimeline(stage, index)">
                <feather-icon :icon="icon && !stage.icon ? (stage.active ? icon : 'void') : stage.icon" :class="stage.iconClass" size="2x"/>
              </div>
            </div>
        </div>
    </div>
    <app-timeline class="d-md-none">
      <app-timeline-item
        v-for="(stage, index) in timeline" :key="`vertical_${index}`"
        :class="[
          {'active': stage.active, 'disabled': !stage.active},
          type,
          { 'active-line': timeline[index + 1] && timeline[index + 1].active}
        ]"
        v-b-tooltip.hover="stage.tooltip"
        :title="stage.title"
        :subtitle="stage.subtitle"
        :time="stage.date"
        :colors="stage"
        :iconClass="stage.iconClass"
        :variant="!styleColor ? color || stage.color || 'light' : 'personalized'"
        :icon="verifyTypeTimeline(stage, index) ? (icon && !stage.icon ? (stage.active ? icon : 'void') : stage.icon) : 'void'"
      />
  </app-timeline>
  </div>
</template>
<script>
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
export default {
  name: 'timeline',
  props: ['timeline', 'icon', 'type', 'styles', 'color', 'styleColor'],
  components: {AppTimeline, AppTimelineItem},
  methods: {
    verifyTypeTimeline (stage, index) {
      if (this.type === 'lineal') {
        if (
          stage.active && (
          // Si es el ultimo
            (index === this.timeline.length - 1) || 
            // O si no es el último, está activo y el siguiente está no activo
            (index !== this.timeline.length - 1 && this.timeline[index + 1] && !this.timeline[index + 1]?.active)
          )
        ) {
          return true
        }
        return false
      }
      return true
    },
    hexToRgba(hex, opacity = 1) {
      if (!hex) return null
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
    }
  }
}
</script>
<style lang="scss">

.timeline-item.disabled{
  .timeline-item-icon{
    border: 1px solid #c2c2c2 !important;
    svg{
      color: #c2c2c2;
    }
  }
}
.timeline-variant-personalized{
  &.active {
    &.lineal.active-line{
      border-left: 1px solid var(--tracking_color);
    }
    .timeline-item-icon {
      border: 1px solid var(--tracking_color);
        svg{
          color: var(--tracking_color);
        }
    }
  }
}
  
.chronology {
  margin-top: 3rem;
  
  > .chronology-step.lineal.active {
    > .chronology-progress > .progress-bar {
      background: var(--light-5);
    }
  }
  
  > .chronology-step {
    padding: 0;
    position: relative;
    &.active{
      > .chronology-progress > .progress-bar {
        width: 100%;
        height: 2px;
        left: -50%;
        position: absolute;
      }
    }
    &.disabled{
      > .chronology-stepname, > .chronology-info, > .chronology-icon{
        color: #c2c2c2;
      }
    }
    > .chronology-icon{
      width: 100%;
      float: left;
      text-align: center;
      height: 1px;
      position: absolute;
      top: -25px;
    }
    > .chronology-stepname {
      color: #676a6c;
      font-size: 16px;
      margin-bottom: 5px;
    }
    > .chronology-info {
      color: #999;
      font-size: 14px;
    }
    > .chronology-dot {
      position: absolute;
      width: 20px;
      height: 20px;
      display: block;
      left: 50%;
      margin-top: 7px;
      margin-left: -10px;
      border-radius: 50%;
      &:after {
        content: ' ';
        width: 10px;
        height: 10px;
        border-radius: 50px;
        position: absolute;
        top: 5px;
        left: 5px;
      }
    }
    > .chronology-progress {
      position: relative;
      border-radius: 0px;
      height: 2px;
      box-shadow: none;
      margin: 16px 0;
      background-color: #D1DADE;
      > .progress-bar {
        width:0px;
        box-shadow: none;
        background: none;
      }
    }
  }
}
.chronology > .chronology-step.complete > .chronology-progress > .progress-bar {
  width:100%;
}
.chronology > .chronology-step:first-child.active > .chronology-progress > .progress-bar {
  width:0%;
}
.chronology > .chronology-step:last-child.active > .chronology-progress > .progress-bar {
  width: 100%;
}
.chronology > .chronology-step.disabled > .chronology-dot {
  background-color: #D1DADE;
}
.chronology > .chronology-step.disabled > .chronology-dot:after {
  opacity: 0;
}
.chronology > .chronology-step:first-child  > .chronology-progress {
  left: 50%;
  width: 50%;
}
.chronology > .chronology-step:not(.active):last-child  > .chronology-progress {
  width: 50%;
}
.chronology > .chronology-step.active:last-child  > .chronology-progress {
  background-color: transparent !important;
}
.chronology > .chronology-step.disabled a.chronology-dot{pointer-events: none;
}

  .chronology {
    > .chronology-step.personalized.lineal.active {
      > .chronology-progress > .progress-bar {
        background: var(--tracking_color);
      }
    }
    > .chronology-step.personalized.active {
      > .chronology-dot {
        background: var(--tracking_color_b);
        &:after {
          background: var(--tracking_color);
        }
      }
      > .chronology-icon {
        color: var(--tracking_color); 
      }
    }
  } 
  

</style>