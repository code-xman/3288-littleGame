<!-- Created by xj on 2021-05-28. myLayout -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          3288 Little Game
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          菜单
        </q-item-label>
        <q-item
          clickable
          v-for="item in list"
          :key="item.name"
          :to="item.path"
          :inset-level="1"
        >
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <q-page :style-fn="tweak" class="bg-grey-3">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { ref } from '@vue/composition-api'
export default {
  name: 'myLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const list = [
      {
        name: 'home',
        title: '首页',
        path: '/home'
      },
      {
        name: 'earthDefense',
        title: 'earthDefense',
        path: 'earthDefense'
      }
    ]
    function tweak (offset, height) {
      return { height: `${height - offset}px` }
    }
    return {
      leftDrawerOpen,
      list,
      tweak
    }
  }
}
</script>
<style lang="scss" scoped></style>
