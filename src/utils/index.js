/*
 * @Author: xiangjie
 * @Date: 2020-11-27 17:01:19
 * @Last Modified by: xiangjie
 * @Last Modified time: 2021-06-07 10:42:28
 */

import XEUtils from 'xe-utils'
import { Notify } from 'quasar'

/***
 * 按值而非引用复制对象
 * @param {*} data 传入的DATA
 * @returns 返回的对象
 */
const copy = data => {
  return XEUtils.clone(data, true)
}

/**
 * 提示
 * @param {String} type 类型
 * @param {String} message 提示信息
 * @param {String} color 颜色
 */
const notify = ({ type, message, color }) => {
  Notify.create({
    type,
    color: color || type,
    message,
    actions: [{ icon: 'close', color: 'white' }]
  })
}

export { copy, notify }
