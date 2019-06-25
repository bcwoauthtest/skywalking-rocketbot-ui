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
  <div class="link-topo-tool flex-h">
   <div class="flex-h" :class="(rocketTopo.topoShowLevel === 'wrappedBs' && rocketTopo.currentTopoBs.label === 'All')? 'link-topo-tool-box': 'link-topo-tool-btn-box'">
    <span class="tc sm b" @click="getBsWrappedTopo">租户[&nbsp;{{rocketbotGlobal.currentTenantName}}&nbsp;]</span>
    <div class="topo-tool-icon-box">
     <svg class="topo-tool-icon cp lg">
      <use xlink:href="#angle-right"></use>
     </svg>
    </div>
   </div>
   <div class="flex-h" :class="(rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs')? 'link-topo-tool-btn-box': 'link-topo-tool-box'">
    <!--<span class="tc sm b" @click="getTsWrappedTopo" v-if="rocketTopo.currentTopoBs.label === '所有业务服务'">{{rocketTopo.currentTopoBs.label}}</span>-->
    <span class="tc sm b" @click="getTsWrappedTopo">业务服务[&nbsp;{{rocketTopo.currentTopoBs.label}}&nbsp;]</span>
    <div class="topo-tool-icon-box" v-if="rocketTopo.topoShowLevel !== '' && rocketTopo.topoShowLevel !== 'wrappedBs'">
     <svg class="topo-tool-icon cp lg">
      <use xlink:href="#angle-right"></use>
     </svg>
    </div>
   </div>
   <!--<div class="flex-h" :class="(rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs' && rocketTopo.topoShowLevel !== 'wrappedNode')? 'link-topo-tool-btn-box': 'link-topo-tool-box'"v-if="rocketTopo.topoShowLevel !== '' && rocketTopo.topoShowLevel !== 'wrappedBs'">-->
    <!--<span class="tc sm b" @click="getNodeWrappedTopo">技术服务[&nbsp;{{rocketTopo.currentTopoTs.label}}&nbsp;]</span>-->
   <div class="flex-h" :class="(rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs' && rocketTopo.currentTopoService.key !== '')? 'link-topo-tool-btn-box': 'link-topo-tool-box'"v-if="rocketTopo.topoShowLevel !== '' && rocketTopo.topoShowLevel !== 'wrappedBs'">
    <span class="tc sm b" @click="getTopo">技术服务[&nbsp;{{rocketTopo.currentTopoTs.label}}&nbsp;]</span>
    <div class="topo-tool-icon-box" v-if="rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs'">
     <svg class="topo-tool-icon cp lg">
      <use xlink:href="#angle-right"></use>
     </svg>
    </div>
   </div>
   <!--<div class="flex-h" :class="(rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs' && rocketTopo.topoShowLevel !== 'wrappedNode' && rocketTopo.currentTopoService.key !== '')? 'link-topo-tool-btn-box': 'link-topo-tool-box'"v-if="rocketTopo.topoShowLevel !== '' && rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs'">-->
      <!--<span class="tc sm b" @click="getTopo">节点[&nbsp;{{rocketTopo.currentTopoNode.label}}&nbsp;]</span>-->
      <!--<div class="topo-tool-icon-box" v-if="rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs' && rocketTopo.topoShowLevel !== 'wrappedNode'">-->
          <!--<svg class="topo-tool-icon cp lg">-->
              <!--<use xlink:href="#angle-right"></use>-->
          <!--</svg>-->
      <!--</div>-->
   <!--</div>-->
   <div class="link-topo-tool-box flex-h" v-if="rocketTopo.topoShowLevel !== 'wrappedBs' && rocketTopo.topoShowLevel !== 'wrappedTs' && rocketTopo.topoShowLevel !== 'wrappedNode'">
    <span class="tc sm b">应用[&nbsp;{{rocketTopo.currentTopoService.label}}&nbsp;]</span>
   </div>
   <!--<div class="link-topo-tool-btn-box flex-h" v-if="rocketTopo.canRollUp" @click="rollUpTopo">-->
    <!--<span class="tc sm cp b">全局上卷</span>-->
    <!--<div class="topo-tool-icon-box">-->
     <!--<svg class="topo-tool-icon cp lg">-->
      <!--<use xlink:href="#roll-up"></use>-->
     <!--</svg>-->
    <!--</div>-->
   <!--</div>-->
   <!--<div class="link-topo-tool-btn-box flex-h" v-if="rocketTopo.canDrillDown" @click="drillDownTopo">-->
    <!--<span class="tc sm cp b">全局下钻</span>-->
    <!--<div class="topo-tool-icon-box">-->
      <!--<svg class="topo-tool-icon cp lg">-->
        <!--<use xlink:href="#drill-down"></use>-->
      <!--</svg>-->
    <!--</div>-->
   <!--</div>-->
  </div>
