
import multiavatar from '@multiavatar/multiavatar/esm'
//创建头像
export function createAvatar(val: any) {
  const blob = new Blob([multiavatar(val + new Date().getTime())], {
    type: 'image/svg+xml;charset=utf-8'
  })
  const link = URL.createObjectURL(blob)
  return link
}
