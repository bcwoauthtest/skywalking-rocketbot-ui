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
  <div class="rk-log flex-v">
    <LogTool :durationTime="durationTime"/>
    <div style="flex-grow: 1;">
      <LogTable :data="rocketLog.logs" :kiInfo="rocketLog.kis"/>
    </div>
    <div class="rk-log-t-loading" v-if="rocketLog.kis.length === 0">该应用暂未上报日志</div>
    <div class="rk-log-t-loading" v-else-if="rocketLog.kis.length !== 0 && rocketLog.logs.length === 0">该应用暂未上报日志或在所选时间段内无日志</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LogTool from '../components/log/log-tool.vue';
import LogTable from '../components/log/log-table.vue';
import { State, Action, Getter } from 'vuex-class';
import log from '@/store/modules/log';

@Component({
  components: { LogTool, LogTable },
})
export default class Log extends Vue {
  @State('rocketbot') private rocketGlobal: any;
  @State('rocketLog') private rocketLog!: any;
  @Action('rocketLog/GET_SERVICES') private GET_SERVICES: any;
  @Getter('durationTime') private durationTime: any;

  private beforeMount() {
    this.GET_SERVICES({isAddress: '-1', tenantId: this.rocketGlobal.currentTenant,
        bsIds: this.rocketGlobal.selectedBs, duration: this.durationTime});
  }
  private beforeCreate() {
    this.$store.registerModule('rocketLog', log);
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketLog');
  }

}
</script>

<style lang="scss">
.rk-log {
  flex-grow: 1;
  height: 100%;
}
.rk-log-t-loading{
    text-align: center;
    position: absolute;
    width: 100%;
    height: 70px;
    margin-top: 80px;
    line-height: 88px;
    overflow: hidden;
    .icon{
        width: 30px;
        height: 30px;
    }
}
</style>