</template>
<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import { State, Mutation, Getter, Action } from 'vuex-class';
@Component
export default class TopoTool extends Vue {
  @State('rocketbot') private rocketbotGlobal: any;
  @State('rocketTopo') private rocketTopo: any;
  @Getter('durationTime') private durationTime: any;
  @Mutation('rocketTopo/SET_CURRENT_TOPO_LEVEL') private SET_CURRENT_TOPO_LEVEL: any;
  @Mutation('rocketTopo/SET_CAN_ROLL_UP') private SET_CAN_ROLL_UP: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_BS') private SET_TOPO_CURRENT_BS: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_TS') private SET_TOPO_CURRENT_TS: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_NODE') private SET_TOPO_CURRENT_NODE: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_SERVICE') private SET_TOPO_CURRENT_SERVICE: any;
  @Mutation('rocketTopo/SET_CAN_DRILL_DOWN') private SET_CAN_DRILL_DOWN: any;
  @Action('rocketTopo/GET_WRAPPED_BS_TOPO') private GET_WRAPPED_BS_TOPO: any;
  @Action('rocketTopo/GET_WRAPPED_TS_TOPO') private GET_WRAPPED_TS_TOPO: any;
  @Action('rocketTopo/GET_WRAPPED_NODE_TOPO') private GET_WRAPPED_NODE_TOPO: any;
  @Action('rocketTopo/GET_TOPO') private GET_TOPO: any;

  private drillDownTopo() {
    if (this.rocketTopo.topoShowLevel === 'wrappedBs') {
      this.SET_CURRENT_TOPO_LEVEL('wrappedTs');
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(true);
      this.GET_WRAPPED_TS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
        duration: this.durationTime});
    } else if (this.rocketTopo.topoShowLevel === 'wrappedTs') {
      this.SET_CURRENT_TOPO_LEVEL('topo');
      this.SET_CAN_DRILL_DOWN(false);
      this.SET_CAN_ROLL_UP(true);
      this.GET_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
        duration: this.durationTime});
    }
  }

  private rollUpTopo() {
    if (this.rocketTopo.topoShowLevel === 'topo') {
      this.SET_CURRENT_TOPO_LEVEL('wrappedTs');
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(true);
      this.GET_WRAPPED_TS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
        duration: this.durationTime});
    } else if (this.rocketTopo.topoShowLevel === 'wrappedTs') {
      this.SET_CURRENT_TOPO_LEVEL('wrappedBs');
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(false);
      this.GET_WRAPPED_BS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
        duration: this.durationTime});
    }
  }

  private getBsWrappedTopo() {
    if (this.rocketTopo.topoShowLevel === 'wrappedBs' && this.rocketTopo.currentTopoBs.label === 'All') {
      return;
    }
    this.SET_CURRENT_TOPO_LEVEL('wrappedBs');
    this.SET_CAN_DRILL_DOWN(true);
    this.SET_CAN_ROLL_UP(false);
    this.SET_TOPO_CURRENT_BS({label: 'All', key: ''});
    this.SET_TOPO_CURRENT_TS({label: 'All', key: ''});
    this.SET_TOPO_CURRENT_SERVICE({label: 'All', key: ''});
    this.GET_WRAPPED_BS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: '',
      duration: this.durationTime});
  }

  private getTsWrappedTopo() {
    if ((this.rocketTopo.topoShowLevel === 'wrappedBs' || this.rocketTopo.topoShowLevel === 'wrappedTs')
      && this.rocketTopo.currentTopoTs.label === 'All') {
      return;
    }
    this.SET_CURRENT_TOPO_LEVEL('wrappedTs');
    this.SET_CAN_DRILL_DOWN(true);
    this.SET_CAN_ROLL_UP(true);
    this.SET_TOPO_CURRENT_TS({label: 'All', key: ''});
    this.SET_TOPO_CURRENT_SERVICE({label: 'All', key: ''});
    this.GET_WRAPPED_TS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
      duration: this.durationTime});
  }

  private getNodeWrappedTopo() {
    if ((this.rocketTopo.topoShowLevel === 'wrappedBs' || this.rocketTopo.topoShowLevel === 'wrappedTs'
      || this.rocketTopo.topoShowLevel === 'wrappedNode') && this.rocketTopo.currentTopoNode.label === 'All') {
      return;
    }
    this.SET_CURRENT_TOPO_LEVEL('wrappedNode');
    this.SET_CAN_DRILL_DOWN(true);
    this.SET_CAN_ROLL_UP(true);
    this.SET_TOPO_CURRENT_NODE({label: 'All', key: ''});
    this.SET_TOPO_CURRENT_SERVICE({label: 'All', key: ''});
    this.GET_WRAPPED_NODE_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
      tsIds: this.rocketTopo.currentTopoTs.key, duration: this.durationTime});
  }

  private getTopo() {
    // if (this.rocketTopo.topoShowLevel === 'wrappedNode' && this.rocketTopo.currentTopoService.label === 'All') {
    //   return;
    // }
    if (this.rocketTopo.topoShowLevel === 'wrappedTs' && this.rocketTopo.currentTopoService.label === 'All') {
      return;
    }
    this.SET_CURRENT_TOPO_LEVEL('topo');
    this.SET_CAN_DRILL_DOWN(false);
    this.SET_CAN_ROLL_UP(true);
    this.SET_TOPO_CURRENT_SERVICE({label: 'All', key: ''});
    this.GET_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketTopo.currentTopoBs.key,
      tsIds: this.rocketTopo.currentTopoTs.key, nodeIds: this.rocketTopo.currentTopoNode.key,
      duration: this.durationTime});
  }
}
</script>
<style lang="scss">
.link-topo-tool{
 box-shadow: 0 1px 0px rgba(0, 0, 0, 0.08);
 background-color: rgba(196, 200, 225, .2);
 padding: 0 15px;
}
.link-topo-tool-box{
 margin: 5px 5px;
}
.link-topo-tool-btn-box{
  margin: 5px 5px;
  color: #448dfe;
  &:hover{
   /*color: #448dfe;*/
   cursor: pointer;
   /*border-bottom: 2px solid #448dfe;*/
  }
}
.link-topo-tool-btn{
  color: #448dfe;
  border: 1px solid #626977;
  padding: 0px 3px;
  width: 60px;
  display: inline-block;
  &:hover{
    /*color: #448dfe;*/
    color: #ffffff;
    background-color: #448dfe;
  }
}
.topo-tool-icon{
  width: 15px;
  height: 15px;
}
.topo-tool-icon-box{
  padding-left: 4px;
  padding-top: 5px;
}
</style>
