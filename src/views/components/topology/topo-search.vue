/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div class="rk-topo-search flex-h">
      <div class="flex-h">
        <!--<TraceSelect :hasSearch="true" :title="this.$t('serviceFilter')" :value="service" @input="chooseService" :data="rocketTopo.services"/>-->
        <!--<RkBsSelect :data="{bsList: rocketbotGlobal.tenantBs}"/>-->
        <!--<div class="mr-15">-->
          <!--<span class="sm b grey mr-10">{{this.$t('serviceFilter')}}:</span>-->
          <!--<select :value="service" class="app" style="background: 0; border: 0; outline: none;color: #efefef;"  @change="chooseService($event)">-->
            <!--<option  style="background-color: #25292f;" :value="{ key: 'default',label: 'default' }">所有</option>-->
            <!--<option style="background-color: #25292f;" v-for="i in rocketTopo.services" :key="i.key" :value="i" >{{i.label}}</option>-->
          <!--</select>-->
        <!--</div>-->
        <!--<ServiceSelect :hasSearch="true" :title="this.$t('serviceFilter')" :value="isShowCiTopo?ciServcies:service" @input="chooseService" :data="rocketTopo.services"/>-->
        <div class="mr-15">
          <span class="sm b grey mr-10">{{this.$t('callThreshold')}}:</span>
          <input type="text" v-model="rocketTopo.colorThreshold" class="rk-trace-search-input dib">
        </div>
        <div>
          <span class="sm b grey mr-5">{{this.$t('timeRange')}}:</span>
          <RkDate class="sm" v-model="time" position="bottom" format="YYYY-MM-DD HH:mm:ss"/>
        </div>
      </div>
      <div class="flex-h" style="padding-left:50px;">
        <a class="rk-btn mr-5 sm" :class="auto?'blue':'ghost'" @click="handleAuto">
          <span class="vm">{{this.$t('auto')}}</span>
        </a>
        <a class="rk-btn mr-15 sm ghost" @click="handleReload">
          <svg class="icon mr-5 vm" :class="{'loading': auto}">
              <use xlink:href="#retry"></use>
          </svg>
          <span class="vm">{{this.$t('reload')}}</span>
        </a>
      </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop} from 'vue-property-decorator';
import { Action, Mutation, Getter, State } from 'vuex-class';
import { Trace, DurationTime, Option } from '../../../store/interfaces';
import ServiceSelect from '../../../components/rk-service-select.vue';
import timeFormat from '@/utils/timeFormat';

