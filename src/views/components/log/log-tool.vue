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
<div>
  <div class="rk-log-tool">
    <a class="rk-log-search-btn bg-blue r mr-10" @click="handleSearch">
      <svg class="icon mr-5 vm">
        <use xlink:href="#search"></use>
      </svg>
    <span class="vm">{{this.$t('search')}}</span>
    </a>
    <div class="flex-h">
        <!--<LogSelect :title="this.$t('service')" @input="handleFilter" :data="alarmOptions"/>-->
      <!--<div>-->
        <!--<span class="sm b grey mr-10">{{this.$t('serviceFilter')}}:</span>-->
        <!--&lt;!&ndash;<select :value="service" class="app" style="background: 0; border: 0; outline: none;color: #efefef;"  @change="handleFilter($event)">&ndash;&gt;-->
          <!--&lt;!&ndash;&lt;!&ndash;<option  style="background-color: #25292f;" :value="{ key: 'default',label: 'default' }">所有</option>&ndash;&gt;&ndash;&gt;-->
          <!--&lt;!&ndash;<option style="background-color: #25292f;" v-for="i in rocketLog.services" :key="i.key" :value="i" >{{i.label}}</option>&ndash;&gt;-->
        <!--&lt;!&ndash;</select>&ndash;&gt;-->
      <!--</div>-->
      <ServiceSelect :hasSearch="true" :title="this.$t('serviceFilter')" :value="service" @input="chooseService" :data="rocketLog.services"/>
      <div>
        <span class="sm b grey mr-5">{{this.$t('timeRange')}}:</span>
        <RkDate class="sm" v-model="time" position="bottom" format="YYYY-MM-DD HH:mm:ss"/>
      </div>
    </div>
  </div>
  <LogNav @changeKi="changeCurrentKi"/>
  <RkPage v-if="rocketLog.queryLogEnd && rocketLog.total !== 0" class="mt-15 r" :currentSize="20" :currentPage="pageNum" @changePage="handlePage" :total="rocketLog.total"/>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { Option } from '../../../store/interfaces';
import ServiceSelect from '../../../components/rk-service-select.vue';
import LogNav from './log-nav.vue';
@Component({components: {ServiceSelect, LogNav}})
export default class LogTool extends Vue {
  @State('rocketbot') private rocketGlobal: any;
  @State('rocketLog') private rocketLog: any;
  @Action('rocketLog/GET_LOGS') private GET_LOGS: any;
  @Action('rocketLog/GET_KI_INFOS') private GET_KI_INFOS: any;
  @Prop() private durationTime: any;
  private pageNum: number = 1;
  private time: Date[] = [new Date(new Date().getTime() - 900000) , new Date()];
  private service: Option  = {label: '所有', key: ''};

  private handlePage(pageNum: number) {
    this.pageNum = pageNum;
    this.handleRefresh(pageNum, true);
  }
  private chooseService(i: any) {
    if (this.service.key === i.key) {
      return;
    }
    this.service = i;
    if (this.service.key !== '') {
      const params: any = {
        serviceId: this.service.key,
        queryDuration: this.timeFormat(this.time),
      };
      this.GET_KI_INFOS(params);
    }
  }
  private changeCurrentKi(ki: any) {
    this.pageNum = 1;
    this.handleRefresh(this.pageNum, false);
  }
  private handleSearch() {
    this.pageNum = 1;
    this.handleRefresh(this.pageNum, false);
  }
  private handleRefresh(pageNum: number, isChangePage: boolean) {
    const logParams: any = {
      isChangePage,
      ciCode: this.rocketLog.currentCiCode,
      kiLabel: this.rocketLog.currentKi.kiLabel.toLowerCase(),
      valueColumnLabel: this.rocketLog.currentKi.valueColumn.code,
      queryDuration: this.timeFormat(this.time),
      paging: {
        pageNum,
        pageSize: 20,
        needTotal: true,
      },
    };
    this.GET_LOGS(logParams);
  }

  private dateFormate(date: Date) {
    const year = date.getFullYear();

    const monthTemp = date.getMonth() + 1;
    let month: string = `${monthTemp}`;
    if (monthTemp < 10) {
        month = `0${monthTemp}`;
    }
    const dayTemp = date.getDate();
    let day: string = `${dayTemp}`;
    if (dayTemp < 10) { day = `0${dayTemp}`; }

    const hourTemp = date.getHours();
    let hour: string = `${hourTemp}`;
    if (hourTemp < 10) { hour = `0${hourTemp}`; }

    const minuteTemp = date.getMinutes();
    let minute: string = `${minuteTemp}`;
    if (minuteTemp < 10) { minute = `0${minuteTemp}`; }

    const secondTemp = date.getSeconds();
    let second: string = `${secondTemp}`;
    if (secondTemp < 10) { second = `0${secondTemp}`; }

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  private timeFormat(time: Date[]) {
    return { start: this.dateFormate(time[0]), end: this.dateFormate(time[1])};
  }
  private beforeMount() {
    this.time = [this.rocketGlobal.duration.start, this.rocketGlobal.duration.end];
  }
  private mounted() {
    this.service = this.rocketGlobal.currentService;

    if (this.service.key !== '') {
      const params: any = {
        serviceId: this.service.key,
        queryDuration: this.timeFormat(this.time),
      };
      this.GET_KI_INFOS(params);
    }
  }
}
</script>

<style lang="scss">
.rk-log-tool{
  border-bottom:1px solid #c1c5ca41;
  background-color: #333840;
  padding: 0 15px;
  color: #efefef;
  flex-shrink: 0;
  width: 100%;
  height: 35px;
}
.rk-log-tool-input {
  border-style: unset;
  outline: 0;
  padding: 2px 5px;
  border-radius: 3px;
}
.rk-log-search-btn{
  padding: 3px 9px;
  background-color: #484b55;
  border-radius: 4px;
  margin-top: 3px;
  &.bg-blue{
    background-color: #448dfe;
  }
}
</style>
