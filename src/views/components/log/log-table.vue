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
<div class="rk-log-table clear">
  <div v-for="(m,index) in data" :key="index" class="mb-10 clear">
    <div class="g-sm-2 grey sm hide-xs rk-log-time-line tc">{{m[rocketLog.currentKi.valueColumn.code]| dateformat}}</div>
    <div class="rk-log-table-i g-sm-9">
      <div v-for="j in rocketLog.currentKi.kiColumns" v-if="j.ifValueColumn !== '1' && m[j.code] !== undefined && m[j.code] !== ''" class="message mb-5 b flex-h">
        <div class="mr-10 sm" style="white-space:nowrap;">{{j.cname}} : </div>
        <div>{{m[j.code]}}{{j.unit}}</div>
      </div>
      <div class="message mb-5 b flex-h" v-if="hasSuggestion(m)">
        <div class="mr-10 sm" style="color:red;white-space:nowrap;">优化建议 : </div>
        <div style="color:red;">当前查询为全表扫描，建议创建索引，提升查询性能</div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class LogTable extends Vue {
  @State('rocketLog') private rocketLog: any;
  @Prop({default: () => []}) private data: any;
  private hasSuggestion(log: any) {
    if (this.rocketLog.currentKi.kiLabel === 'L00015') {
      if (log['operationDetail'].indexOf('COLLSCAN') !== -1) {
        return true;
      }
    }
    return false;
  }
}
</script>

<style lang="scss" scoped>
.rk-log-table{
  padding: 30px 20px 20px 40px;

}
.rk-log-time-line{
  padding: 20px 0;
  min-height: 63px;
}
.rk-log-table-i{
  padding: 10px 15px;
  border-left: 4px solid rgba(46, 47, 51, 0.05);
  position: relative;
  &:after{
    content: '';
    display: inline-block;
    position: absolute;
    width: 7px;
    height: 7px;
    left: -23px;
    top: 25px;
    border-radius: 4px;
    background-color: #448dfe;
  }
  &:before{
    content: '';
    display: inline-block;
    position: absolute;
    width: 1px;
    height: calc(100% + 11px);
    top: 0;
    left: -20px;
    border-radius: 5px;
    background-color: #448dfe99;
  }
}
.rk-log-table-i-scope{
  display: inline-block;
  padding: 0px 8px;
  border: 1px solid;
  margin-top: -1px;
  border-radius: 4px;
}
</style>
