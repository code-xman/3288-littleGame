<template>
  <q-page class="fit q-pa-md">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" /> -->
    <q-card class="fit column">
      <q-card-section class="q-pa-sm">
        <q-btn
          v-for="gameItem in gameList"
          :key="gameItem.type"
          :label="gameItem.label"
          :color="gameItem.color || 'primary'"
          :text-color="gameItem.textColor || 'white'"
          @click="gameClick(gameItem.type)"
        ></q-btn>
      </q-card-section>
      <q-dialog v-model="dialogObj.dialogShow">
        <q-card>
          <q-card-section>
            <div class="text-h6">背景说明</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <p>{{ dialogObj.backgroundNotes }}</p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="取消" v-close-popup />
            <q-btn
              flat
              label="开始"
              color="primary"
              v-close-popup
              @click="toGame"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script>
import { reactive } from '@vue/composition-api'
import { earthDefense } from 'src/textData'
export default {
  name: 'PageIndex',
  setup (props, { root }) {
    const dialogObj = reactive({
      dialogShow: false,
      backgroundNotes: '',
      path: ''
    })

    const gameList = [
      {
        label: 'Earth Defense',
        type: 'earthDefense',
        path: 'findChain'
      }
    ]
    const gameClick = type => {
      dialogObj.dialogShow = true
      switch (type) {
        case 'earthDefense':
          dialogObj.backgroundNotes = earthDefense.backgroundNotes
          dialogObj.path = gameList.find(item => item.type === type).path
          break

        default:
          break
      }
    }

    const toGame = () => {
      root.$router.push(dialogObj.path)
    }

    return {
      gameList,
      gameClick,
      dialogObj,
      toGame
    }
  }
}
</script>
