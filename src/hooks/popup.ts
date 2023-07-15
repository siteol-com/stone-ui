import { reactive } from 'vue';

export interface PopUp {
  pop: boolean;
  add: boolean;
  edit: boolean;
  get: boolean;
  itemId: number;
  header: string | boolean;
  subHeader: string | boolean;
  closePop: () => any;
}

// 通用弹层处理逻辑
export default function usePopup() {
  const popup = reactive<PopUp>({
    pop: false,
    add: false,
    edit: false,
    get: false,
    itemId: 0,
    header: '',
    subHeader: '',
    // 关闭弹层
    closePop: () => {
      popup.pop = false;
      popup.add = false;
      popup.edit = false;
      popup.get = false;
      popup.itemId = 0;
      popup.header = '';
      popup.subHeader = '';
    },
  });
  // 打开弹层
  const openPop = (openType: string, itemId: number, header: string, subHeader: string) => {
    popup.pop = true;
    (popup as any)[openType] = true;
    popup.itemId = itemId;
    popup.header = header;
    popup.subHeader = subHeader;
  };
  return {
    popup,
    openPop,
  };
}
