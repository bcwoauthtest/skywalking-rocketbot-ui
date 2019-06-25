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
  <aside class="link-rollup-topo-aside" style="z-index:1000">
    <div class="link-rollup-topo-aside-btn icon-tooltip mb-10 " :style="`z-index:999;left:300px;`">
      <svg class="icon cp lg" @click="changeShowState" :style="`transform: rotate(${stateTopo.show?180 : 0}deg);`">
        <use xlink:href="#chevron-left"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:80px;">{{stateTopo.show?'隐藏详情' : '展开详情'}}</span>
    </div>
    <div class="link-rollup-topo-aside-btn icon-tooltip mb-10 " :style="`z-index:999;left:300px;top:32px;`">
      <svg class="icon cp lg" @click="drillDownGlobalTopo">
        <use xlink:href="#global-drill-down"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:80px;">全局下钻</span>
    </div>
    <div class="link-rollup-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.id && stateTopo.currentNode.id.indexOf('_') === -1" :style="`z-index:999;left:300px;top:64px;`">
      <svg class="icon cp lg" @click="drillDownTopo">
        <use xlink:href="#drill-down"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:50px;">下钻当前节点</span>
    </div>
    <div class="link-rollup-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.id && stateTopo.currentNode.id.indexOf('_') === -1" :style="`z-index:999;left:300px;top:96px;`">
      <svg class="icon cp lg" @click="updateDefInfo">
        <use xlink:href="#pencil-square"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:100px;">自定义信息</span>
    </div>

    <div class="link-rollup-topo-aside-box mb-10" v-if="stateTopo.currentNode.id && stateTopo.currentNode.id.indexOf('_') === -1 && stateTopo.show">
      <div class="mb-20">
        <span class="b dib mr-20">系统详情</span>
      </div>
      <div class="mb-10">
        <span class="label grey">所属业务服务</span>
        <span class="content">{{stateTopo.currentNode.bsName}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('name')}}</span>
        <span class="content">{{stateTopo.currentNode.displayName}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.cpm">
        <span class="label grey">{{$t('cpm')}}</span>
        <span class="content">{{stateTopo.currentNode.cpm}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.sla !== undefined">
        <span class="label grey">{{$t('sla')}}</span>
        <span class="content">{{stateTopo.currentNode.sla}}%</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.latency">
        <span class="label grey">{{$t('latency')}}</span>
        <span class="content">{{stateTopo.currentNode.latency}} ms</span>
      </div>
    </div>
    <div class="link-rollup-topo-aside-box mb-10" v-else-if="stateTopo.currentNode.id && stateTopo.currentNode.id && stateTopo.show">
      <div class="mb-20">
        <span class="b dib mr-20">{{$t('linkDetail')}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('source')}}</span>
        <span class="content">{{getApplicationName(stateTopo.currentNode.source)}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('target')}}</span>
        <span class="content">{{getApplicationName(stateTopo.currentNode.target)}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.cpm">
        <span class="label grey">{{$t('cpm')}}</span>
        <span class="content">{{stateTopo.currentNode.cpm}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.latency && stateTopo.currentNode.latency !== ''">
        <span class="label grey">{{$t('latency')}}</span>
        <span class="content">{{stateTopo.currentNode.latency}} ms</span>
      </div>
      <!--<div class="mb-10" v-show="stateTopo.currentNode.callType && stateTopo.currentNode.callType !== ''">-->
        <!--<span class="label grey">{{$t('callType')}}</span>-->
        <!--<span class="content">{{stateTopo.currentNode.callType}}</span>-->
      <!--</div>-->
    </div>
    <!--<div class="link-rollup-topo-aside-box" v-if="stateTopo.currentNode.id && stateTopo.currentNode.source && stateTopo.show">-->
      <!--<div class="mb-5 clear">-->
        <!--<span class="b dib mr-20 vm">{{$t('detectPoint')}}</span>-->
        <!--&lt;!&ndash;<span class="link-rollup-topo-aside-box-btn tc r sm cp b" :class="{'active':!stateTopo.mode}" @click="setMode(false)">{{this.$t('client')}}</span>&ndash;&gt;-->
        <!--<span class="link-rollup-topo-aside-box-btn tc r sm cp b active">{{stateTopo.mode? this.$t('server'): this.$t('client')}}</span>-->
      <!--</div>-->
      <!--<TopoChart v-if="stateTopo.getResponseTimeTrend.length" :title="$t('avgResponseTime')" unit="ms" :intervalTime="intervalTime" :data="stateTopo.getResponseTimeTrend"/>-->
      <!--<TopoChart v-if="stateTopo.getThroughputTrend.length" :title="$t('avgThroughput')" unit="cpm" :intervalTime="intervalTime" :data="stateTopo.getThroughputTrend"/>-->
      <!--<TopoChart v-if="stateTopo.getSLATrend.length" :title="$t('avgSLA')" unit="%" :intervalTime="intervalTime" :precent="true" :data="stateTopo.getSLATrend"/>-->
    <!--</div>-->
    <div class="link-rollup-topo-aside-box mb-10" v-else-if="stateTopo.show">
      <!--<div class="mb-20">-->
        <!--<span class="b dib mr-20">{{$t('allServices')}}</span>-->
      <!--</div>-->
      <!--<div class="mb-10" v-for="(val, key, index) in types" :key="index">-->
        <!--<span class="r">{{val}}</span>-->
        <!--<span class="grey">{{key}}</span>-->
      <!--</div>-->
      <div class="mb-10">
        <div class="grey stat-title">当前调用图谱系统数</div>
        <div class="stat-label">{{stateTopo.nodes.length}}</div>
      </div>
      <div class="mb-10" v-if="stateTopo.busiestNode">
        <div class="grey stat-title">最繁忙系统</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.busiestNode.id)">
          <div>{{getApplicationName(stateTopo.busiestNode.id)}}</div>
          <div>
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位系统</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.lowestServiceLevelNode">
        <div class="grey stat-title">服务等级最低系统</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestServiceLevelNode.id)">
          <div>{{getApplicationName(stateTopo.lowestServiceLevelNode.id)}}</div>
          <div>
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位系统</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-else>
        <div class="grey stat-title">服务等级最低系统</div>
        <div class="stat-label flex-left-h" >
          <div>所有系统服务等级均为100%</div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.lowestResponseNode">
        <div class="grey stat-title">最耗时系统</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestResponseNode.id)">
          <div>{{getApplicationName(stateTopo.lowestResponseNode.id)}}</div>
          <div>
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位系统</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.busiestCall">
        <div class="grey stat-title">最繁忙链路</div>
        <div class="stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.busiestCall.source)">
          <div style="font-size:11px;flex-shrink: 0;text-indent:15px;width:55px;">源端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.busiestCall.source)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位系统</span>
          </div>
        </div>
        <div class="stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.busiestCall.target)">
          <div style="font-size:11px;flex-shrink: 0;text-indent: 15px;width:55px;">终端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.busiestCall.target)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位系统</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.lowestResponseCall">
        <div class="grey stat-title">最耗时链路</div>
        <div class="stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestResponseCall.source)">
          <div style="font-size:11px;flex-shrink: 0;text-indent: 15px;width:55px;">源端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.lowestResponseCall.source)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位系统</span>
          </div>
        </div>
        <div class="stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestResponseCall.target)">
          <div style="font-size:11px;flex-shrink: 0;text-indent: 15px;width:55px;">终端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.lowestResponseCall.target)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位系统</span>
          </div>
        </div>
      </div>
    </div>
    <div class="link-rollup-topo-aside-box mb-10" v-if="stateTopo.showEdit">
      <div class="mb-20">
        <span class="b dib mr-20">自定义节点信息</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('name')}}</span>
        <span class="content"><input v-model="editName"/></span>
      </div>
      <!--<div class="mb-10">-->
        <!--<span class="label grey">{{$t('type')}}</span>-->
        <!--<span class="content"><input v-model="editType"/></span>-->
      <!--</div>-->
      <div class="mb-10">
        <span class="label grey"></span>
        <!--<a class="rk-btn mr-5 sm blue" @click="commitUpdate">
          <span class="vm">{{this.$t('confirm')}}</span>
        </a>-->
        <span class="rk-btn tc r sm cp b blue" @click="cancelUpdate">{{this.$t('cancel')}}</span>
        <span class="rk-btn tc r sm cp b blue mr-5" @click="commitUpdate">{{this.$t('confirm')}}</span>
      </div>
    </div>
  </aside>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import topo, { State as topoState} from '@/store/modules/topo';
