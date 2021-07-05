<!-- Created by xj on 2021-05-30. earthDefense -->
<template>
  <div class="fit q-pa-md">
    <q-card class="fit column">
      <q-card-section class="q-pa-sm">
        <q-btn-group push glossy class="q-my-sm">
          <q-btn
            v-for="btn in btns"
            :key="btn.type"
            :label="btn.label"
            :color="btn.color"
            :text-color="btn.textColor || 'white'"
            :disable="btnTimes[btn.type] < 1"
            class="btn"
            @click="btnClick(btn.type)"
          />
        </q-btn-group>
        <q-circular-progress
          show-value
          font-size="12px"
          :value="(btnTimes.accuracyQuery * 100) / 3"
          size="50px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="float-right q-mx-xs"
        >
          {{ btnTimes.accuracyQuery }}/ 3
        </q-circular-progress>
        <q-circular-progress
          show-value
          font-size="12px"
          :value="(btnTimes.query * 100) / 10"
          size="50px"
          :thickness="0.22"
          color="light-blue"
          track-color="grey-3"
          class="float-right q-mx-xs"
        >
          {{ (btnTimes.query * 100) / 10 }}%
        </q-circular-progress>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <!-- :rules="[val => !!val || '请输入数据']" -->
        <q-input
          outlined
          placeholder="请输入测试数据"
          v-model="inputVal"
          :maxlength="strLength"
        />
      </q-card-section>
      <q-card-section class="col q-pa-sm scroll">
        <q-table
          row-key="name"
          no-data-label="暂无"
          binary-state-sort
          :data="tableData"
          :columns="tableColumns"
        >
          <template v-slot:body-cell-result="props">
            <q-td :props="props">
              <div>
                <q-badge color="teal" :label="props.value.green" />
                /
                <q-badge color="orange" :label="props.value.orange" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-page-sticky
        ref="fabRef"
        class="z-top"
        position="bottom-right"
        :offset="fabObj.fabPos"
      >
        <q-fab
          padding="sm"
          color="accent"
          icon="keyboard_arrow_up"
          :direction="fabObj.dir"
          v-touch-pan.prevent.mouse="moveFab"
        >
          <q-fab-action
            color="accent"
            @click="backStart"
            icon="menu"
            label="重新开始"
            external-label
            :label-position="fabObj.again"
          />
        </q-fab>
      </q-page-sticky>
      <q-dialog v-model="dialogObj.dialogShow">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ dialogObj.endingName }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <p>{{ dialogObj.ending }}</p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              flat
              label="确定"
              color="primary"
              v-close-popup
              @click="backStart"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>
