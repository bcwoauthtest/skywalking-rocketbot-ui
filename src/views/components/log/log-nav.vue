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
  <nav class="rk-log-nav">
    <span v-for="(i, index) in rocketLog.kis" :key="index" class="mr-20">
      <a class="rk-log-nav-i b" @click="changeKi(rocketLog.kis[index])" :class="{'active': rocketLog.currentKi.kiLabel === i.kiLabel}">{{i.kiName}}</a>
    </span>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class LogNav extends Vue {
  @State('rocketLog') private rocketLog: any;
  @Mutation('rocketLog/SET_CURRENT_KI') private SET_CURRENT_KI: any;
  public changeKi(ki: any) {
    this.SET_CURRENT_KI(ki);
    this.$emit('changeKi', ki);
  }
}
</script>

<style lang="scss" scoped>
.rk-log-nav{
  box-shadow: 0 1px 0px rgba(0, 0, 0, 0.08);
  background-color: rgba(196, 200, 225, .2);
  padding: 0 15px;
}
.rk-log-nav-sel{
  outline: none;
  border: 0;
}
.rk-log-nav-add{
  position: relative;
}
.rk-log-nav-add-box{
  position: absolute;
  left: -10px;
  top: 35px;
  padding: 10px 5px;
  z-index: 1;
  border-radius: 4px;
  color: #eee;
  background-color: #252a2f;
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.1), 0 1px 3px 0 rgba(0,0,0,.08);
}
.rk-log-nav-add-box:after {
	bottom: 100%;
	left: 10px;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	border-color: rgba(136, 183, 213, 0);
	border-bottom-color: #333840;
	border-width: 8px;
	margin-left: 0px;
}
.rk-log-nav-input{
  border: 0;
  outline: 0;
  padding: 1px 8px;
  border-radius: 4px;
}
.rk-log-nav-i{
  display: inline-block;
  height: 41px;
  line-height: 40px;
  border-bottom: 2px;
  border-bottom-style: solid;
  color: rgba(61, 68, 79, .6);
  border-color: rgba(0, 0, 0, 0);
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &:hover{
    color: #448dfe;
  }
  &.active{
    color: #448dfe;
    border-color: #448dfe;
  }
}
</style>