import { State, Mutation, Getter, Action } from 'vuex-class';
import TopoChart from './topo-chart.vue';

@Component({components: {TopoChart}})
export default class RollUpTopoAsideclickRollUpStat extends Vue {
  @State('rocketTopo') public stateTopo!: topoState;
  @Getter('intervalTime') public intervalTime: any;
  @Mutation('rocketTopo/SET_MODE') public SET_MODE: any;
  @Mutation('rocketTopo/SET_TOPO_DETAIL_SHOW') public SET_TOPO_DETAIL_SHOW: any;
  @Mutation('rocketTopo/SET_TOPO_EDIT_SHOW') public SET_TOPO_EDIT_SHOW: any;
  @Action('rocketTopo/CLEAR_TOPO_INFO') public CLEAR_TOPO_INFO: any;
  @Action('rocketTopo/UPDATE_USER_DEF_BS_NAME') public UPDATE_USER_DEF_BS_NAME: any;
  @Action('rocketTopo/UPDATE_USER_DEF_TS_NAME') public UPDATE_USER_DEF_TS_NAME: any;
  @Action('rocketTopo/UPDATE_USER_DEF_NODE_NAME') public UPDATE_USER_DEF_NODE_NAME: any;
  @Action('rocketTopo/UPDATE_USER_DEF_NODE_TYPE') public UPDATE_USER_DEF_NODE_TYPE: any;
  @Mutation('SET_CURRENT_TOPO_SERVICE') private SET_CURRENT_TOPO_SERVICE: any;
  @Mutation('rocketTopo/SET_CURRENT_TOPO_LEVEL') private SET_CURRENT_TOPO_LEVEL: any;
  @Mutation('rocketTopo/SET_CAN_ROLL_UP') private SET_CAN_ROLL_UP: any;
  @Mutation('rocketTopo/SET_CAN_DRILL_DOWN') private SET_CAN_DRILL_DOWN: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_BS') private SET_TOPO_CURRENT_BS: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_TS') private SET_TOPO_CURRENT_TS: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_NODE') private SET_TOPO_CURRENT_NODE: any;
  @State('rocketbot') private rocketbotGlobal: any;
  @Action('rocketTopo/GET_TOPO') private GET_TOPO: any;
  @Action('rocketTopo/GET_WRAPPED_BS_TOPO') private GET_WRAPPED_BS_TOPO: any;
  @Action('rocketTopo/GET_WRAPPED_TS_TOPO') private GET_WRAPPED_TS_TOPO: any;
  @Action('rocketTopo/GET_WRAPPED_NODE_TOPO') private GET_WRAPPED_NODE_TOPO: any;
  @Getter('durationTime') private durationTime: any;

  private showInfo: boolean = false;
  private editName: string = '';
  private editType: string = '';
  private setMode(mode: boolean) {
    this.SET_MODE(mode);
    this.stateTopo.callback();
  }
  private changeShowState() {
    if (this.stateTopo.show) {
       this.SET_TOPO_DETAIL_SHOW(false);
    } else {
       this.SET_TOPO_DETAIL_SHOW(true);
    }
  }
  private getApplicationName(applicationId: any) {
    const resultNode = this.stateTopo.nodes.filter((appCalls) => (appCalls.id === applicationId));
    if (resultNode.length === 0) {
      return '';
    }
    let displayName = resultNode[0].userDefName !== undefined && resultNode[0].userDefName !== '' ?
        resultNode[0].userDefName : resultNode[0].name;
    if (displayName.indexOf('@') !== -1) {
      displayName = displayName.split('@')[0];
    }
    return displayName;
  }

  private clickStat(applicationId: any) {
    this.$emit('clickRollUpStat', applicationId);
  }
  private drillDownTopo() {
    const currentNodeId = this.stateTopo.currentNode.id;
    const currentName = this.stateTopo.currentNode.name;
    const currentDefName = this.stateTopo.currentNode.userDefName;
    const currentNodeName = currentDefName !== undefined && currentDefName !== '' ? currentDefName : currentName;
    if (currentNodeId === undefined || currentNodeId === '') {
      return;
    }
    if (this.stateTopo.topoShowLevel === 'wrappedBs') {
      this.SET_CURRENT_TOPO_LEVEL('wrappedTs');
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(true);
      this.SET_TOPO_CURRENT_BS({label: currentNodeName, key: this.stateTopo.currentNode.id});
      this.GET_WRAPPED_TS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: currentNodeId, duration: this.durationTime});

    } else if (this.stateTopo.topoShowLevel === 'wrappedTs') {
    //   this.SET_CURRENT_TOPO_LEVEL('wrappedNode');
    //   this.SET_CAN_DRILL_DOWN(true);
    //   this.SET_CAN_ROLL_UP(true);
    //   this.SET_TOPO_CURRENT_TS({label: currentNodeName, key: this.stateTopo.currentNode.id});
    //   this.GET_WRAPPED_NODE_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key, tsIds: currentNodeId, duration: this.durationTime});
    //
    // } else if (this.stateTopo.topoShowLevel === 'wrappedNode') {
      this.SET_CURRENT_TOPO_LEVEL('topo');
      this.SET_CAN_DRILL_DOWN(false);
      this.SET_CAN_ROLL_UP(true);
      // this.SET_TOPO_CURRENT_NODE({label: currentNodeName, key: this.stateTopo.currentNode.id});
      // this.GET_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key, tsIds: this.stateTopo.currentTopoTs.key, nodeIds: currentNodeId, duration: this.durationTime});
      this.SET_TOPO_CURRENT_TS({label: currentNodeName, key: this.stateTopo.currentNode.id});
      this.GET_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key, tsIds: currentNodeId, duration: this.durationTime});
    }
  }

  private updateDefInfo() {
    this.editName = this.stateTopo.currentNode.userDefName;
    // this.editType = this.stateTopo.currentNode.userDefNodeType;
    this.SET_TOPO_EDIT_SHOW(true);
  }
  private commitUpdate() {
    this.SET_TOPO_EDIT_SHOW(false);
    if (this.editName !== this.stateTopo.currentNode.userDefName) {
      if (this.stateTopo.topoShowLevel === 'wrappedBs') {
        this.UPDATE_USER_DEF_BS_NAME({bsId: this.stateTopo.currentNode.id, userDefineBsNodeName: this.editName});
      }
      if (this.stateTopo.topoShowLevel === 'wrappedTs') {
        this.UPDATE_USER_DEF_TS_NAME({tsId: this.stateTopo.currentNode.id, userDefineTsNodeName: this.editName});
      }
      if (this.stateTopo.topoShowLevel === 'wrappedNode') {
        this.UPDATE_USER_DEF_NODE_NAME({nodeId: this.stateTopo.currentNode.id, userDefineNodeNodeName: this.editName});
      }
    }
    // if (this.editType !== this.stateTopo.currentNode.userDefNodeType) {
    //   this.UPDATE_USER_DEF_NODE_TYPE({serviceSequence: this.stateTopo.currentNode.id,
    //     userDefineNodeType: this.editType});
    // }
    if (this.stateTopo.topoShowLevel === 'wrappedBs') {
      this.GET_WRAPPED_BS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key,
        duration: this.durationTime});
    } else if (this.stateTopo.topoShowLevel === 'wrappedTs') {
      this.GET_WRAPPED_TS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key,
        duration: this.durationTime});
    } else if (this.stateTopo.topoShowLevel === 'wrappedNode') {
      this.GET_WRAPPED_NODE_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key,
        tsIds: this.stateTopo.currentTopoTs.key, duration: this.durationTime});
    }
  }
  private cancelUpdate() {
    this.SET_TOPO_EDIT_SHOW(false);
  }

  private drillDownGlobalTopo() {
    if (this.stateTopo.topoShowLevel === 'wrappedBs') {
      this.SET_CURRENT_TOPO_LEVEL('wrappedTs');
      this.SET_CAN_DRILL_DOWN(true);
      this.SET_CAN_ROLL_UP(true);
      this.GET_WRAPPED_TS_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.rocketbotGlobal.selectedBs,
        duration: this.durationTime});
    } else if (this.stateTopo.topoShowLevel === 'wrappedTs') {
    //   this.SET_CURRENT_TOPO_LEVEL('wrappedNode');
    //   this.SET_CAN_DRILL_DOWN(true);
    //   this.SET_CAN_ROLL_UP(true);
    //   this.GET_WRAPPED_NODE_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key,
    //     duration: this.durationTime});
    // } else if (this.stateTopo.topoShowLevel === 'wrappedNode') {
      this.SET_CURRENT_TOPO_LEVEL('topo');
      this.SET_CAN_DRILL_DOWN(false);
      this.SET_CAN_ROLL_UP(true);
      this.GET_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key,
        tsIds: this.stateTopo.currentTopoTs.key, nodeIds: this.stateTopo.currentTopoNode.key,
        duration: this.durationTime});
    }
  }
}
</script>
<style lang="scss">
.link-rollup-topo-aside{
  width: 290px;
  position: absolute;
  right: 40px;
  top: 80px;
  .to-apm{
    padding-top: 10px;
    border-top: 1px solid #d8d8d866;
  }
}
.link-rollup-topo-aside-box-btn{
  color: #626977;
  border: 1px solid;
  padding: 0px 3px;
  width: 45px;
  display: inline-block;
  &.active{
    /*color: #448dfe;*/
    color: #ffffff;
  }
}
.link-rollup-topo-aside-btn{
  height: 27px;
  position: absolute;
  display:block;
  background: #252a2f9a;
  color: #ddd;
  border-radius: 4px 4px 4px 4px;
  text-align: center;
  padding: 5px;
  /*&:hover:before {*/
    /*position: relative;*/
    /*content: attr(labelTooltip);*/
    /*z-index: 1999;*/
    /*width: 20px;*/
  /*}*/
}
.link-rollup-topo-aside-box{
  border-radius: 4px;
  color: #ddd;
  background-color: #252a2f9a;
  padding: 15px 20px 10px;
  .label{
    display: inline-block;
    width: 40%;
  }
  .content{
    vertical-align: top;
    display: inline-block;
    width: 60%;
  }
  .circle{
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #EE5B5B;
    margin-top: 6px;
  }
  .stat-label{
    text-indent: 15px;
    z-index: 9999;
    font-size: 11px;
  }
  .stat-title{
    font-size: 14px;
  }
}
.icon-tooltip .icon-tooltiptext {
  visibility: hidden;
  background-color: #252a2f;
  color: #ddd;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: -5px;
  right: 110%;
}

.icon-tooltip .icon-tooltiptext::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #252a2f;
}
.icon-tooltip:hover .icon-tooltiptext {
  visibility: visible;
}
.stat-icon-tooltip .stat-icon-tooltiptext {
  visibility: hidden;
  background-color: #252a2f;
  color: #ddd;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  text-indent: 0px;
}

/*.stat-icon-tooltip .stat-icon-tooltiptext::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}*/
.stat-icon-tooltip:hover .stat-icon-tooltiptext {
  visibility: visible;
}
.flex-left-h{display: inline-flex;align-items: flex-start;align-content:flex-start;}
</style>
