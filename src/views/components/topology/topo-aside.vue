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
  <aside class="link-topo-aside" style="z-index:1000">
    <div class="link-topo-aside-btn icon-tooltip mb-10 " :style="`z-index:999;left:290px;`">
      <svg class="icon cp lg" @click="changeShowState" :style="`transform: rotate(${stateTopo.show?180 : 0}deg);`">
        <use xlink:href="#chevron-left"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:80px;">{{stateTopo.show?'隐藏详情' : '展开详情'}}</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " :style="`z-index:999;left:290px;top:32px;`">
      <svg class="icon cp lg" @click="searchNode">
        <use xlink:href="#search"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:50px;">搜索</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.isReal !== undefined" :style="`z-index:999;left:290px;top:64px;`">
      <svg class="icon cp lg" @click="updateDefInfo">
        <use xlink:href="#pencil-square"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:100px;">自定义信息</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.isReal !== undefined" :style="`z-index:999;left:290px;top:96px;`">
      <svg class="icon cp lg" @click="drillDownTopo">
        <use xlink:href="#topology"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:120px;">当前节点TOPO</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.isReal" :style="`z-index:999;left:290px;top:128px;`">
      <svg class="icon cp lg" @click="routerGoTrace">
        <use xlink:href="#link"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:120px;">调用链路详情</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.isReal && stateTopo.currentNode.host !== undefined && stateTopo.currentNode.host != ''" :style="`z-index:999;left:290px;top:160px;`">
      <svg class="icon cp lg" @click="routerGoGrafana" >
        <use xlink:href="#dashboard"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:120px;">分析诊断大盘</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.isReal && stateTopo.currentNode.ciId !== '0' && stateTopo.currentNode.ciId !== '-1'" :style="`z-index:999;left:290px;top:${stateTopo.currentNode.host !== undefined && stateTopo.currentNode.host != ''? '192px': '160px'};`">
      <svg class="mb-10 icon cp lg" @click="routerGoLog" >
        <use xlink:href="#log"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:80px;">日志详情</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.isReal === false  && stateTopo.currentNode.host !== undefined && stateTopo.currentNode.host != ''" :style="`z-index:999;left:290px;top:128px;`">
      <svg class="mb-10 icon cp lg" @click="routerGoGrafana" >
        <use xlink:href="#dashboard"></use>
      </svg>
      <span class="icon-tooltiptext" style="width:120px;">分析诊断大盘</span>
    </div>
    <div class="link-topo-aside-btn icon-tooltip mb-10 " v-if="stateTopo.currentNode.isReal === false && stateTopo.currentNode.ciId !== '0' && stateTopo.currentNode.ciId !== '-1'" :style="`z-index:999;left:290px;top:${stateTopo.currentNode.host !== undefined && stateTopo.currentNode.host != ''? '160px': '128px'};`">
    <svg class="icon cp lg" @click="routerGoLog" >
      <use xlink:href="#log"></use>
    </svg>
      <span class="icon-tooltiptext" style="width:80px;">日志详情</span>
    </div>
    <div class="link-topo-aside-box mb-10" v-if="stateTopo.showSearch">
      <div class="mb-20">
        <span class="b dib mr-20">查询应用</span>
      </div>
      <div class="mb-10">
        <span class="label grey">应用名称</span>
        <span class="content"><input v-model="searchName"/></span>
      </div>
      <div class="mb-10">
        <span class="label grey"></span>
        <!--<a class="rk-btn mr-5 sm blue" @click="commitUpdate">
          <span class="vm">{{this.$t('confirm')}}</span>
        </a>-->
        <span class="rk-btn tc r sm cp b blue" @click="cancleSearch">{{this.$t('cancel')}}</span>
        <span class="rk-btn tc r sm cp b blue mr-5" @click="locateNext" v-if="searchResult.length > 1">定位下一个</span>
        <span class="rk-btn tc r sm cp b blue mr-5" @click="commitSearch" v-if="locateIndex === 0" >{{this.$t('search')}}</span>
      </div>
      <div class="mb-20" v-if="showSearchTooltip">
        <span class="b dib mr-20">未找到相关应用</span>
      </div>
    </div>
    <div class="link-topo-aside-box mb-10" v-if="stateTopo.currentNode.id && stateTopo.currentNode.isReal === true && stateTopo.show">
      <div class="mb-20">
        <span class="b dib mr-20">{{$t('serviceDetail')}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('name')}}</span>
        <span class="content">{{stateTopo.currentNode.displayName}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.displayName !== stateTopo.currentNode.name">
        <span class="label grey">配置名称</span>
        <span class="content">{{stateTopo.currentNode.name}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('host')}}</span>
        <span class="content">{{stateTopo.currentNode.host && stateTopo.currentNode.host !== "" && stateTopo.currentNode.hostIP !== "null"? stateTopo.currentNode.host : '未在云管理平台注册'}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">IP地址</span>
        <span class="content">{{stateTopo.currentNode.hostIP && stateTopo.currentNode.hostIP !== "" && stateTopo.currentNode.hostIP !== "null"? stateTopo.currentNode.hostIP : '未在云管理平台中注册'}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('type')}}</span>
        <span class="content">{{stateTopo.currentNode.userDefNodeType && stateTopo.currentNode.userDefNodeType != "" ? stateTopo.currentNode.userDefNodeType : stateTopo.currentNode.type}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('detectState')}}</span>
        <span class="content">已部署</span>
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
    <div class="link-topo-aside-box mb-10" v-else-if="stateTopo.currentNode.id && stateTopo.currentNode.isReal === false && stateTopo.show">
      <div class="mb-20">
        <span class="b dib mr-20">{{$t('serviceDetail')}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('name')}}</span>
        <span class="content">{{stateTopo.currentNode.displayName}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.displayName !== stateTopo.currentNode.name">
        <span class="label grey">探测地址</span>
        <span class="content">{{stateTopo.currentNode.name}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('host')}}</span>
        <span class="content">{{stateTopo.currentNode.host && stateTopo.currentNode.host != "" ? stateTopo.currentNode.host : '未在云管理平台中注册'}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">IP地址</span>
        <span class="content">{{stateTopo.currentNode.hostIP && stateTopo.currentNode.hostIP != "" ? stateTopo.currentNode.hostIP : '未在云管理平台中注册'}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('type')}}</span>
        <span class="content">{{stateTopo.currentNode.userDefNodeType && stateTopo.currentNode.userDefNodeType != "" ? stateTopo.currentNode.userDefNodeType : stateTopo.currentNode.type}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('detectState')}}</span>
        <span class="content">未部署</span>
      </div>
    </div>
    <div class="link-topo-aside-box mb-10" v-else-if="stateTopo.currentNode.id && stateTopo.show">
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
      <div class="mb-10" v-show="stateTopo.currentNode.callType && stateTopo.currentNode.callType !== ''">
        <span class="label grey">{{$t('callType')}}</span>
        <span class="content">{{stateTopo.currentNode.callType}}</span>
      </div>
    </div>
    <div class="link-topo-aside-box" v-if="stateTopo.currentNode.id && stateTopo.currentNode.source && stateTopo.show">
      <div class="mb-5 clear">
        <span class="b dib mr-20 vm">{{$t('detectPoint')}}</span>
        <!--<span class="link-topo-aside-box-btn tc r sm cp b" :class="{'active':!stateTopo.mode}" @click="setMode(false)">{{this.$t('client')}}</span>-->
        <span class="link-topo-aside-box-btn tc r sm cp b active">{{stateTopo.mode? this.$t('server'): this.$t('client')}}</span>
      </div>
      <TopoChart v-if="stateTopo.getResponseTimeTrend.length" :title="$t('avgResponseTime')" unit="ms" :intervalTime="intervalTime" :data="stateTopo.getResponseTimeTrend"/>
      <TopoChart v-if="stateTopo.getThroughputTrend.length" :title="$t('avgThroughput')" unit="cpm" :intervalTime="intervalTime" :data="stateTopo.getThroughputTrend"/>
      <TopoChart v-if="stateTopo.getSLATrend.length" :title="$t('avgSLA')" unit="%" :intervalTime="intervalTime" :precent="true" :data="stateTopo.getSLATrend"/>
    </div>
    <div class="link-topo-aside-box mb-10" v-else-if="!stateTopo.currentNode.id && stateTopo.show&& stateTopo.nodes.length > 0">
      <!--<div class="mb-20">-->
        <!--<span class="b dib mr-20">{{$t('allServices')}}</span>-->
      <!--</div>-->
      <!--<div class="mb-10" v-for="(val, key, index) in types" :key="index">-->
        <!--<span class="r">{{val}}</span>-->
        <!--<span class="grey">{{key}}</span>-->
      <!--</div>-->
      <div class="mb-10">
        <div class="grey">当前调用图谱应用数</div>
        <div class="stat-label">{{types}}</div>
      </div>
      <div class="mb-10" v-if="stateTopo.busiestNode">
        <div class="grey stat-title">最繁忙应用</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.busiestNode.id)">
          <div>{{getApplicationName(stateTopo.busiestNode.id)}}</div>
          <div>
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位应用</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.lowestServiceLevelNode">
        <div class="grey stat-title">服务等级最低应用</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestServiceLevelNode.id)">
          <div>{{getApplicationName(stateTopo.lowestServiceLevelNode.id)}}</div>
          <div>
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位应用</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-else>
        <div class="grey stat-title">服务等级最低应用</div>
        <div class="stat-label flex-left-h" >
          <div>所有应用服务等级均为100%</div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.lowestResponseNode">
        <div class="grey stat-title">最耗时应用</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestResponseNode.id)">
          <div>{{getApplicationName(stateTopo.lowestResponseNode.id)}}</div>
          <div>
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位应用</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.busiestCall">
        <div class="grey stat-title">最繁忙链路</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.busiestCall.source)">
          <div style="font-size:11px;flex-shrink: 0;text-indent: 15px;width:55px;">源端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.busiestCall.source)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位应用</span>
          </div>
        </div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.busiestCall.target)">
          <div style="font-size:11px;flex-shrink: 0;text-indent: 15px;width:55px;">终端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.busiestCall.target)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位应用</span>
          </div>
        </div>
      </div>
      <div class="mb-10" v-if="stateTopo.lowestResponseCall">
        <div class="grey stat-title">最耗时链路</div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestResponseCall.source)">
          <div style="font-size:11px;flex-shrink: 0;text-indent: 15px;width:55px;">源端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.lowestResponseCall.source)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位应用</span>
          </div>
        </div>
        <div class="stat-label stat-icon-tooltip flex-left-h" @click="clickStat(stateTopo.lowestResponseCall.target)">
          <div style="font-size:11px;flex-shrink: 0;text-indent: 15px;width:55px;">终端：</div>
          <div style="font-size:11px;text-indent:0;">{{getApplicationName(stateTopo.lowestResponseCall.target)}}</div>
          <div style="font-size:11px;padding-left:10px;">
            <svg class="icon cp lg">
              <use xlink:href="#locate"></use>
            </svg>
            <span class="stat-icon-tooltiptext" style="width:60px;">定位应用</span>
          </div>
        </div>
      </div>
    </div>
    <div class="link-topo-aside-box mb-10" v-if="stateTopo.showEdit">
      <div class="mb-20">
        <span class="b dib mr-20">自定义节点信息</span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('name')}}</span>
        <span class="content"><input v-model="editName"/></span>
      </div>
      <div class="mb-10">
        <span class="label grey">{{$t('type')}}</span>
        <span class="content"><input v-model="editType"/></span>
      </div>
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
  import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import topo, { State as topoState} from '@/store/modules/topo';
