import { reactive } from 'vue';

export interface PopUp {
  pop: boolean;
  add: boolean;
  edit: boolean;
  get: boolean;
  itemId: number;
  header: string | boolean;
  subHeader: string | boolean;
  useObj: any; // 需要传递的对象
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
    useObj: {},
  });
  // 传递对象的打开模式
  const openPopWithObj = (openType: string, itemId: number, header: string, subHeader: string, obj: any) => {
    popup.pop = true;
    (popup as any)[openType] = true;
    popup.itemId = itemId;
    popup.header = header;
    popup.subHeader = subHeader;
    popup.useObj = obj;
  };
  // 打开弹层
  const openPop = (openType: string, itemId: number, header: string, subHeader: string) => {
    openPopWithObj(openType, itemId, header, subHeader, {});
  };
  return {
    popup,
    openPop,
    openPopWithObj,
  };
}