<script>
import { dom } from 'quasar'
import { reactive, ref, watch } from '@vue/composition-api'
import { earthDefense } from 'src/textData'
import { notify } from 'src/utils/index'
export default {
  name: 'earthDefense',
  setup () {
    // 字符长度
    const strLength = 5
    // 转化数
    const changeNum = 10
    // answer
    const answer = Math.random()
      .toString(changeNum)
      .slice(-strLength)
    console.log('answer :>> ', answer)

    // 结果
    const resObj = ref({
      // 精确结果 正显误*
      accuracyResult: '',
      // 正确的
      green: 0,
      // 数字位置有误的
      orange: 0
    })
    // input 输入结果
    const inputVal = ref('')

    // 表格
    const tableColumns = [
      {
        name: 'inputVal',
        required: true,
        label: '历史记录',
        align: 'center',
        field: 'inputVal',
        sortable: true
      },
      {
        name: 'accuracyResult',
        required: true,
        label: '精确结果',
        align: 'center',
        field: 'accuracyResult',
        sortable: true
      },
      {
        name: 'result',
        align: 'center',
        label: '结果',
        field: 'result',
        sortable: true
      }
    ]
    const tableData = ref([])

    // 按钮
    const btnTimes = ref({
      accuracyQuery: 3,
      query: 10,
      end: 0
    })

    const btns = [
      {
        label: '测试',
        color: 'white',
        textColor: 'black',
        type: 'query'
      },
      {
        label: '精度测试',
        color: 'primary',
        type: 'accuracyQuery'
      },
      {
        label: '查看结果',
        color: 'teal',
        type: 'end'
      }
    ]

    function btnClick (type) {
      if (inputVal.value.length !== strLength && type !== 'end') {
        notify({
          type: 'negative',
          message: '请输入' + strLength + '个字符'
        })
        return
      }

      switch (type) {
        // 测试
        case 'query': {
          if (btnTimes.value.query < 1) {
            notify({
              type: 'warning',
              message: '所剩蓝晶能源不足'
            })
            break
          }
          handleData(inputVal.value)
          tableData.value.push({
            inputVal: inputVal.value,
            accuracyResult: '',
            result: {
              green: resObj.value.green,
              orange: resObj.value.orange
            }
          })
          inputVal.value = ''
          btnTimes.value.query -= 1
          break
        }
        // 精确测试
        case 'accuracyQuery': {
          if (btnTimes.value.query < 1) {
            notify({
              type: 'warning',
              message: '所剩蓝晶能源不足'
            })
            break
          }
          if (btnTimes.value.accuracyQuery === 1) {
            notify({
              type: 'warning',
              message: '所剩绿晶能源不足'
            })
          }
          handleData(inputVal.value)
          tableData.value.push({
            inputVal: inputVal.value,
            accuracyResult: resObj.value.accuracyResult,
            result: {
              green: resObj.value.green,
              orange: resObj.value.orange
            }
          })
          inputVal.value = ''
          btnTimes.value.accuracyQuery -= 1
          btnTimes.value.query -= 1
          break
        }
        // end
        case 'end': {
          endFn()
          break
        }

        default: {
          break
        }
      }
    }

    // 查看结果
    function endFn () {
      const fateNum = Math.random()
      const score = resObj.value.green * 2 + resObj.value.orange
      const endObj = {
        type: '',
        num: 0
      }
      if (score === 10) {
        endObj.type = 'success'
      } else if (score >= 6) {
        endObj.type = 'mid'
      } else {
        endObj.type = 'fail'
      }

      endObj.num = earthDefense.endingName[endObj.type].length
      dialogObj.endingName =
        earthDefense.endingName[endObj.type][Math.floor(fateNum * endObj.num)]
      dialogObj.ending =
        earthDefense.ending[endObj.type][Math.floor(fateNum * endObj.num)]
      dialogObj.dialogShow = true
    }

    watch(tableData, () => {
      if (tableData.value.length > 5) {
        btnTimes.value.end = 1
      } else {
        btnTimes.value.end = 0
      }
    })

    // 处理数据
    function handleData (value) {
      clearCache()
      const arr = answer.split('')
      arr.forEach((item, index) => {
        if (value[index] === item) {
          resObj.value.green += 1
          resObj.value.accuracyResult += item
        } else if (value.indexOf(item) >= 0) {
          resObj.value.orange += 1
          resObj.value.accuracyResult += '*'
        } else {
          resObj.value.accuracyResult += '*'
        }
      })
    }

    // 清楚测试缓存
    function clearCache () {
      resObj.value = {
        accuracyResult: '',
        green: 0,
        orange: 0
      }
    }

    // 可拖动按钮数据
    const { offset } = dom
    // ref fabRef
    const fabRef = ref(null)
    // 可拖动按钮数据
    const fabObj = reactive({
      fabPos: [30, 30],
      draggingFab: false,
      dir: 'up',
      again: 'left'
    })
    function moveFab (ev) {
      fabObj.draggingFab = ev.isFirst !== true && ev.isFinal !== true
      // x y 为fab距原点的x/y方向的距离
      let x = fabObj.fabPos[0] - ev.delta.x
      let y = fabObj.fabPos[1] - ev.delta.y
      if (ev.isFinal) {
        // top/left 为fab在页面上距 上/左边的距离
        const { top, left } = offset(fabRef.value.$el)
        // console.log(top, left)
        // console.log('fabObj.fabPos :>> ', fabObj.fabPos)

        // 根据情况改变 展开项的展开方向
        if (y > top) {
          fabObj.dir = 'down'
        } else {
          fabObj.dir = 'up'
        }
        if (x > left) {
          fabObj.again = 'right'
        } else {
          fabObj.again = 'left'
        }

        // 处理fab被拖入不可见区域
        if (top < 0) {
          y = top + y - 17
        } else if (y < 0) {
          y = 17
        }
        if (left < 0) {
          x = left + x - 17
        } else if (x < 0) {
          x = 17
        }
      }

      fabObj.fabPos = [x, y]
    }

    // 重新开始
    function backStart () {
      inputVal.value = ''
      tableData.value = []
      clearCache()
      btnTimes.value = {
        accuracyQuery: 3,
        query: 10,
        end: 0
      }
    }

    // dialogObj
    const dialogObj = reactive({
      dialogShow: false,
      endingName: '',
      ending: ''
    })
    return {
      strLength,
      inputVal,
      tableColumns,
      tableData,
      btns,
      btnTimes,
      btnClick,
      fabRef,
      fabObj,
      moveFab,
      backStart,
      dialogObj
    }
  }
}
</script>
<style lang="scss" scoped></style>