import { State, Mutation, Getter, Action } from 'vuex-class';
import TopoChart from './topo-chart.vue';

@Component({components: {TopoChart}})
export default class TopoAside extends Vue {
  @State('rocketTopo') public stateTopo!: topoState;
  @Getter('intervalTime') public intervalTime: any;
  @Mutation('rocketTopo/SET_MODE') public SET_MODE: any;
  @Mutation('rocketTopo/SET_TOPO_DETAIL_SHOW') public SET_TOPO_DETAIL_SHOW: any;
  @Mutation('rocketTopo/SET_TOPO_EDIT_SHOW') public SET_TOPO_EDIT_SHOW: any;
  @Mutation('rocketTopo/SET_TOPO_SEARCH_SHOW') public SET_TOPO_SEARCH_SHOW: any;
  @Mutation('rocketTopo/SET_TOPO_CURRENT_SERVICE') public SET_TOPO_CURRENT_SERVICE: any;
  @Action('rocketTopo/CLEAR_TOPO_INFO') public CLEAR_TOPO_INFO: any;
  @Action('rocketTopo/UPDATE_USER_DEF_NAME') public UPDATE_USER_DEF_NAME: any;
  @Action('rocketTopo/UPDATE_USER_DEF_NODE_TYPE') public UPDATE_USER_DEF_NODE_TYPE: any;
  @Mutation('SET_SELECTED_CI_ID') private SET_SELECTED_CI_ID: any;
  @Mutation('SET_SELECTED_CI_CODE') private SET_SELECTED_CI_CODE: any;
  @Mutation('SET_SELECTED_TS') private SET_SELECTED_TS: any;
  @Mutation('SET_CURRENT_TOPO_SERVICE') private SET_CURRENT_TOPO_SERVICE: any;
  @State('rocketbot') private rocketbotGlobal: any;
  @Action('rocketTopo/GET_TOPO') private GET_TOPO: any;
  @Action('rocketTopo/GET_SERVICE_TOPO') private GET_SERVICE_TOPO: any;
  @Getter('durationTime') private durationTime: any;
  get types() {
    let result = 0;
    this.stateTopo.nodes.forEach((i: any) => {
      if (i.name !== 'User') {
        result++;
      }
    });
    return result;
  }
  private showInfo: boolean = false;
  private editName: string = '';
  private editType: string = '';
  private searchName: string = '';
  private searchResult: any[] = [];
  private locateIndex = 0;
  private showSearchTooltip = false;
  @Watch('searchName')
  private onSearhNameChange() {
    this.searchResult = [];
    this.locateIndex = 0;
    this.showSearchTooltip = false;
  }
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
  private routerGoTrace() {
    this.SET_CURRENT_TOPO_SERVICE({
      key: this.stateTopo.currentNode.id,
      label: this.stateTopo.currentNode.displayName,
    });
    this.$router.push({name: 'trace', params: {
        tenantId: (this.rocketbotGlobal.currentTenant === undefined ? '' : this.rocketbotGlobal.currentTenant)}});
  }
  private routerGoLog() {
    this.SET_CURRENT_TOPO_SERVICE({
      key: this.stateTopo.currentNode.id,
      label: this.stateTopo.currentNode.displayName,
    });
    this.$router.push({name: 'log', params: {
        tenantId: (this.rocketbotGlobal.currentTenant === undefined ? '' : this.rocketbotGlobal.currentTenant)}});
  }
  private routerGoGrafana() {
    const host = this.stateTopo.currentNode.host;
    if (host === undefined || host === '') {
      return;
    }
    window.open('https://view.baocloud.cn:7081/dashboards/?host=' + host);
  }
  private drillDownTopo() {
    this.SET_TOPO_CURRENT_SERVICE({
      key: this.stateTopo.currentNode.id,
      label: this.stateTopo.currentNode.displayName,
    });
    this.SET_SELECTED_CI_CODE('');
    this.SET_SELECTED_CI_ID('');
    this.SET_SELECTED_TS('');
    this.GET_SERVICE_TOPO({duration: this.durationTime, serviceId: this.stateTopo.currentNode.id});
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
  private updateDefInfo() {
    this.editName = this.stateTopo.currentNode.userDefName;
    this.editType = this.stateTopo.currentNode.userDefNodeType;
    this.SET_TOPO_EDIT_SHOW(true);
  }
  private commitUpdate() {
    this.SET_TOPO_EDIT_SHOW(false);
    if (this.editName !== this.stateTopo.currentNode.userDefName) {
      this.UPDATE_USER_DEF_NAME({serviceSequence: this.stateTopo.currentNode.id, userDefineNodeName: this.editName});
    }
    if (this.editType !== this.stateTopo.currentNode.userDefNodeType) {
      this.UPDATE_USER_DEF_NODE_TYPE({serviceSequence: this.stateTopo.currentNode.id,
          userDefineNodeType: this.editType});
    }
    this.GET_TOPO({tenantId: this.rocketbotGlobal.currentTenant, bsIds: this.stateTopo.currentTopoBs.key,
      tsIds: this.stateTopo.currentTopoTs.key, nodeIds: this.stateTopo.currentTopoNode.key,
      duration: this.durationTime});
  }
  private cancelUpdate() {
    this.SET_TOPO_EDIT_SHOW(false);
  }
  private clickStat(applicationId: any) {
    this.$emit('clickStat', applicationId);
  }
  private searchNode() {
    if (this.stateTopo.showSearch) {
      this.SET_TOPO_SEARCH_SHOW(false);
    } else {
      this.SET_TOPO_SEARCH_SHOW(true);
    }
  }
  private commitSearch() {
    const inputName = this.searchName;
    this.stateTopo.nodes.forEach((i: any) => {
      if (i.name.indexOf(inputName) !== -1 || (i.userDefName !== undefined && i.userDefName.indexOf(inputName) !== -1)) {
        this.searchResult.push(i.id);
      }
    });
    if (this.searchResult.length === 0) {
      this.showSearchTooltip = true;
    } else {
      this.locateNext();
    }
  }
  private cancleSearch() {
    this.SET_TOPO_SEARCH_SHOW(false);
  }
  private locateNext() {
    if (this.locateIndex === this.searchResult.length) {
      this.locateIndex = 0;
    }
    this.$emit('clickStat', this.searchResult[this.locateIndex]);
    this.locateIndex++;
  }
}
</script>
<style lang="scss">
.link-topo-aside{
  width: 280px;
  position: absolute;
  right: 40px;
  top: 80px;
  .to-apm{
    padding-top: 10px;
    border-top: 1px solid #d8d8d866;
  }
}
.link-topo-aside-box-btn{
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
.link-topo-aside-btn{
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
.link-topo-aside-box{
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
    word-wrap:break-word;
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