@Component({components: {ServiceSelect}})
export default class TopoSearch extends Vue {
  @State('rocketbot') private rocketbotGlobal: any;
  @State('rocketTopo') private rocketTopo: any;
  @Prop() private ciServcies: any;
  @Prop() private selectedBsArray: any;
  @Getter('durationTime') private durationTime: any;
  @Action('SET_DURATION') private SET_DURATION: any;
  @Mutation('SET_SELECTED_CI_ID') private SET_SELECTED_CI_ID: any;
  @Mutation('SET_SELECTED_CI_CODE') private SET_SELECTED_CI_CODE: any;
  @Mutation('SET_SELECTED_TS') private SET_SELECTED_TS: any;
  @Action('GET_CI_SERVICE_INFO') private GET_CI_SERVICE_INFO: any;
  @Action('rocketTopo/GET_SERVICES') private GET_SERVICES: any;
  @Action('rocketTopo/GET_SERVICE_TOPO') private GET_SERVICE_TOPO: any;
  @Action('rocketTopo/GET_SERVICES_TOPO_INFO') private GET_SERVICES_TOPO_INFO: any;
  @Action('rocketTopo/GET_WRAPPED_BS_TOPO') private GET_WRAPPED_BS_TOPO: any;
  @Action('rocketTopo/GET_WRAPPED_TS_TOPO') private GET_WRAPPED_TS_TOPO: any;
  @Action('rocketTopo/GET_WRAPPED_NODE_TOPO') private GET_WRAPPED_NODE_TOPO: any;
  @Action('rocketTopo/GET_TOPO') private GET_TOPO: any;
  @Action('rocketTopo/GET_CI_TOPO_INFO') private GET_CI_TOPO_INFO: any;
  @Mutation('rocketTopo/SET_CURRENT_TOPO_LEVEL') private SET_CURRENT_TOPO_LEVEL: any;
  @Mutation('rocketTopo/SET_CAN_ROLL_UP') private SET_CAN_ROLL_UP: any;
  @Mutation('rocketTopo/SET_CAN_DRILL_DOWN') private SET_CAN_DRILL_DOWN: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_BS') private SET_TOPO_CURRENT_BS: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_TS') private SET_TOPO_CURRENT_TS: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_SERVICE') private SET_TOPO_CURRENT_SERVICE: any;
  @Getter('selectedBs') private selectedBs: any;

 /* private time: Date[] = [this.durationTime.start , this.durationTime.end];*/
  private time: Date[] = [new Date(new Date().getTime() - 900000) , new Date()];
  // private service: Option  = {label: '所有', key: ''};
  private auto: boolean = false;
  private timer: any = null;
  private isShowCiTopo = false;
  @Watch('selectedBsArray')
  private onSelectedBsChange() {
    let bsDisplayName = '';
    for (const i in this.selectedBsArray) {
      bsDisplayName = bsDisplayName + ',' + this.selectedBsArray[i].label;
    }
    this.SET_TOPO_CURRENT_BS({key: this.rocketbotGlobal.selectedBs, label: bsDisplayName.substring(1)});
  }
  @Watch('time')
  private onTimeUpdate() {
    this.SET_DURATION(timeFormat(this.time));
    // if (this.service.key !== '') {
    //   this.SET_CURRENT_TOPO_LEVEL('topo');
    //   this.SET_CAN_DRILL_DOWN(false);
    //   this.SET_CAN_ROLL_UP(true);
    //   this.GET_SERVICE_TOPO({duration: this.durationTime, serviceId: this.service.key});
    //   return;
    // }
    if (this.rocketTopo.topoShowLevel === '') {
      if (this.rocketbotGlobal.selectedCiId !== '' || this.rocketbotGlobal.selectedCiCode !== '') {
        this.isShowCiTopo = true;
        this.SET_CURRENT_TOPO_LEVEL('topo');
        this.SET_CAN_DRILL_DOWN(false);
        this.SET_CAN_ROLL_UP(true);
        this.GET_CI_TOPO_INFO({
          ciId: this.rocketbotGlobal.selectedCiId,
          ciCode: this.rocketbotGlobal.selectedCiCode, duration: this.durationTime
        });
        return;
      }
      if (this.rocketbotGlobal.selectedTsId !== '') {
        if (this.rocketbotGlobal.selectedTsId.indexOf(',') !== -1) {
          this.SET_CURRENT_TOPO_LEVEL('wrappedTs');
          this.SET_CAN_DRILL_DOWN(true);
          this.SET_CAN_ROLL_UP(true);
          this.GET_WRAPPED_TS_TOPO({
            tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
            tsIds: this.rocketbotGlobal.selectedTsId, duration: this.durationTime
          });
          return;
        }
        this.isShowCiTopo = true;
        this.SET_CURRENT_TOPO_LEVEL('topo');
        this.SET_CAN_DRILL_DOWN(false);
        this.SET_CAN_ROLL_UP(true);
        this.SET_TOPO_CURRENT_TS({label: this.rocketbotGlobal.selectedTsId, key: this.rocketbotGlobal.selectedTsId});
        this.GET_WRAPPED_NODE_TOPO({
          tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
          tsIds: this.rocketbotGlobal.selectedTsId, duration: this.durationTime
        });
        return;
      }
      if (this.rocketbotGlobal.selectedBs !== '') {
        // this.SET_TOPO_CURRENT_BS({key: this.rocketbotGlobal.selectedBs, label: this.getBsName(this.rocketbotGlobal.selectedBs)});
        if (this.rocketbotGlobal.selectedBs.indexOf(',') !== -1) {
          this.SET_CURRENT_TOPO_LEVEL('wrappedBs');
          this.SET_CAN_DRILL_DOWN(true);
          this.SET_CAN_ROLL_UP(false);
          this.GET_WRAPPED_BS_TOPO({
            tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
            duration: this.durationTime
          });
          return;
        } else {
          this.SET_CURRENT_TOPO_LEVEL('wrappedTs');
          this.SET_CAN_DRILL_DOWN(true);
          this.SET_CAN_ROLL_UP(true);
          this.GET_WRAPPED_TS_TOPO({
            tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
            duration: this.durationTime
          });
          return;
        }
      }
      this.SET_CURRENT_TOPO_LEVEL('wrappedBs');
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(false);
      this.GET_WRAPPED_BS_TOPO({
        tenantId: this.rocketbotGlobal.currentTenant, bsIds: '',
        duration: this.durationTime
      });
    } else if (this.rocketTopo.topoShowLevel === 'wrappedBs') {
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(false);
      this.GET_WRAPPED_BS_TOPO({
        tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
        duration: this.durationTime
      });
      return;
    } else if (this.rocketTopo.topoShowLevel === 'wrappedTs') {
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(true);
      this.GET_WRAPPED_TS_TOPO({
        tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
        duration: this.durationTime
      });
      return;
    } else if (this.rocketTopo.topoShowLevel === 'wrappedNode') {
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(true);
      this.GET_WRAPPED_NODE_TOPO({
        tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
        tsIds: this.rocketTopo.currentTopoTs.key, duration: this.durationTime
      });
      return;
    } else {
      if (this.rocketTopo.currentTopoService.key === '') {
        this.SET_CURRENT_TOPO_LEVEL('topo');
        this.SET_CAN_DRILL_DOWN(false);
        this.SET_CAN_ROLL_UP(true);
        this.GET_TOPO({
          tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
          tsIds: this.rocketTopo.currentTopoTs.key, duration: this.durationTime
        });
      } else {
        this.SET_CURRENT_TOPO_LEVEL('topo');
        this.SET_CAN_DRILL_DOWN(false);
        this.SET_CAN_ROLL_UP(true);
        let serviceIds: any[] = [];
        const idArray = this.rocketTopo.currentTopoService.key.split(',');
        for(const i in idArray) {
          if (idArray[i] !== '') {
            serviceIds.push(idArray[i]);
          }
        }
        this.GET_SERVICES_TOPO_INFO({
          serviceIds, duration: this.durationTime
        });
      }
    }

  }
  private handleReload() {
    const gap = this.rocketbotGlobal.duration.end.getTime() - this.rocketbotGlobal.duration.start.getTime();
    const w = window as any;
    const utc = w.localStorage.getItem('utc');
    const utcCopy: any = -(new Date().getTimezoneOffset() / 60);
    this.time = [
        new Date(new Date().getTime() - gap + (utc - utcCopy) * 3600000),
        new Date(new Date().getTime() + (utc - utcCopy) * 3600000),
    ];
  }
  private handleAuto() {
    this.auto = !this.auto;
    if (this.auto) {
      this.handleReload();
      this.timer = setInterval(this.handleReload, 6000);
    } else {
      clearInterval(this.timer);
    }
  }
  // private chooseService(i: any) {
  //   // this.service = { label: i.target.options[i.target.selectedIndex]._value.displayName,
  //   //     key: i.target.options[i.target.selectedIndex]._value.key};
  //   if (this.service.key === i.key) {
  //     return;
  //   }
  //   this.isShowCiTopo = false;
  //   this.SET_SELECTED_CI_CODE('');
  //   this.SET_SELECTED_CI_ID('');
  //   this.SET_SELECTED_TS('');
  //   this.service = i;
  //   this.SET_CURRENT_TOPO_LEVEL('topo');
  //   this.SET_CAN_DRILL_DOWN(false);
  //   this.SET_CAN_ROLL_UP(true);
  //   if (this.service.key === '') {
  //     this.GET_TOPO({tenantId: this.rocketbotGlobal.currentTenant,
  //       tsIds: this.rocketbotGlobal.selectedTsId, bsIds: this.rocketbotGlobal.selectedBs, duration: this.durationTime});
  //     return;
  //   }
  //   this.GET_SERVICE_TOPO({duration: this.durationTime, serviceId: this.service.key});
  // }
  private mounted() {
    this.time = [this.rocketbotGlobal.duration.start, this.rocketbotGlobal.duration.end];
  }
}
</script>

<style lang="scss">
.rk-topo-search {
  flex-shrink: 0;
  background-color: #333840;
  color: #eee;
  width: 100%;
  padding: 3px 15px 8px;
  height: 35px;
}

.rk-topo-search-input {
  border-style: unset;
  outline: 0;
  padding: 2px 5px;
  border-radius: 3px;
}
.rk-topo-search-range{
  border-radius: 3px;
  background-color: #fff;
  padding: 1px;
  border-radius: 3px;
  input{
    width: 38px;
    border-style: unset;
    outline: 0;
  }
}
.rk-topo-search-btn{
  padding: 3px 9px;
  background-color: #484b55;
  border-radius: 4px;
  margin-top: 12px;
  &.bg-blue{
    background-color: #448dfe;
  }
}
.rk-topo-search-more{
  background-color: #484b55;
  padding: 4px 10px;
  border-radius: 3px;
  margin-top: 8px;
  position: relative;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
  &:after {
    bottom: 100%;
    right: 30px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(0, 0,0, 0);
    border-bottom-color: #484b55;
    border-width: 8px;
    margin-right: 0px;
  }
}
</style>
