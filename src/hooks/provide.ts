import { provide, inject } from 'vue';

export const provideByName = (name: string, obj: any) => {
  // 传递对象
  provide(name, obj);
};
